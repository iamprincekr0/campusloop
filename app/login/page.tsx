"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
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

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-cyan-500/20 blur-[150px]" />
        <div className="absolute right-[-160px] top-20 h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-[160px]" />
        <div className="absolute bottom-[-200px] left-[35%] h-[440px] w-[440px] rounded-full bg-pink-600/15 blur-[160px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_90%)]" />
      </div>

      <div className="relative mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden items-center px-10 py-12 lg:flex xl:px-16">
          <div className="max-w-xl">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 shadow-lg shadow-blue-500/25">
                <GraduationCap className="h-5 w-5" />
              </span>

              <span className="text-xl font-semibold tracking-tight">
                Campus<span className="text-cyan-300">Loop</span>
              </span>
            </Link>

            <div className="mt-16 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-4 py-2 text-xs font-medium text-cyan-100">
              <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
              Welcome back to your student network
            </div>

            <h1 className="mt-7 text-5xl font-semibold leading-[1.02] tracking-[-0.05em] xl:text-6xl">
              Continue building
              <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                your campus future.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">
              Access your projects, communities, resources and opportunities
              from one beautifully connected student workspace.
            </p>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              <InfoCard
                icon={<ShieldCheck className="h-5 w-5" />}
                title="Secure account"
                text="Protected authentication and private sessions."
              />

              <InfoCard
                icon={<GraduationCap className="h-5 w-5" />}
                title="Student focused"
                text="Built around real campus needs and growth."
              />
            </div>

            <div className="mt-10 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-3 shadow-2xl backdrop-blur-xl">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1300&q=85"
                alt="Students studying together"
                className="h-64 w-full rounded-[20px] object-cover"
              />
            </div>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="mb-10 inline-flex items-center gap-3 lg:hidden"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600">
                <GraduationCap className="h-5 w-5" />
              </span>

              <span className="text-lg font-semibold">
                Campus<span className="text-cyan-300">Loop</span>
              </span>
            </Link>

            <div className="rounded-[32px] border border-white/10 bg-white/[0.055] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                  Student access
                </p>

                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
                  Welcome back
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Sign in to continue to your CampusLoop dashboard.
                </p>
              </div>

              <form onSubmit={handleLogin} className="mt-8 space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@college.edu"
                      required
                      autoComplete="email"
                      className="w-full rounded-2xl border border-white/10 bg-[#0a0e21]/80 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/40 focus:ring-4 focus:ring-cyan-300/5"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                      required
                      autoComplete="current-password"
                      className="w-full rounded-2xl border border-white/10 bg-[#0a0e21]/80 py-3.5 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/40 focus:ring-4 focus:ring-cyan-300/5"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 text-sm">
                  <label className="flex items-center gap-2 text-slate-400">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) =>
                        setRememberMe(event.target.checked)
                      }
                      className="h-4 w-4 rounded border-white/20 bg-transparent accent-cyan-400"
                    />
                    Remember me
                  </label>

                  <button
                    type="button"
                    className="font-medium text-cyan-300 transition hover:text-cyan-200"
                  >
                    Forgot password?
                  </button>
                </div>

                {message && (
                  <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 px-5 py-3.5 font-semibold text-white shadow-xl shadow-blue-600/20 transition hover:-translate-y-0.5 hover:shadow-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Signing in..." : "Sign In"}
                  {!loading && (
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  )}
                </button>
              </form>

              <div className="my-7 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs text-slate-600">New here?</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <Link
                href="/signup"
                className="block w-full rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-3.5 text-center text-sm font-semibold text-slate-200 transition hover:border-cyan-300/25 hover:bg-white/[0.06]"
              >
                Create your free account
              </Link>
            </div>

            <p className="mt-6 text-center text-xs leading-5 text-slate-600">
              By continuing, you agree to the CampusLoop Terms and Privacy
              Policy.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function InfoCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <div className="text-cyan-300">{icon}</div>
      <p className="mt-3 font-semibold">{title}</p>
      <p className="mt-1 text-sm leading-6 text-slate-500">{text}</p>
    </div>
  );
}