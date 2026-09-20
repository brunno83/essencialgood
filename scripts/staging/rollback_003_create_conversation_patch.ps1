# ESSENCIAL GOOD - SAFE WRAPPER FOR ROLLBACK OF STAGING PATCH 003
# Target Staging Ref: zauvpsxeexwthobmbkku
# Forbidden Prod Ref: axgpmpnipwyfirlplbjv

param (
  [string]$ProjectRef = "zauvpsxeexwthobmbkku"
)

$ErrorActionPreference = "Stop"

$ALLOWED_STAGING_REF = "zauvpsxeexwthobmbkku"
$FORBIDDEN_PROD_REF  = "axgpmpnipwyfirlplbjv"

if ($ProjectRef -eq $FORBIDDEN_PROD_REF) {
  Write-Error "CRITICAL SECURITY BLOCK: Attempted to run rollback on PRODUCTION database ($FORBIDDEN_PROD_REF)!"
  exit 1
}

if ($ProjectRef -ne $ALLOWED_STAGING_REF) {
  Write-Error "SECURITY BLOCK: Target project ref '$ProjectRef' is not the authorized Staging ref ($ALLOWED_STAGING_REF)!"
  exit 1
}

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$SqlFile = Join-Path $ScriptDir "rollback_003_create_conversation_rpc.sql"

if (-not (Test-Path $SqlFile)) {
  Write-Error "SQL Rollback file not found at: $SqlFile"
  exit 1
}

Write-Host "Rolling back Staging Patch 003 on target project: $ProjectRef ..."

$argsArray = @("db", "query", "--linked", "--project-ref", $ProjectRef, "-f", $SqlFile)

& npx supabase @argsArray

if ($LASTEXITCODE -ne 0) {
  Write-Error "Rollback execution failed with exit code $LASTEXITCODE. Aborting."
  exit $LASTEXITCODE
}

Write-Host "✅ Rollback 003 successfully executed on Staging ($ProjectRef)."
