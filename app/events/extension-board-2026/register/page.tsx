"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  LoaderCircle,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { supabase } from "../../../../lib/supabase";

const EVENT_SLUG = "extension-board-2026";

type EventRecord = {
  id: string;
  slug: string;
  title: string;
  institution: string | null;
  department: string | null;
  venue: string | null;
  event_date: string | null;
  start_time: string | null;
  end_time: string | null;
  registration_open: boolean;
};

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

const initialForm: FormState = {
  fullName: "",
  email: "",
  phone: "",
  institution: "",
  course: "",
  branch: "",
  yearOfStudy: "",
  rollNumber: "",
  consent: false,
  website: "",
};

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-[#091022] px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/50";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${value}T00:00:00`));
}

function formatTime(value: string) {
  const [hour, minute] = value.split(":").map(Number);
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", hour12: true }).format(d);
}

export default function RegistrationPage() {
  const [event, setEvent] = useState<EventRecord | null>(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [form, setForm] = useState<FormState>(initialForm);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [registrationCode, setRegistrationCode] = useState("");

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("events")
        .select("id,slug,title,institution,department,venue,event_date,start_time,end_time,registration_open")
        .eq("slug", EVENT_SLUG)
        .eq("is_published", true)
        .single();
      setEvent((data as EventRecord) || null);
      setLoadingEvent(false);
    }
    void load();
  }, []);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!event?.registration_open || submitting) return;
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, startedAt }),
      });
      const data = await response.json();
      if (!response.ok || !data?.ok) {
        setError(data?.message || "Registration failed.");
      } else {
        setRegistrationCode(data.registrationCode);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingEvent) {
    return <main className="grid min-h-screen place-items-center bg-[#050816] text-white"><LoaderCircle className="h-7 w-7 animate-spin text-cyan-300" /></main>;
  }

  if (!event) {
    return <main className="grid min-h-screen place-items-center bg-[#050816] px-5 text-white"><p className="text-slate-400">Event is not available.</p></main>;
  }

  if (registrationCode) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#050816] px-5 text-white">
        <section className="w-full max-w-xl rounded-[32px] border border-emerald-300/20 bg-white/[0.05] p-8 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-300" />
          <h1 className="mt-6 text-3xl font-semibold">Registration complete</h1>
          <p className="mt-3 text-slate-400">{event.title}</p>
          <div className="mt-7 rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.06] p-5">
            <p className="text-xs uppercase tracking-wider text-slate-500">Registration ID</p>
            <p className="mt-2 font-mono text-2xl font-bold text-cyan-200">{registrationCode}</p>
          </div>
          <Link href={`/events/${event.slug}`} className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950"><ArrowLeft className="h-4 w-4" /> Event page</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-6xl px-5 py-7 sm:px-8">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600"><GraduationCap className="h-5 w-5" /></span><span className="font-semibold">Campus<span className="text-cyan-300">Loop</span></span></Link>
          <Link href={`/events/${event.slug}`} className="inline-flex items-center gap-2 text-sm text-slate-400"><ArrowLeft className="h-4 w-4" /> Event</Link>
        </header>

        <div className="grid gap-8 py-10 lg:grid-cols-[0.82fr_1.18fr]">
          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Event registration</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em]">{event.title}</h1>

            {(event.event_date || event.start_time || event.venue || event.department || event.institution) && (
              <div className="mt-7 space-y-3">
                {event.event_date && <Info icon={<CalendarDays />} value={formatDate(event.event_date)} />}
                {event.start_time && <Info icon={<Clock3 />} value={event.end_time ? `${formatTime(event.start_time)} – ${formatTime(event.end_time)}` : formatTime(event.start_time)} />}
                {(event.venue || event.department || event.institution) && <Info icon={<MapPin />} value={[event.venue, event.department, event.institution].filter(Boolean).join(" · ")} />}
              </div>
            )}

            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm text-slate-400">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
              Student only enters their own real details. Event details come from admin settings.
            </div>
          </section>

          <section className="rounded-[32px] border border-white/10 bg-white/[0.05] p-5 sm:p-8">
            {!event.registration_open ? (
              <div className="py-16 text-center"><p className="text-lg font-medium">Registration is closed.</p></div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full name"><input className={inputClass} required value={form.fullName} onChange={(e) => update("fullName", e.target.value)} /></Field>
                  <Field label="Mobile"><input className={inputClass} required type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} /></Field>
                </div>
                <Field label="Email"><input className={inputClass} required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} /></Field>
                <Field label="University / College name"><input className={inputClass} required value={form.institution} onChange={(e) => update("institution", e.target.value)} /></Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Course / Program"><input className={inputClass} required value={form.course} onChange={(e) => update("course", e.target.value)} /></Field>
                  <Field label="Department"><input className={inputClass} required value={form.branch} onChange={(e) => update("branch", e.target.value)} /></Field>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Year"><select className={inputClass} required value={form.yearOfStudy} onChange={(e) => update("yearOfStudy", e.target.value)}><option value="">Select</option>{["1st Year","2nd Year","3rd Year","4th Year","5th Year","Other"].map((v) => <option key={v} value={v}>{v}</option>)}</select></Field>
                  <Field label="Roll number (optional)"><input className={inputClass} value={form.rollNumber} onChange={(e) => update("rollNumber", e.target.value)} /></Field>
                </div>
                <input tabIndex={-1} autoComplete="off" className="hidden" value={form.website} onChange={(e) => update("website", e.target.value)} />
                <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-400"><input type="checkbox" required checked={form.consent} onChange={(e) => update("consent", e.target.checked)} className="mt-1 accent-cyan-400" /><span>I confirm that the details entered above are correct and may be used for this event.</span></label>
                {error && <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</div>}
                <button disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 px-5 py-4 font-semibold disabled:opacity-60">{submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <>Register <ArrowRight className="h-4 w-4" /></>}</button>
              </form>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-sm font-medium text-slate-300">{label}</span>{children}</label>;
}

function Info({ icon, value }: { icon: React.ReactNode; value: string }) {
  return <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm text-slate-300"><span className="[&>svg]:h-4 [&>svg]:w-4 text-cyan-300">{icon}</span>{value}</div>;
}
