"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import AuthShell from "../../components/AuthShell";
import { supabase } from "../../../lib/supabase";

export default function PasswordUpdatePage() {
  const router = useRouter(); const [password, setPassword] = useState(""); const [message, setMessage] = useState(""); const [loading, setLoading] = useState(false);
  async function handleSubmit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setMessage(""); if (password.length < 8) { setMessage("Use at least 8 characters."); return; } setLoading(true); const { error } = await supabase.auth.updateUser({ password }); setLoading(false); if (error) { setMessage("This reset link is invalid or expired. Request a new one."); return; } router.replace("/dashboard"); }
  return <AuthShell eyebrow="Account recovery" title="Choose a new password." description="Create a password you will remember. Your existing session remains protected." benefits={["At least 8 characters", "Stored securely by Supabase Auth", "Return directly to your dashboard"]}><div className="w-full max-w-md"><div className="premium-surface rounded-[30px] border border-slate-800/70 bg-slate-950/70 p-6 shadow-[0_24px_90px_rgba(2,6,23,0.45)] backdrop-blur-2xl sm:p-8"><h2 className="text-3xl font-bold tracking-[-0.05em] text-white">New password.</h2><form onSubmit={handleSubmit} className="mt-8 space-y-5"><label htmlFor="new-password" className="block text-sm font-bold text-slate-300">New password</label><input id="new-password" type="password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} className="auth-input" autoComplete="new-password" />{message && <p role="alert" className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{message}</p>}<button disabled={loading} className="w-full rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-blue-500 disabled:opacity-60">{loading ? "Updating…" : "Update password"}</button></form></div></div></AuthShell>;
}
