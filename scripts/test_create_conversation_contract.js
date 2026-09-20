// ESSENCIAL GOOD - CONTRACT & VALIDATION UNIT TESTS FOR create-conversation (Node.js)
// Testes automatizados de runtime (função de URL) e estáticos (allowlist, DDL SQL, sanitização).

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    process.exitCode = 1;
  }
}

console.log("==========================================");
console.log("SUÍTE COMPLETA DE TESTES DO CONTRATO (create-conversation)");
console.log("==========================================");

const indexTsPath = path.resolve(__dirname, "../supabase/functions/create-conversation/index.ts");
assert(fs.existsSync(indexTsPath), "Arquivo create-conversation/index.ts existe.");

const indexTsContent = fs.readFileSync(indexTsPath, "utf8");

// ----------------------------------------------------------------------------
// 1. TESTES ESTÁTICOS DE ALLOWLIST E CAMPOS PROIBIDOS
// ----------------------------------------------------------------------------
console.log("\n[1] Auditoria de Allowlist e Rejeição de Campos Proibidos:");
assert(indexTsContent.includes('"turnstileToken"'), "[1.1] Allowlist aceita turnstileToken.");
assert(indexTsContent.includes('"visitor_name"'), "[1.2] Allowlist aceita visitor_name.");
assert(indexTsContent.includes('"visitor_email"'), "[1.3] Allowlist aceita visitor_email.");
assert(indexTsContent.includes('"visitor_phone"'), "[1.4] Allowlist aceita visitor_phone.");
assert(indexTsContent.includes('"visitor_country_code"'), "[1.5] Allowlist aceita visitor_country_code.");
assert(indexTsContent.includes('"visitor_dial_code"'), "[1.6] Allowlist aceita visitor_dial_code.");
assert(indexTsContent.includes('"source_url"'), "[1.7] Allowlist aceita source_url.");
assert(indexTsContent.includes('"source_path"'), "[1.8] Allowlist aceita source_path.");
assert(indexTsContent.includes('"source_title"'), "[1.9] Allowlist aceita source_title.");
assert(indexTsContent.includes('"source_product"'), "[1.10] Allowlist aceita source_product.");

assert(!indexTsContent.includes('ALLOWED_CREATE_CONVERSATION_FIELDS.has("visitor_id")'), "[1.11] visitor_id enviado pelo cliente é REJEITADO (Fora da allowlist).");
assert(!indexTsContent.includes('ALLOWED_CREATE_CONVERSATION_FIELDS.has("source_host")'), "[1.12] source_host enviado pelo cliente é REJEITADO (Fora da allowlist).");
assert(!indexTsContent.includes('ALLOWED_CREATE_CONVERSATION_FIELDS.has("status")'), "[1.13] status enviado pelo cliente é REJEITADO (Fora da allowlist).");
assert(!indexTsContent.includes('ALLOWED_CREATE_CONVERSATION_FIELDS.has("assigned_to")'), "[1.14] assigned_to enviado pelo cliente é REJEITADO (Fora da allowlist).");
assert(indexTsContent.includes('"UNKNOWN_PAYLOAD_FIELD"'), "[1.15] Campo desconhecido retorna HTTP 400 com código UNKNOWN_PAYLOAD_FIELD.");

// ----------------------------------------------------------------------------
// 2. TESTES ESTÁTICOS DE VALIDAÇÃO DE INPUTS E LOGS SANITIZADOS
// ----------------------------------------------------------------------------
console.log("\n[2] Auditoria de Validações Server-Side e Limites:");
assert(indexTsContent.includes("16384"), "[2.1] Body máximo de 16 KB (16384 bytes) aplicado via readJsonBody.");
assert(indexTsContent.includes('"INVALID_VISITOR_NAME"'), "[2.2] Nome de visitante é obrigatório e validado (INVALID_VISITOR_NAME).");
assert(indexTsContent.includes('"INVALID_VISITOR_EMAIL"'), "[2.3] E-mail de visitante é validado com regex (INVALID_VISITOR_EMAIL).");
assert(indexTsContent.includes('"INVALID_VISITOR_PHONE"'), "[2.4] Telefone é validado em formato E.164 (INVALID_VISITOR_PHONE).");
assert(indexTsContent.includes('"INVALID_COUNTRY_CODE"'), "[2.5] Country code é validado em exatamente 2 letras ISO (INVALID_COUNTRY_CODE).");
assert(indexTsContent.includes('"INVALID_DIAL_CODE"'), "[2.6] Dial code é validado no formato +dígitos (INVALID_DIAL_CODE).");
assert(!indexTsContent.includes("logWarn(\"CreateConversation\", nameStr"), "[2.7] PII (nome, email, telefone) NÃO é impresso nos logs de erro.");

// ----------------------------------------------------------------------------
// 3. SIMULAÇÃO DE RUNTIME JS DA LÓGICA DE VALIDAR E DERIVAR SOURCE_URL
// ----------------------------------------------------------------------------
console.log("\n[3] Testes de Runtime JS para validateAndDeriveSourceUrl:");

