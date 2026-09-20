# PowerShell Script for Executing Phase 2A Negative HTTP Tests on STAGING
# Target Project Ref: zauvpsxeexwthobmbkku
# FORBIDDEN Project Ref: axgpmpnipwyfirlplbjv

$ErrorActionPreference = "Stop"

$STAGING_REF = "zauvpsxeexwthobmbkku"
$FORBIDDEN_PROD_REF = "axgpmpnipwyfirlplbjv"

$BASE_URL = "https://$STAGING_REF.supabase.co/functions/v1"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "PHASE 2A STAGING NEGATIVE HTTP TEST SUITE" -ForegroundColor Cyan
Write-Host "Target Base URL: $BASE_URL" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Safety Assertion
if ($BASE_URL -match $FORBIDDEN_PROD_REF) {
    throw "CRITICAL ERROR: Production project reference detected! Aborting execution."
}

Add-Type -AssemblyName System.Net.Http

$httpClient = [System.Net.Http.HttpClient]::new()

function Test-Endpoint {
    param(
        [string]$TestName,
        [string]$Method,
        [string]$FunctionSlug,
        [hashtable]$Headers = @{},
        [string]$Body = $null,
        [string]$ContentType = "application/json"
    )

    Write-Host "`n------------------------------------------" -ForegroundColor Yellow
    Write-Host "Executing Test: $TestName" -ForegroundColor Yellow

    $url = "$BASE_URL/$FunctionSlug"
    $httpMethod = [System.Net.Http.HttpMethod]::new($Method)
    $request = [System.Net.Http.HttpRequestMessage]::new($httpMethod, $url)

    foreach ($key in $Headers.Keys) {
        $request.Headers.TryAddWithoutValidation($key, $Headers[$key]) | Out-Null
    }

    if (-not [string]::IsNullOrEmpty($Body)) {
        $request.Content = [System.Net.Http.StringContent]::new($Body, [System.Text.Encoding]::UTF8, $ContentType)
    }

    $response = $httpClient.SendAsync($request).GetAwaiter().GetResult()
    $statusCode = [int]$response.StatusCode
    $responseBody = $response.Content.ReadAsStringAsync().GetAwaiter().GetResult()

    Write-Host "HTTP Status Code: $statusCode ($($response.StatusCode))" -ForegroundColor Green

    $corsOrigin = $null
    if ($response.Headers.Contains("Access-Control-Allow-Origin")) {
        $corsOrigin = ($response.Headers.GetValues("Access-Control-Allow-Origin") -join ", ")
        Write-Host "Header Access-Control-Allow-Origin: $corsOrigin" -ForegroundColor Gray
    } else {
        Write-Host "Header Access-Control-Allow-Origin: [Not Present]" -ForegroundColor Gray
    }

    $varyHeader = $null
    if ($response.Headers.Contains("Vary")) {
        $varyHeader = ($response.Headers.GetValues("Vary") -join ", ")
        Write-Host "Header Vary: $varyHeader" -ForegroundColor Gray
    }

    # Truncate response body if long to avoid leaking internal info
    $displayBody = if ($responseBody.Length -gt 200) { $responseBody.Substring(0, 200) + "..." } else { $responseBody }
    Write-Host "Response Body: $displayBody" -ForegroundColor Gray

    return [PSCustomObject]@{
        TestName = $TestName
        StatusCode = $statusCode
        CorsOrigin = $corsOrigin
        VaryHeader = $varyHeader
        ResponseBody = $responseBody
    }
}

$results = @()

# Test A: OPTIONS request with trusted origin (https://essencialgood.com)
$results += Test-Endpoint `
    -TestName "Test A: OPTIONS preflight with trusted origin (essencialgood.com)" `
    -Method "OPTIONS" `
    -FunctionSlug "create-conversation" `
    -Headers @{ "Origin" = "https://essencialgood.com"; "Access-Control-Request-Method" = "POST" }

# Test B: OPTIONS request with untrusted origin (https://malicious.com)
$results += Test-Endpoint `
    -TestName "Test B: OPTIONS preflight with untrusted origin (malicious.com)" `
    -Method "OPTIONS" `
    -FunctionSlug "create-conversation" `
    -Headers @{ "Origin" = "https://malicious.com"; "Access-Control-Request-Method" = "POST" }

# Test C: GET method on all 3 functions
$results += Test-Endpoint `
    -TestName "Test C1: GET on create-conversation" `
    -Method "GET" `
    -FunctionSlug "create-conversation"

$results += Test-Endpoint `
    -TestName "Test C2: GET on send-message" `
    -Method "GET" `
    -FunctionSlug "send-message"

$results += Test-Endpoint `
    -TestName "Test C3: GET on submit-lead" `
    -Method "GET" `
    -FunctionSlug "submit-lead"

# Test D: create-conversation POST without JWT
$results += Test-Endpoint `
    -TestName "Test D: POST to create-conversation without JWT" `
    -Method "POST" `
    -FunctionSlug "create-conversation" `
    -Body '{"visitor_id":"00000000-0000-0000-0000-000000000000"}'

# Test E: send-message POST without JWT
$results += Test-Endpoint `
    -TestName "Test E: POST to send-message without JWT" `
    -Method "POST" `
    -FunctionSlug "send-message" `
    -Body '{"conversation_id":"00000000-0000-0000-0000-000000000000","content":"Hello"}'

# Test F: submit-lead POST with malformed JSON
$results += Test-Endpoint `
    -TestName "Test F: POST to submit-lead with malformed JSON" `
    -Method "POST" `
    -FunctionSlug "submit-lead" `
    -Body '{invalid_json_body'

# Test G: submit-lead POST without turnstileToken
$results += Test-Endpoint `
    -TestName "Test G: POST to submit-lead without turnstileToken" `
    -Method "POST" `
    -FunctionSlug "submit-lead" `
    -Body '{"p_name":"Test User","p_email":"test@example.com","p_phone":"+14155552671","session_id":"00000000-0000-4000-8000-000000000000"}'

# Test H: submit-lead POST with body > 16 KB
$oversizedPayload = @{
    p_name = "Test User"
    p_email = "test@example.com"
    turnstileToken = "dummy_token"
    extraData = "A" * (17 * 1024)
} | ConvertTo-Json -Compress

$results += Test-Endpoint `
    -TestName "Test H: POST to submit-lead with body > 16 KB" `
    -Method "POST" `
    -FunctionSlug "submit-lead" `
    -Body $oversizedPayload

# Test I: submit-lead POST with invalid Turnstile token
$results += Test-Endpoint `
    -TestName "Test I: POST to submit-lead with invalid Turnstile token" `
    -Method "POST" `
    -FunctionSlug "submit-lead" `
    -Body '{"turnstileToken":"","session_id":"00000000-0000-4000-8000-000000000000","p_name":"Test User","p_email":"test@example.com","p_phone":"+14155552671"}'

Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host "NEGATIVE HTTP TEST SUMMARY" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
foreach ($r in $results) {
    Write-Host "$($r.TestName): Status $($r.StatusCode)" -ForegroundColor White
}
