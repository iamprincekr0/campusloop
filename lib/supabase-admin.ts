import "server-only";

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey =
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin = createClient(
  url ?? "https://placeholder.supabase.co",
  serviceRoleKey ?? "placeholder-service-role-key",
  {
  auth: { autoRefreshToken: false, persistSession: false },
});