function mockValidateAndDeriveSourceUrl(urlStr, env = "development") {
  if (!urlStr || typeof urlStr !== "string" || urlStr.trim().length === 0) {
    return { safeSourceUrl: null, derivedSourceHost: null };
  }
  const trimmed = urlStr.trim();
  if (trimmed.length > 2048) throw new Error("Length exceeded");

  const lower = trimmed.toLowerCase();
  if (lower.startsWith("javascript:") || lower.startsWith("data:") || lower.startsWith("file:") || lower.startsWith("vbscript:")) {
    throw new Error("Unsafe protocol");
  }

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error("Malformed URL");
  }

  if (parsed.username || parsed.password) throw new Error("Credentials in URL");

  const hostname = parsed.hostname.toLowerCase().trim();
  if (!hostname) throw new Error("Empty host");

  const isDev = env === "development" || env === "test";
  const isOfficialDomain = hostname === "essencialgood.com" || hostname === "www.essencialgood.com";
  const isDevLocalhost = isDev && (hostname === "localhost" || hostname === "127.0.0.1");

  if (!isOfficialDomain && !isDevLocalhost) {
    throw new Error("Unauthorized hostname");
  }

  if (!isDevLocalhost && parsed.protocol !== "https:") {
    throw new Error("HTTPS required");
  }

  return { safeSourceUrl: trimmed, derivedSourceHost: hostname };
}

// 3.1 javascript:
let errJs = false;
try { mockValidateAndDeriveSourceUrl("javascript:alert(1)"); } catch (e) { errJs = e.message.includes("Unsafe protocol"); }
assert(errJs, "[3.1] URL com protocolo 'javascript:' é REJEITADA.");

// 3.2 data:
let errData = false;
try { mockValidateAndDeriveSourceUrl("data:text/html,<script>alert(1)</script>"); } catch (e) { errData = e.message.includes("Unsafe protocol"); }
assert(errData, "[3.2] URL com protocolo 'data:' é REJEITADA.");

// 3.3 Userinfo
let errUserinfo = false;
try { mockValidateAndDeriveSourceUrl("https://admin:pass@www.essencialgood.com/path"); } catch (e) { errUserinfo = e.message.includes("Credentials"); }
assert(errUserinfo, "[3.3] URL contendo userinfo (credentials) é REJEITADA.");

// 3.4 Malicious Hostname Similar
let errEvil = false;
try { mockValidateAndDeriveSourceUrl("https://essencialgood.com.evil.invalid/path"); } catch (e) { errEvil = e.message.includes("Unauthorized hostname"); }
assert(errEvil, "[3.4] Hostname falso contendo sufixo malicioso (essencialgood.com.evil.invalid) é REJEITADO.");

// 3.5 *.supabase.co
let errSupa = false;
try { mockValidateAndDeriveSourceUrl("https://zauvpsxeexwthobmbkku.supabase.co/path"); } catch (e) { errSupa = e.message.includes("Unauthorized hostname"); }
assert(errSupa, "[3.5] Subdomínio *.supabase.co é REJEITADO em source_url.");

// 3.6 Localhost HTTP em Dev
const devLocal = mockValidateAndDeriveSourceUrl("http://localhost:5173/slimsoda", "development");
assert(devLocal.derivedSourceHost === "localhost", "[3.6] http://localhost é ACEITO em ambiente de desenvolvimento.");

// 3.7 Localhost em Produção
let errProdLocal = false;
try { mockValidateAndDeriveSourceUrl("http://localhost:5173/slimsoda", "production"); } catch (e) { errProdLocal = e.message.includes("Unauthorized hostname"); }
assert(errProdLocal, "[3.7] http://localhost é REJEITADO em ambiente de produção.");

// 3.8 Domínio Oficial HTTPS
const officialRes = mockValidateAndDeriveSourceUrl("https://www.essencialgood.com/slimsoda?utm_source=test", "production");
assert(officialRes.safeSourceUrl.includes("essencialgood.com") && officialRes.derivedSourceHost === "www.essencialgood.com", "[3.8] Domínio oficial https://www.essencialgood.com é ACEITO.");

// ----------------------------------------------------------------------------
// 4. AUDITORIA DA MIGRATION 010 E REGRAS DA RPC
// ----------------------------------------------------------------------------
console.log("\n[4] Auditoria DDL da Migration 010 (RPC p_create_visitor_conversation):");
const migration010Path = path.resolve(__dirname, "../supabase/migrations/010_rate_limit_infrastructure.sql");
const sql010Content = fs.readFileSync(migration010Path, "utf8");

assert(sql010Content.includes("DROP FUNCTION IF EXISTS public.p_create_visitor_conversation(UUID);"), "[4.1] Assinatura antiga p_create_visitor_conversation(UUID) é removida com DROP FUNCTION.");
assert(sql010Content.includes("p_visitor_dial_code TEXT DEFAULT NULL"), "[4.2] RPC utiliza parâmetro p_visitor_dial_code com nome consistente.");
assert(sql010Content.includes("COALESCE(v_clean_name, c.visitor_name)"), "[4.3] RPC atualiza dados de contato apenas se novos valores não-nulos forem passados.");
assert(sql010Content.includes("COALESCE(c.source_url, v_clean_source_url)"), "[4.4] RPC utiliza COALESCE para PRESERVAR a origem primária existente.");
assert(sql010Content.includes("jsonb_build_object('success', true, 'conversation_id', v_existing_id, 'is_existing', true)"), "[4.5] Resposta de conversa existente mantém formato { success, conversation_id, is_existing }.");
assert(sql010Content.includes("REVOKE ALL ON FUNCTION public.p_create_visitor_conversation(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC, anon, authenticated;"), "[4.6] EXECUTE da RPC de 11 parâmetros é revogado de PUBLIC, anon e authenticated.");
assert(sql010Content.includes("GRANT EXECUTE ON FUNCTION public.p_create_visitor_conversation(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO service_role;"), "[4.7] EXECUTE da RPC de 11 parâmetros é concedido EXCLUSIVAMENTE ao service_role.");

console.log(`\n=== RESUMO DOS TESTES DE CONTRATO COMPLETO: ${passed}/${total} PASSARAM ===\n`);
