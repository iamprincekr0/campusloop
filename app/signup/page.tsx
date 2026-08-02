"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  Mail,
  Sparkles,
  UserRound,
} from "lucide-react";
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
    event.preventDefault();

    setMessage("");
    setIsError(false);

    if (fullName.trim().length < 2) {
      setIsError(true);
      setMessage("Please enter your full name.");
      return;
    }

    if (password.length < 8) {
      setIsError(true);
      setMessage("Password must contain at least 8 characters.");
      return;
    }

    if (!acceptedTerms) {
      setIsError(true);
      setMessage("Please accept the Terms and Privacy Policy.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
        },
      },
    });

    setLoading(false);

    if (error) {
      setIsError(true);
      setMessage(error.message);
      return;
    }

    if (data.session) {
      router.replace("/dashboard");
      router.refresh();
      return;
    }

    setIsError(false);
    setMessage(
      "Account created successfully. Check your email and confirm your account."
    );
  }

  const passwordRules = [
    {
      label: "At least 8 characters",
      completed: password.length >= 8,
    },
    {
      label: "Contains a number",
      completed: /\d/.test(password),
    },
    {
      label: "Contains uppercase letter",
      completed: /[A-Z]/.test(password),
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-cyan-500/20 blur-[150px]" />
        <div className="absolute right-[-160px] top-20 h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-[160px]" />
        <div className="absolute bottom-[-200px] left-[35%] h-[440px] w-[440px] rounded-full bg-pink-600/15 blur-[160px]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_90%)]" />
      </div>

      <div className="relative mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[1.02fr_0.98fr]">
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

            <div className="mt-16 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-300/[0.07] px-4 py-2 text-xs font-medium text-violet-100">
              <Sparkles className="h-3.5 w-3.5 text-violet-300" />
              Join the modern student network
            </div>

            <h1 className="mt-7 text-5xl font-semibold leading-[1.02] tracking-[-0.05em] xl:text-6xl">
              Build your profile.
              <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                Unlock your campus.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">
              Discover students, projects, communities, resources and
              opportunities designed around your goals.
            </p>

            <div className="mt-10 space-y-4">
              <Benefit text="Connect with students who share your interests" />
              <Benefit text="Showcase projects, skills and achievements" />
              <Benefit text="Discover internships, clubs and events" />
              <Benefit text="Access student-approved learning resources" />
            </div>

            <div className="mt-10 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-3 shadow-2xl backdrop-blur-xl">
              <img
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1300&q=85"
                alt="Students on a university campus"
                className="h-64 w-full rounded-[20px] object-cover"
              />
            </div>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="mb-9 inline-flex items-center gap-3 lg:hidden"
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
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
                  Create your account
                </p>

                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
                  Join CampusLoop
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Start building your student network and professional
                  portfolio.
                </p>
              </div>

              <form onSubmit={handleSignup} className="mt-8 space-y-5">
                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Full name
                  </label>

                  <div className="relative">
                    <UserRound className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      placeholder="Prince Kumar"
                      required
                      autoComplete="name"
                      className="w-full rounded-2xl border border-white/10 bg-[#0a0e21]/80 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-300/40 focus:ring-4 focus:ring-violet-300/5"
                    />
                  </div>
                </div>

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
                      className="w-full rounded-2xl border border-white/10 bg-[#0a0e21]/80 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-300/40 focus:ring-4 focus:ring-violet-300/5"
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
                      placeholder="Create a strong password"
                      required
                      minLength={8}
                      autoComplete="new-password"
                      className="w-full rounded-2xl border border-white/10 bg-[#0a0e21]/80 py-3.5 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-300/40 focus:ring-4 focus:ring-violet-300/5"
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

                  <div className="mt-3 grid gap-2 sm:grid-cols-3">
                    {passwordRules.map((rule) => (
                      <div
                        key={rule.label}
                        className={`flex items-center gap-1.5 text-[10px] ${
                          rule.completed
                            ? "text-emerald-300"
                            : "text-slate-600"
                        }`}
                      >
                        <span
                          className={`grid h-4 w-4 place-items-center rounded-full ${
                            rule.completed
                              ? "bg-emerald-400/15"
                              : "bg-white/5"
                          }`}
                        >
                          <Check className="h-2.5 w-2.5" />
                        </span>

                        {rule.label}
                      </div>
                    ))}
                  </div>
                </div>

                <label className="flex items-start gap-3 text-sm leading-6 text-slate-400">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(event) =>
                      setAcceptedTerms(event.target.checked)
                    }
                    className="mt-1 h-4 w-4 shrink-0 rounded border-white/20 bg-transparent accent-violet-400"
                  />

                  <span>
                    I agree to the{" "}
                    <button
                      type="button"
                      className="font-medium text-violet-300"
                    >
                      Terms of Service
                    </button>{" "}
                    and{" "}
                    <button
                      type="button"
                      className="font-medium text-violet-300"
                    >
                      Privacy Policy
                    </button>
                    .
                  </span>
                </label>

                {message && (
                  <div
                    className={`rounded-2xl border px-4 py-3 text-sm ${
                      isError
                        ? "border-red-500/25 bg-red-500/10 text-red-300"
                        : "border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
                    }`}
                  >
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 px-5 py-3.5 font-semibold text-white shadow-xl shadow-blue-600/20 transition hover:-translate-y-0.5 hover:shadow-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Creating account..." : "Create Account"}

                  {!loading && (
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  )}
                </button>
              </form>

              <div className="my-7 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs text-slate-600">
                  Already registered?
                </span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <Link
                href="/login"
                className="block w-full rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-3.5 text-center text-sm font-semibold text-slate-200 transition hover:border-violet-300/25 hover:bg-white/[0.06]"
              >
                Sign in to your account
              </Link>
            </div>

            <p className="mt-6 text-center text-xs leading-5 text-slate-600">
              Your account is protected using secure authentication.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function Benefit({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-emerald-300/20 bg-emerald-300/10 text-emerald-300">
        <Check className="h-3.5 w-3.5" />
      </span>

      <p className="text-sm text-slate-300">{text}</p>
    </div>
  );
}