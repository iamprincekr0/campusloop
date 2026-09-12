"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, GraduationCap, LockKeyhole, Mail } from "lucide-react";
import AuthShell from "../components/AuthShell";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    if (!isSupabaseConfigured) { setMessage("Sign in is unavailable until Supabase is connected."); return; }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) { setMessage(error.message.includes("confirm") ? "Please confirm your email before signing in." : "Invalid email or password."); return; }
    router.replace("/dashboard");
    router.refresh();
  }

  return <AuthShell eyebrow="Student access" title="Your campus work is waiting for you." description="Pick up your projects, people, events, and opportunities from one thoughtful student workspace." benefits={["Keep the people and projects you care about close", "See relevant events and opportunities in one place", "Build a profile that makes your work discoverable"]}>
    <div className="w-full max-w-md"><Link href="/" className="mb-10 inline-flex items-center gap-3 lg:hidden"><span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white"><GraduationCap className="h-5 w-5" /></span><span className="text-lg font-bold tracking-[-0.04em] text-white">Campus<span className="text-blue-400">Loop</span></span></Link><div className="premium-surface rounded-[30px] border border-slate-800/70 bg-slate-950/70 p-6 shadow-[0_24px_90px_rgba(2,6,23,0.45)] backdrop-blur-2xl sm:p-8"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">Student access</p><h2 className="mt-3 text-3xl font-bold tracking-[-0.05em] text-white">Welcome back.</h2><p className="mt-3 text-sm leading-6 text-slate-400">Sign in to continue to your CampusLoop workspace.</p><form onSubmit={handleLogin} className="mt-8 space-y-5"><Field label="Email address" htmlFor="email" icon={Mail}><input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@college.edu" required autoComplete="email" className="auth-input" /></Field><Field label="Password" htmlFor="password" icon={LockKeyhole}><input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" required autoComplete="current-password" className="auth-input pr-12" /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-blue-400">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></Field><div className="flex items-center justify-between gap-4 text-sm"><label className="flex items-center gap-2 text-slate-400"><input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-500" />Remember me</label><Link href="/reset-password" className="font-semibold text-blue-400 hover:text-blue-300">Forgot password?</Link></div>{message && <p role="alert" className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{message}</p>}<button disabled={loading} type="submit" className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Signing in…" : "Sign in"}<ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" /></button></form><p className="mt-6 text-center text-sm text-slate-500">New to CampusLoop? <Link href="/signup" className="font-bold text-blue-400 hover:text-blue-300">Create an account</Link></p></div></div>
  </AuthShell>;
}

function Field({ label, htmlFor, icon: Icon, children }: { label: string; htmlFor: string; icon: typeof Mail; children: React.ReactNode }) { return <div><label htmlFor={htmlFor} className="mb-2 block text-sm font-bold text-slate-300">{label}</label><div className="relative"><Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />{children}</div></div>; }
