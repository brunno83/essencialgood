// Unit Tests for Turnstile Action Logic & Strict Dummy Bypass Rules
// Execute with: node scripts/staging/test_turnstile_unit.js

import assert from "assert";

const ALLOWED_TURNSTILE_HOSTNAMES = [
  "essencialgood.com",
  "www.essencialgood.com",
];

async function validateTurnstileTokenMock(options, envVars = {}) {
  const { token, expectedAction, mockResponse } = options;

  if (!token || typeof token !== "string" || token.trim().length === 0) {
    return { valid: false, errorCode: "MISSING_TURNSTILE_TOKEN" };
  }

  const environment = (envVars["DENO_ENV"] || envVars["ENVIRONMENT"] || "").toLowerCase().trim();
  const isStagingOrDev = environment === "staging" || environment === "development" || environment === "test";

  const data = mockResponse;
  if (!data) return { valid: false, errorCode: "TURNSTILE_PROVIDER_ERROR" };

  const success = Boolean(data.success);
  const hostname = typeof data.hostname === "string" ? data.hostname.trim() : "";
  const action = typeof data.action === "string" ? data.action.trim() : "";
  const metadata = typeof data.metadata === "object" && data.metadata !== null ? data.metadata : null;
  const isTestingKey = Boolean(metadata?.result_with_testing_key);

  if (!success) {
    return { valid: false, errorCode: "TURNSTILE_REJECTED" };
  }

  const lowerHost = hostname.toLowerCase();

  // Bypass EXCLUSIVO para chave dummy oficial da Cloudflare (hostname == "example.com")
  const isDummyTestBypass = isStagingOrDev && success && isTestingKey && lowerHost === "example.com";

  if (isDummyTestBypass) {
    return { valid: true };
  }

  if (!ALLOWED_TURNSTILE_HOSTNAMES.includes(lowerHost)) {
    return { valid: false, errorCode: "TURNSTILE_HOSTNAME_MISMATCH" };
  }

  if (!action || action !== expectedAction.trim()) {
    return { valid: false, errorCode: "TURNSTILE_ACTION_MISMATCH" };
  }

  return { valid: true };
}

