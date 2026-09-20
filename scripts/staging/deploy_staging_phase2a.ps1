# ============================================================================
# ESSENCIAL GOOD - STAGING HOMOLOGATION DEPLOYMENT SCRIPT (PHASE 2A)
# Target Project Ref STAGING: zauvpsxeexwthobmbkku
# FORBIDDEN Project Ref PRODUÇÃO: axgpmpnipwyfirlplbjv
# ============================================================================

param (
    [string]$TargetProjectRef = "zauvpsxeexwthobmbkku"
)

$ErrorActionPreference = "Stop"

$AUTHORIZED_STAGING_REF = "zauvpsxeexwthobmbkku"
$FORBIDDEN_PROD_REF = "axgpmpnipwyfirlplbjv"

Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host "TARGET: essencialgood-staging ($TargetProjectRef)" -ForegroundColor Green
Write-Host "============================================================================" -ForegroundColor Cyan

# ----------------------------------------------------------------------------
# VALIDAÇÃO DA FUNÇÃO AUXILIAR DE EXECUÇÃO DA CLI SUPABASE
# ----------------------------------------------------------------------------
function Invoke-SafeSupabaseCli {
    param(
        [Parameter(Mandatory = $true)]
        [string[]]$Arguments
    )

    $joinedArguments = $Arguments -join " "

    if ($joinedArguments -match [regex]::Escape($FORBIDDEN_PROD_REF)) {
        throw "Comando bloqueado: referência de produção detectada."
    }

    if ($joinedArguments -notmatch [regex]::Escape($AUTHORIZED_STAGING_REF) -and $Arguments -contains "--project-ref") {
        throw "Comando bloqueado: referência explícita do staging não encontrada."
    }

    Write-Host "Executando Supabase CLI no staging..." -ForegroundColor Gray

    & npx supabase @Arguments

    if ($LASTEXITCODE -ne 0) {
        throw "Supabase CLI falhou com código $LASTEXITCODE."
    }
}

# ----------------------------------------------------------------------------
# ETAPA A: VALIDAÇÃO DE ALVO, CLI E CONFIRMAÇÃO
# ----------------------------------------------------------------------------
Write-Host "`n[ETAPA A] Validando Alvo e Travas Anti-Produção..." -ForegroundColor Yellow

if ($TargetProjectRef -eq $FORBIDDEN_PROD_REF) {
    throw "Tentativa de executar contra o Project Ref de PRODUÇÃO ($FORBIDDEN_PROD_REF)!"
}

if ($TargetProjectRef -ne $AUTHORIZED_STAGING_REF) {
    throw "Alvo '$TargetProjectRef' não é o STAGING autorizado ($AUTHORIZED_STAGING_REF)!"
}

Write-Host "✅ Trava Anti-Produção Aprovada. Alvo exclusivo: STAGING ($AUTHORIZED_STAGING_REF)." -ForegroundColor Green

Write-Host "Verificando versão da Supabase CLI..." -ForegroundColor Yellow
Invoke-SafeSupabaseCli @("--version")

Write-Host "Verificando funcionalidade db query..." -ForegroundColor Yellow
Invoke-SafeSupabaseCli @("db", "query", "--help")

# Exigência de Confirmação Interativa Digitada
Write-Host "`nATENÇÃO: Você está prestes a aplicar modificações no ambiente remoto STAGING." -ForegroundColor Yellow
$confirmation = Read-Host "Para prosseguir, digite exatamente 'HOMOLOGAR-STAGING'"

if ($confirmation -ne "HOMOLOGAR-STAGING") {
    throw "Confirmação incorreta. Operação ABORTADA pelo usuário."
}

# ----------------------------------------------------------------------------
# CONSULTA INICIAL SOMENTE LEITURA NO STAGING
# ----------------------------------------------------------------------------
Write-Host "`n[CONSULTA INICIAL] Verificando se a base de Staging está limpa..." -ForegroundColor Cyan
Invoke-SafeSupabaseCli @("db", "query", "--project-ref", $AUTHORIZED_STAGING_REF, "SELECT COUNT(*) AS public_table_count FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';")

# ----------------------------------------------------------------------------
# ETAPA B: APLICAÇÃO DO BOOTSTRAP DE ESTRUTURA MÍNIMA (001 - 009)
# ----------------------------------------------------------------------------
Write-Host "`n[ETAPA B] Aplicando Bootstrap do Esquema Mínimo (001 - 009)..." -ForegroundColor Cyan
Invoke-SafeSupabaseCli @("db", "query", "--project-ref", $AUTHORIZED_STAGING_REF, "--file", "scripts/staging/001_phase2a_staging_bootstrap.sql")

# ----------------------------------------------------------------------------
# ETAPA C: AUDITORIA ESTRUTURAL SOMENTE LEITURA
# ----------------------------------------------------------------------------
Write-Host "`n[ETAPA C] Auditando Tabelas e RLS no Staging..." -ForegroundColor Cyan
Invoke-SafeSupabaseCli @("db", "query", "--project-ref", $AUTHORIZED_STAGING_REF, "SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';")

# ----------------------------------------------------------------------------
# ETAPA D: APLICAÇÃO DA MIGRATION 010 (RATE LIMIT & SERVICE ROLE RPCS)
# ----------------------------------------------------------------------------
Write-Host "`n[ETAPA D] Aplicando Migration 010 (Rate Limit & Infraestrutura)..." -ForegroundColor Cyan
Invoke-SafeSupabaseCli @("db", "query", "--project-ref", $AUTHORIZED_STAGING_REF, "--file", "supabase/migrations/010_rate_limit_infrastructure.sql")

# ----------------------------------------------------------------------------
# ETAPA E: AUDITORIA DE GRANTS E REVOKES NAS RPCS DA FASE 2A
# ----------------------------------------------------------------------------
Write-Host "`n[ETAPA E] Auditando Grants das RPCs da Fase 2A..." -ForegroundColor Cyan
Invoke-SafeSupabaseCli @("db", "query", "--project-ref", $AUTHORIZED_STAGING_REF, "SELECT routine_name, grantee, privilege_type FROM information_schema.routine_privileges WHERE routine_schema = 'public' AND routine_name IN ('p_create_visitor_conversation', 'p_send_visitor_message', 'consume_rate_limit', 'cleanup_expired_rate_limits');")

Write-Host "`n============================================================================" -ForegroundColor Green
Write-Host "✅ ETAPAS A ATE E CONCLUIDAS COM SUCESSO NO STAGING!" -ForegroundColor Green
Write-Host "============================================================================" -ForegroundColor Green
