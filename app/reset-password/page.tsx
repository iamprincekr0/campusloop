"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Mail } from "lucide-react";
import AuthShell from "../components/AuthShell";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setMessage(""); setIsError(false);
    if (!isSupabaseConfigured) { setIsError(true); setMessage("Password reset is unavailable until Supabase is connected."); return; }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/reset-password/update` });
    setLoading(false);
    if (error) { setIsError(true); setMessage("We could not send a reset email. Please try again."); return; }
    setMessage("If an account exists for that email, a reset link is on its way.");
  }
  return <AuthShell eyebrow="Account recovery" title="Get back to your campus workspace." description="Request a secure password reset link. We will never reveal whether an email is registered." benefits={["Secure Supabase password recovery", "No password is shown or shared", "Return to your workspace in one step"]}><div className="w-full max-w-md"><div className="premium-surface rounded-[30px] border border-slate-800/70 bg-slate-950/70 p-6 shadow-[0_24px_90px_rgba(2,6,23,0.45)] backdrop-blur-2xl sm:p-8"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">Account recovery</p><h2 className="mt-3 text-3xl font-bold tracking-[-0.05em] text-white">Reset your password.</h2><p className="mt-3 text-sm leading-6 text-slate-400">Enter your account email and we will send a secure recovery link.</p><form onSubmit={handleSubmit} className="mt-8 space-y-5"><label htmlFor="reset-email" className="block text-sm font-bold text-slate-300">Email address</label><div className="relative"><Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /><input id="reset-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="auth-input" placeholder="you@college.edu" autoComplete="email" /></div>{message && <p role="status" className={`rounded-xl border px-3 py-2 text-sm ${isError ? "border-rose-500/20 bg-rose-500/10 text-rose-300" : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"}`}>{message}</p>}<button disabled={loading} className="w-full rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-blue-500 disabled:opacity-60">{loading ? "Sending…" : "Send reset link"}</button></form><p className="mt-6 text-center text-sm text-slate-500"><Link href="/login" className="font-bold text-blue-400 hover:text-blue-300">Back to sign in</Link></p></div></div></AuthShell>;
}
