"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, GraduationCap, LockKeyhole, Mail } from "lucide-react";
import AuthShell from "../components/AuthShell";
import { supabase } from "../../lib/supabase";

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
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) { setMessage(error.message); return; }
    router.replace("/dashboard");
    router.refresh();
  }

  return <AuthShell eyebrow="Student access" title="Your campus work is waiting for you." description="Pick up your projects, people, events, and opportunities from one thoughtful student workspace." benefits={["Keep the people and projects you care about close", "See relevant events and opportunities in one place", "Build a profile that makes your work discoverable"]}>
    <div className="w-full max-w-md"><Link href="/" className="mb-10 inline-flex items-center gap-3 lg:hidden"><span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white"><GraduationCap className="h-5 w-5" /></span><span className="text-lg font-bold tracking-[-0.04em]">Campus<span className="text-blue-600">Loop</span></span></Link><div className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.09)] sm:p-8"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">Student access</p><h2 className="mt-3 text-3xl font-bold tracking-[-0.05em] text-slate-950">Welcome back.</h2><p className="mt-3 text-sm leading-6 text-slate-500">Sign in to continue to your CampusLoop workspace.</p><form onSubmit={handleLogin} className="mt-8 space-y-5"><Field label="Email address" htmlFor="email" icon={Mail}><input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@college.edu" required autoComplete="email" className="auth-input" /></Field><Field label="Password" htmlFor="password" icon={LockKeyhole}><input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" required autoComplete="current-password" className="auth-input pr-12" /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-blue-600">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></Field><div className="flex items-center justify-between gap-4 text-sm"><label className="flex items-center gap-2 text-slate-500"><input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} className="h-4 w-4 rounded border-slate-300 accent-blue-600" />Remember me</label><button type="button" className="font-bold text-blue-600 hover:text-blue-800">Forgot password?</button></div>{message && <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{message}</div>}<button type="submit" disabled={loading} className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Signing in…" : "Sign in"}{!loading && <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />}</button></form><div className="my-7 flex items-center gap-3"><div className="h-px flex-1 bg-slate-200" /><span className="text-xs text-slate-400">New to CampusLoop?</span><div className="h-px flex-1 bg-slate-200" /></div><Link href="/signup" className="block rounded-2xl border border-slate-200 px-5 py-3.5 text-center text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">Create your free account</Link></div><p className="mt-6 text-center text-xs leading-5 text-slate-400">By continuing, you agree to the CampusLoop Terms and Privacy Policy.</p></div>
  </AuthShell>;
}

function Field({ label, htmlFor, icon: Icon, children }: { label: string; htmlFor: string; icon: typeof Mail; children: React.ReactNode }) { return <div><label htmlFor={htmlFor} className="mb-2 block text-sm font-bold text-slate-700">{label}</label><div className="relative"><Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />{children}</div></div>; }