async function runUnitTests() {
  console.log("==========================================");
  console.log("TURNSTILE STRICT ACTION & BYPASS UNIT TESTS");
  console.log("==========================================");

  const stagingEnv = { ENVIRONMENT: "staging" };
  const prodEnv = { ENVIRONMENT: "production" };

  // Assert 1: staging + testing key + example.com + success = ACEITA
  {
    const res = await validateTurnstileTokenMock({
      token: "dummy_token",
      expectedAction: "create_conversation",
      mockResponse: { success: true, hostname: "example.com", action: "", metadata: { result_with_testing_key: true } }
    }, stagingEnv);
    assert.strictEqual(res.valid, true, "Assert 1 Failed");
    console.log("-> Assert 1 PASSED: staging + testing key + example.com + success aceita");
  }

  // Assert 2: staging + testing key + hostname vazio = REJEITA
  {
    const res = await validateTurnstileTokenMock({
      token: "dummy_token",
      expectedAction: "create_conversation",
      mockResponse: { success: true, hostname: "", action: "", metadata: { result_with_testing_key: true } }
    }, stagingEnv);
    assert.strictEqual(res.valid, false, "Assert 2 Failed");
    assert.strictEqual(res.errorCode, "TURNSTILE_HOSTNAME_MISMATCH");
    console.log("-> Assert 2 PASSED: staging + testing key + hostname vazio rejeita");
  }

  // Assert 3: staging + testing key + dummy = REJEITA
  {
    const res = await validateTurnstileTokenMock({
      token: "dummy_token",
      expectedAction: "create_conversation",
      mockResponse: { success: true, hostname: "dummy", action: "", metadata: { result_with_testing_key: true } }
    }, stagingEnv);
    assert.strictEqual(res.valid, false, "Assert 3 Failed");
    assert.strictEqual(res.errorCode, "TURNSTILE_HOSTNAME_MISMATCH");
    console.log("-> Assert 3 PASSED: staging + testing key + dummy rejeita");
  }

  // Assert 4: staging + testing key + localhost = REJEITA
  {
    const res = await validateTurnstileTokenMock({
      token: "dummy_token",
      expectedAction: "create_conversation",
      mockResponse: { success: true, hostname: "localhost", action: "", metadata: { result_with_testing_key: true } }
    }, stagingEnv);
    assert.strictEqual(res.valid, false, "Assert 4 Failed");
    assert.strictEqual(res.errorCode, "TURNSTILE_HOSTNAME_MISMATCH");
    console.log("-> Assert 4 PASSED: staging + testing key + localhost rejeita");
  }

  // Assert 5: staging + testing key + 127.0.0.1 = REJEITA
  {
    const res = await validateTurnstileTokenMock({
      token: "dummy_token",
      expectedAction: "create_conversation",
      mockResponse: { success: true, hostname: "127.0.0.1", action: "", metadata: { result_with_testing_key: true } }
    }, stagingEnv);
    assert.strictEqual(res.valid, false, "Assert 5 Failed");
    assert.strictEqual(res.errorCode, "TURNSTILE_HOSTNAME_MISMATCH");
    console.log("-> Assert 5 PASSED: staging + testing key + 127.0.0.1 rejeita");
  }

  // Assert 6: staging sem result_with_testing_key = REJEITA example.com
  {
    const res = await validateTurnstileTokenMock({
      token: "token",
      expectedAction: "create_conversation",
      mockResponse: { success: true, hostname: "example.com", action: "create_conversation", metadata: {} }
    }, stagingEnv);
    assert.strictEqual(res.valid, false, "Assert 6 Failed");
    assert.strictEqual(res.errorCode, "TURNSTILE_HOSTNAME_MISMATCH");
    console.log("-> Assert 6 PASSED: staging sem result_with_testing_key rejeita example.com");
  }

  // Assert 7: production + testing key + example.com = REJEITA
  {
    const res = await validateTurnstileTokenMock({
      token: "dummy_token",
      expectedAction: "create_conversation",
      mockResponse: { success: true, hostname: "example.com", action: "", metadata: { result_with_testing_key: true } }
    }, prodEnv);
    assert.strictEqual(res.valid, false, "Assert 7 Failed");
    assert.strictEqual(res.errorCode, "TURNSTILE_HOSTNAME_MISMATCH");
    console.log("-> Assert 7 PASSED: production + testing key + example.com rejeita");
  }

  // Assert 8: action correta aceita no caminho normal
  {
    const res = await validateTurnstileTokenMock({
      token: "real_token",
      expectedAction: "create_conversation",
      mockResponse: { success: true, hostname: "essencialgood.com", action: "create_conversation" }
    }, stagingEnv);
    assert.strictEqual(res.valid, true, "Assert 8 Failed");
    console.log("-> Assert 8 PASSED: action correta aceita no caminho normal (essencialgood.com)");
  }

  // Assert 9: action trocada ou vazia rejeita no caminho normal
  {
    const resSwapped = await validateTurnstileTokenMock({
      token: "real_token",
      expectedAction: "create_conversation",
      mockResponse: { success: true, hostname: "essencialgood.com", action: "submit_lead" }
    }, stagingEnv);
    assert.strictEqual(resSwapped.valid, false, "Assert 9A Failed");
    assert.strictEqual(resSwapped.errorCode, "TURNSTILE_ACTION_MISMATCH");

    const resEmpty = await validateTurnstileTokenMock({
      token: "real_token",
      expectedAction: "create_conversation",
      mockResponse: { success: true, hostname: "essencialgood.com", action: "" }
    }, stagingEnv);
    assert.strictEqual(resEmpty.valid, false, "Assert 9B Failed");
    assert.strictEqual(resEmpty.errorCode, "TURNSTILE_ACTION_MISMATCH");

    console.log("-> Assert 9 PASSED: action trocada ou vazia rejeitada no caminho normal (TURNSTILE_ACTION_MISMATCH)");
  }

  console.log("\nTODOS OS 9 TESTES UNITÁRIOS DO TURNSTILE FORAM EXECUTADOS E APROVADOS!");
}

runUnitTests().catch(err => {
  console.error("UNIT TEST FAILURE:", err);
  process.exit(1);
});
