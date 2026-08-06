"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  LoaderCircle,
  LockKeyhole,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  institution: string;
  course: string;
  branch: string;
  yearOfStudy: string;
  rollNumber: string;
  consent: boolean;
  website: string;
};

type SuccessState = {
  registrationCode: string;
  eventTitle: string;
  venue: string;
};

const initialForm: FormState = {
  fullName: "",
  email: "",
  phone: "",
  institution: "Sandip University, Nashik",
  course: "",
  branch: "",
  yearOfStudy: "",
  rollNumber: "",
  consent: false,
  website: "",
};

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-[#091022]/90 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/50 focus:ring-4 focus:ring-cyan-300/10";

export default function EventRegistrationPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState<SuccessState | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, startedAt }),
      });

      const data = (await response.json()) as {
        ok?: boolean;
        message?: string;
        registrationCode?: string;
        eventTitle?: string;
        venue?: string;
      };

      if (!response.ok || !data.ok || !data.registrationCode) {
        setMessage(data.message || "Registration complete nahi ho paya.");
        return;
      }

      setSuccess({
        registrationCode: data.registrationCode,
        eventTitle: data.eventTitle || "Extension Board Workshop 2026",
        venue: data.venue || "Department of Electrical Engineering",
      });
    } catch {
      setMessage("Network issue hai. Internet check karke dobara submit karo.");
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setForm(initialForm);
    setStartedAt(Date.now());
    setMessage("");
    setSuccess(null);
  }

  if (success) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#050816] px-5 py-10 text-white">
        <Glow />
        <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl items-center">
          <section className="w-full rounded-[32px] border border-emerald-300/20 bg-white/[0.055] p-6 text-center shadow-[0_30px_100px_rgba(0,0,0,.45)] backdrop-blur-2xl sm:p-10">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-emerald-300/25 bg-emerald-400/10">
              <CheckCircle2 className="h-10 w-10 text-emerald-300" />
            </div>
            <p className="mt-7 text-xs font-semibold uppercase tracking-[.24em] text-emerald-300">
              Registration confirmed
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-.04em] sm:text-5xl">
              You&apos;re registered.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-400">
              Koi confirmation email ya OTP required nahi hai. Registration ID
              ka screenshot rakh lo.
            </p>

            <div className="mx-auto mt-8 max-w-md rounded-3xl border border-cyan-300/20 bg-cyan-300/[.07] p-6">
              <p className="text-xs uppercase tracking-[.2em] text-slate-400">
                Registration ID
              </p>
              <p className="mt-2 break-all font-mono text-2xl font-bold tracking-wider text-cyan-200 sm:text-3xl">
                {success.registrationCode}
              </p>
            </div>

            <div className="mx-auto mt-8 grid max-w-2xl gap-3 text-left sm:grid-cols-3">
              <Info icon={<CalendarDays />} label="Date" value="08 August 2026" />
              <Info icon={<Clock3 />} label="Reporting" value="09:00 AM" />
              <Info icon={<MapPin />} label="Venue" value={success.venue} />
            </div>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/events/extension-board-2026"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[.05] px-5 py-3 font-medium text-slate-200 hover:bg-white/[.09]"
              >
                <ArrowLeft className="h-4 w-4" /> Event page
              </Link>
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 px-5 py-3 font-semibold shadow-xl shadow-blue-600/20"
              >
                Register another student <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      <Glow />

      <div className="relative mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="text-lg font-semibold">
              Campus<span className="text-cyan-300">Loop</span>
            </span>
          </Link>
          <Link
            href="/events/extension-board-2026"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Event details
          </Link>
        </header>

        <div className="grid gap-8 py-10 lg:grid-cols-[.82fr_1.18fr] lg:items-start lg:py-16">
          <section className="lg:sticky lg:top-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[.07] px-4 py-2 text-xs text-cyan-100">
              <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
              Quick registration · No OTP · No confirmation email
            </div>

            <h1 className="mt-7 text-4xl font-semibold leading-tight tracking-[-.05em] sm:text-5xl">
              Extension Board
              <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                Workshop 2026
              </span>
            </h1>
            <p className="mt-5 max-w-xl leading-8 text-slate-400">
              Form submit hote hi unique registration ID milega. Event day par
              coordinator ko wahi ID dikhana hai.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <EventCard icon={<CalendarDays />} title="08 August 2026" text="Workshop date" />
              <EventCard icon={<Clock3 />} title="09:00 AM" text="Reporting time" />
              <EventCard icon={<MapPin />} title="Electrical Department" text="Sandip University" />
              <EventCard icon={<Users />} title="Group activity" text="Coordinator assigns groups" />
            </div>

            <div className="mt-6 rounded-3xl border border-amber-300/20 bg-amber-300/[.07] p-5">
              <div className="flex gap-3">
                <Wrench className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
                <div>
                  <p className="font-medium text-amber-100">Safety first</p>
                  <p className="mt-1 text-sm leading-6 text-amber-100/65">
                    Practical electrical work sirf faculty/lab coordinator ki
                    supervision me hoga.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[32px] border border-white/10 bg-white/[.055] p-5 shadow-[0_30px_100px_rgba(0,0,0,.45)] backdrop-blur-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[.2em] text-cyan-300">
                  Student registration
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-[-.04em] sm:text-3xl">
                  Complete your details
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  Expected completion time: 1–2 minutes.
                </p>
              </div>
              <ShieldCheck className="h-6 w-6 shrink-0 text-emerald-300" />
            </div>

            <form onSubmit={submit} className="mt-8 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Full name">
                  <input
                    className={inputClass}
                    value={form.fullName}
                    onChange={(e) => update("fullName", e.target.value)}
                    placeholder="Your full name"
                    minLength={2}
                    maxLength={100}
                    autoComplete="name"
                    required
                  />
                </Field>
                <Field label="Mobile number">
                  <input
                    className={inputClass}
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="10-digit mobile number"
                    minLength={10}
                    maxLength={20}
                    inputMode="tel"
                    autoComplete="tel"
                    required
                  />
                </Field>
              </div>

              <Field label="Email address">
                <input
                  className={inputClass}
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="student@example.com"
                  maxLength={160}
                  autoComplete="email"
                  required
                />
              </Field>

              <Field label="College / Institution">
                <input
                  className={inputClass}
                  value={form.institution}
                  onChange={(e) => update("institution", e.target.value)}
                  minLength={2}
                  maxLength={160}
                  autoComplete="organization"
                  required
                />
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Course / Program">
                  <input
                    className={inputClass}
                    value={form.course}
                    onChange={(e) => update("course", e.target.value)}
                    placeholder="B.Tech, BCA, MBA..."
                    minLength={2}
                    maxLength={100}
                    required
                  />
                </Field>
                <Field label="Branch / Department">
                  <input
                    className={inputClass}
                    value={form.branch}
                    onChange={(e) => update("branch", e.target.value)}
                    placeholder="Electrical Engineering"
                    minLength={2}
                    maxLength={100}
                    required
                  />
                </Field>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Year of study">
                  <select
                    className={inputClass}
                    value={form.yearOfStudy}
                    onChange={(e) => update("yearOfStudy", e.target.value)}
                    required
                  >
                    <option value="">Select year</option>
                    {["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "Other"].map(
                      (year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      )
                    )}
                  </select>
                </Field>
                <Field label="Roll number" optional>
                  <input
                    className={inputClass}
                    value={form.rollNumber}
                    onChange={(e) => update("rollNumber", e.target.value)}
                    placeholder="Optional"
                    maxLength={40}
                  />
                </Field>
              </div>

              <div className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(e) => update("website", e.target.value)}
                />
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-white/[.035] p-4">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 accent-cyan-400"
                  checked={form.consent}
                  onChange={(e) => update("consent", e.target.checked)}
                  required
                />
                <span className="text-sm leading-6 text-slate-400">
                  Details event coordination, attendance aur certificate
                  eligibility ke liye use ki ja sakti hain.
                </span>
              </label>

              {message && (
                <div className="rounded-2xl border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 px-5 py-4 font-semibold shadow-xl shadow-blue-600/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Saving registration...
                  </>
                ) : (
                  <>
                    Complete registration <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <p className="flex items-center justify-center gap-2 text-xs text-slate-500">
                <LockKeyhole className="h-3.5 w-3.5" />
                Registration data public nahi dikhega.
              </p>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

function Glow() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-cyan-500/20 blur-[150px]" />
      <div className="absolute right-[-160px] top-20 h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-[160px]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.022)_1px,transparent_1px)] bg-[size:64px_64px]" />
    </div>
  );
}

function Field({
  label,
  optional,
  children,
}: {
  label: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
        {label}
        {!optional && <span className="text-cyan-300">*</span>}
        {optional && <span className="text-xs text-slate-600">(optional)</span>}
      </span>
      {children}
    </label>
  );
}

function EventCard({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[.045] p-5">
      <div className="text-cyan-300 [&>svg]:h-5 [&>svg]:w-5">{icon}</div>
      <p className="mt-4 font-medium">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{text}</p>
    </div>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[.04] p-4">
      <div className="flex items-center gap-2 text-cyan-300 [&>svg]:h-4 [&>svg]:w-4">
        {icon}
        <span className="text-xs uppercase tracking-wider text-slate-500">
          {label}
        </span>
      </div>
      <p className="mt-2 text-sm font-medium text-slate-200">{value}</p>
    </div>
  );
}
