"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Eye, EyeOff, GraduationCap, LockKeyhole, Mail, UserRound } from "lucide-react";
import AuthShell from "../components/AuthShell";
import { supabase } from "../../lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setMessage(""); setIsError(false);
    if (fullName.trim().length < 2) { setIsError(true); setMessage("Please enter your full name."); return; }
    if (password.length < 8) { setIsError(true); setMessage("Password must contain at least 8 characters."); return; }
    if (!acceptedTerms) { setIsError(true); setMessage("Please accept the Terms and Privacy Policy."); return; }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email: email.trim(), password, options: { data: { full_name: fullName.trim() } } });
    setLoading(false);
    if (error) { setIsError(true); setMessage(error.message); return; }
    if (data.session) { router.replace("/dashboard"); router.refresh(); return; }
    setIsError(false); setMessage("Account created successfully. Check your email and confirm your account.");
  }

  const passwordRules = [{ label: "8+ characters", completed: password.length >= 8 }, { label: "A number", completed: /\d/.test(password) }, { label: "Uppercase", completed: /[A-Z]/.test(password) }];

  return <AuthShell eyebrow="Create your account" title="Build a campus life that adds up." description="Start with a profile that connects your goals to the people, projects, events, and opportunities around you." benefits={["Discover people who share your interests", "Showcase meaningful skills and projects", "Never lose track of the next opportunity"]}>
    <div className="w-full max-w-md"><Link href="/" className="mb-8 inline-flex items-center gap-3 lg:hidden"><span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white"><GraduationCap className="h-5 w-5" /></span><span className="text-lg font-bold tracking-[-0.04em]">Campus<span className="text-blue-600">Loop</span></span></Link><div className="rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.09)] sm:p-8"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600">Create your account</p><h2 className="mt-3 text-3xl font-bold tracking-[-0.05em] text-slate-950">Join CampusLoop.</h2><p className="mt-3 text-sm leading-6 text-slate-500">Start building your student network and portfolio in minutes.</p><form onSubmit={handleSignup} className="mt-7 space-y-4"><Field label="Full name" htmlFor="fullName" icon={UserRound}><input id="fullName" type="text" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Prince Kumar" required autoComplete="name" className="auth-input" /></Field><Field label="Email address" htmlFor="email" icon={Mail}><input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@college.edu" required autoComplete="email" className="auth-input" /></Field><Field label="Password" htmlFor="password" icon={LockKeyhole}><input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Create a strong password" required minLength={8} autoComplete="new-password" className="auth-input pr-12" /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-blue-600">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></Field><div className="grid gap-1.5 sm:grid-cols-3">{passwordRules.map((rule) => <div key={rule.label} className={`flex items-center gap-1.5 text-[10px] font-semibold ${rule.completed ? "text-emerald-600" : "text-slate-400"}`}><span className={`grid h-4 w-4 place-items-center rounded-full ${rule.completed ? "bg-emerald-100" : "bg-slate-100"}`}><Check className="h-2.5 w-2.5" /></span>{rule.label}</div>)}</div><label className="flex items-start gap-3 pt-1 text-xs leading-5 text-slate-500"><input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-blue-600" /><span>I agree to the <button type="button" className="font-bold text-blue-600">Terms of Service</button> and <button type="button" className="font-bold text-blue-600">Privacy Policy</button>.</span></label>{message && <div className={`rounded-2xl border px-4 py-3 text-sm ${isError ? "border-rose-200 bg-rose-50 text-rose-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>{message}</div>}<button type="submit" disabled={loading} className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Creating account…" : "Create account"}{!loading && <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />}</button></form><div className="my-6 flex items-center gap-3"><div className="h-px flex-1 bg-slate-200" /><span className="text-xs text-slate-400">Already registered?</span><div className="h-px flex-1 bg-slate-200" /></div><Link href="/login" className="block rounded-2xl border border-slate-200 px-5 py-3.5 text-center text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">Sign in to your account</Link></div><p className="mt-6 text-center text-xs leading-5 text-slate-400">Your account uses secure authentication to keep your details private.</p></div>
  </AuthShell>;
}

function Field({ label, htmlFor, icon: Icon, children }: { label: string; htmlFor: string; icon: typeof Mail; children: React.ReactNode }) { return <div><label htmlFor={htmlFor} className="mb-2 block text-sm font-bold text-slate-700">{label}</label><div className="relative"><Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />{children}</div></div>; }
