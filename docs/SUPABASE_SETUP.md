# Guia de Configuração do Supabase — Projeto Essencial Good

Este documento orienta a configuração manual e a execução das migrações do banco de dados no Supabase para a ativação do Chat ao Vivo e Painel Administrativo.

---

## 1. Ativar Autenticação Anônima (Anonymous Sign-ins)

Os visitantes do site utilizarão a funcionalidade nativa de Autenticação Anônima do Supabase (`signInAnonymously`).

1. Acesse o [Painel do Supabase](https://supabase.com/dashboard).
2. Vá em **Authentication** -> **Providers** -> **Email / Anonymous**.
3. Ative a opção **Allow Anonymous Sign-ins** (Permitir logins anônimos).
4. Clique em **Save**.

---

## 2. Aplicar a Migration SQL

1. No Painel do Supabase, vá na seção **SQL Editor**.
2. Abra o arquivo localizado no projeto em `supabase/migrations/001_chat_foundation.sql`.
3. Cole o conteúdo completo do arquivo no SQL Editor.
4. Clique em **Run** para criar as tabelas (`admin_profiles`, `conversations`, `messages`), índices, funções helper de segurança, políticas RLS, triggers e habilitar a publicação no **Supabase Realtime**.

---

## 3. Criar o Primeiro Usuário Administrador

Para acessar o painel administrativo futuramente (em `/admin`), você deve criar um usuário no Supabase Auth e registrá-lo na tabela `admin_profiles`.

### Passo A: Criar usuário no Auth
1. Vá em **Authentication** -> **Users** -> **Add user** -> **Create user**.
2. Insira o e-mail e a senha do administrador.
3. Copie o **User UID** gerado (exemplo: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`).

### Passo B: Conceder o perfil de `admin` ou `agent`
Execute a instrução SQL a seguir no **SQL Editor** do Supabase substituindo a UUID pelo ID do usuário criado:

```sql
INSERT INTO public.admin_profiles (id, full_name, role)
VALUES (
    'COLE_AQUI_O_USER_UID_DO_SUPABASE_AUTH',
    'Nome do Administrador',
    'admin' -- pode ser 'admin' ou 'agent'
);
```

---

## 4. Variáveis de Ambiente no Projeto Frontend

No ambiente local ou de produção (Vercel), configure as variáveis de ambiente baseando-se no `.env.example`:

```bash
VITE_SUPABASE_URL=https://seu-projeto-id.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-publica-anon-key
```

> **Atenção:** NUNCA utilize a `SUPABASE_SERVICE_ROLE_KEY` no código do frontend! Apenas a `VITE_SUPABASE_ANON_KEY` deve ser exposta ao cliente.
