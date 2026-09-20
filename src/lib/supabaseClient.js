// ESSENCIAL GOOD - SUPABASE CLIENT WITH GLOBAL ENVIRONMENT GUARD
// Validates environment configuration before instantiating Supabase Client.

import { createClient } from '@supabase/supabase-js';
import { validateEnvConfig } from './envGuard.js';

let validatedEnv = null;
let envValidationError = null;

try {
  const rawConfig = {
    VITE_APP_ENV: import.meta.env.VITE_APP_ENV,
    VITE_EXPECTED_SUPABASE_PROJECT_REF: import.meta.env.VITE_EXPECTED_SUPABASE_PROJECT_REF,
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    VITE_TURNSTILE_SITE_KEY: import.meta.env.VITE_TURNSTILE_SITE_KEY,
  };
  validatedEnv = validateEnvConfig(rawConfig);
} catch (err) {
  envValidationError = err instanceof Error ? err.message : String(err);
  console.error('[Environment Guard] Supabase Client Instantiation BLOCKED:', envValidationError);
}

export const isSupabaseConfigured = Boolean(validatedEnv && !envValidationError);

export const supabase = isSupabaseConfigured
  ? createClient(validatedEnv.supabaseUrl, validatedEnv.anonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export const validatedEnvConfig = validatedEnv;

export default supabase;
