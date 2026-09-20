# ESSENCIAL GOOD - SAFE WRAPPER FOR APPLYING STAGING PATCH 003
# Target Staging Ref: zauvpsxeexwthobmbkku
# Forbidden Prod Ref: axgpmpnipwyfirlplbjv

param (
  [string]$ProjectRef = "zauvpsxeexwthobmbkku"
)

$ErrorActionPreference = "Stop"

$ALLOWED_STAGING_REF = "zauvpsxeexwthobmbkku"
$FORBIDDEN_PROD_REF  = "axgpmpnipwyfirlplbjv"

if ($ProjectRef -eq $FORBIDDEN_PROD_REF) {
  Write-Error "CRITICAL SECURITY BLOCK: Attempted to run staging patch on PRODUCTION database ($FORBIDDEN_PROD_REF)!"
  exit 1
}

if ($ProjectRef -ne $ALLOWED_STAGING_REF) {
  Write-Error "SECURITY BLOCK: Target project ref '$ProjectRef' is not the authorized Staging ref ($ALLOWED_STAGING_REF)!"
  exit 1
}

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$SqlFile = Join-Path $ScriptDir "003_update_create_conversation_rpc.sql"

if (-not (Test-Path $SqlFile)) {
  Write-Error "SQL Patch file not found at: $SqlFile"
  exit 1
}

Write-Host "Applying Staging Patch 003 to target project: $ProjectRef ..."

$argsArray = @("db", "query", "--linked", "--project-ref", $ProjectRef, "-f", $SqlFile)

& npx supabase @argsArray

if ($LASTEXITCODE -ne 0) {
  Write-Error "Patch execution failed with exit code $LASTEXITCODE. Aborting."
  exit $LASTEXITCODE
}

Write-Host "✅ Patch 003 successfully applied to Staging ($ProjectRef)."
