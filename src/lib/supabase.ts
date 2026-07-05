import { createClient } from "@supabase/supabase-js";

function cleanPublicEnvValue(value: string | undefined, key: string) {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;

  const prefix = `${key}=`;
  const withoutKeyName = trimmed.startsWith(prefix) ? trimmed.slice(prefix.length) : trimmed;
  return withoutKeyName.replace(/^['"]|['"]$/g, "").trim();
}

const supabaseUrl = cleanPublicEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL");
const supabaseAnonKey = cleanPublicEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, "NEXT_PUBLIC_SUPABASE_ANON_KEY");

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
