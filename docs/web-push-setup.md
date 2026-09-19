# Manual de Configuração Operacional — Web Push Notifications (Essencial Good Admin)

Este documento fornece as instruções passo a passo para implantar, configurar e operar as Notificações Web Push em produção no projeto Supabase de produção (`axgpmpnipwyfirlplbjv`) e na Vercel.

---

## 1. Projeto Supabase de Produção Confirmado

- **Project Ref**: `axgpmpnipwyfirlplbjv`
- **Domínio Supabase**: `https://axgpmpnipwyfirlplbjv.supabase.co`
- **URL da Edge Function**: `https://axgpmpnipwyfirlplbjv.supabase.co/functions/v1/send-web-push`

---

## 2. Geração e Armazenamento das Chaves VAPID

As chaves VAPID foram salvas no arquivo local protegido `.webpush-secrets.local` (ignorado pelo Git).

### Estrutura dos Secrets (Leitura em `.webpush-secrets.local`):
```text
VAPID_PUBLIC_KEY=<chave_publica_vapid>
VAPID_PRIVATE_KEY=<chave_privada_confidencial>
VAPID_SUBJECT=https://www.essencialgood.com
WEBHOOK_SECRET=<secret_32_bytes_hex>
```

> [!CAUTION]
> **A `VAPID_PRIVATE_KEY` e o `WEBHOOK_SECRET` NUNCA devem ser versionados no Git ou incluídos no código do frontend.** Elas residem exclusivamente nos Secrets das Edge Functions no Supabase.

---

## 3. Configuração de Variáveis de Ambiente no Frontend (Vercel / `.env.local`)

No painel da Vercel (**Project Settings -> Environment Variables**):

- **Key**: `VITE_VAPID_PUBLIC_KEY`
- **Value**: *Sua VAPID Public Key gerada*
- **Escopo**: `Production` (ou conforme necessidade de ambiente)

---

## 4. Configuração dos Secrets no Supabase Edge Functions

Execute o comando do Supabase CLI para registrar os secrets no projeto `axgpmpnipwyfirlplbjv`:

```bash
npx supabase secrets set \
  VAPID_PUBLIC_KEY="<VAPID_PUBLIC_KEY>" \
  VAPID_PRIVATE_KEY="<VAPID_PRIVATE_KEY>" \
  VAPID_SUBJECT="https://www.essencialgood.com" \
  WEBHOOK_SECRET="<WEBHOOK_SECRET>" \
  --project-ref axgpmpnipwyfirlplbjv
```

> [!NOTE]
> `SUPABASE_URL` (`https://axgpmpnipwyfirlplbjv.supabase.co`) e `SUPABASE_SERVICE_ROLE_KEY` são injetados automaticamente pelo runtime de Edge Functions do Supabase.

---

## 5. Publicação da Edge Function

Para publicar a Edge Function `send-web-push` no projeto `axgpmpnipwyfirlplbjv`:

```bash
npx supabase functions deploy send-web-push --project-ref axgpmpnipwyfirlplbjv
```

A URL pública ativa da função será:
`https://axgpmpnipwyfirlplbjv.supabase.co/functions/v1/send-web-push`

---

## 6. Configuração dos Database Webhooks no Supabase Dashboard

Acesse o **Supabase Dashboard -> Database -> Webhooks** do projeto `axgpmpnipwyfirlplbjv` e crie 2 webhooks:

### Webhook 1: Notificação de Novos Chats
- **Name**: `send-web-push-conversations`
- **Table**: `public.conversations`
- **Events**: `[x] Insert`
- **Type**: `HTTP Request`
- **Method**: `POST`
- **URL**: `https://axgpmpnipwyfirlplbjv.supabase.co/functions/v1/send-web-push`
- **HTTP Headers**:
  - Key: `x-webhook-secret` | Value: `<SEU_WEBHOOK_SECRET>`
  - Key: `Content-Type`     | Value: `application/json`

### Webhook 2: Notificação de Novos Leads
- **Name**: `send-web-push-leads`
- **Table**: `public.checkout_leads`
- **Events**: `[x] Insert`
- **Type**: `HTTP Request`
- **Method**: `POST`
- **URL**: `https://axgpmpnipwyfirlplbjv.supabase.co/functions/v1/send-web-push`
- **HTTP Headers**:
  - Key: `x-webhook-secret` | Value: `<SEU_WEBHOOK_SECRET>`
  - Key: `Content-Type`     | Value: `application/json`

---

## 7. Procedimento de Rotação de Chaves

Se a `VAPID_PRIVATE_KEY` for comprometida ou precisar ser rotacionada:
1. Gere um novo par VAPID.
2. Atualize `VITE_VAPID_PUBLIC_KEY` na Vercel e faça novo deploy.
3. Atualize os secrets na Supabase Edge Function (`npx supabase secrets set ... --project-ref axgpmpnipwyfirlplbjv`).
4. **Impacto**: Inscrições de navegadores existentes criadas com a chave pública antiga serão rejeitadas pelos serviços de Push do SO (retornando status `400` ou `410`). A Edge Function desativará as inscrições antigas no banco e o PWA solicitará nova reativação simples ao usuário quando reaberto.
