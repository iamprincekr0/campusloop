"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  GraduationCap,
  LoaderCircle,
  MapPin,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { supabase } from "../../../lib/supabase";

type EventRecord = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  institution: string | null;
  department: string | null;
  venue: string | null;
  event_date: string | null;
  start_time: string | null;
  end_time: string | null;
  coordinator: string | null;
  capacity: number | null;
  registration_deadline: string | null;
  registration_open: boolean;
};

const EVENT_SLUG = "extension-board-2026";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function formatTime(value: string) {
  const [hour, minute] = value.split(":").map(Number);
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export default function EventPage() {
  const [event, setEvent] = useState<EventRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      const { data, error: eventError } = await supabase
        .from("events")
        .select(
          "id,slug,title,description,institution,department,venue,event_date,start_time,end_time,coordinator,capacity,registration_deadline,registration_open"
        )
        .eq("slug", EVENT_SLUG)
        .eq("is_published", true)
        .single();

      if (!active) return;
      if (eventError || !data) {
        setError(eventError?.message || "Event is not available.");
      } else {
        setEvent(data as EventRecord);
      }
      setLoading(false);
    }

    void load();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#050816] text-white">
        <LoaderCircle className="h-7 w-7 animate-spin text-cyan-300" />
      </main>
    );
  }

  if (!event || error) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#050816] px-5 text-white">
        <div className="max-w-lg rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center">
          <p className="text-slate-400">{error || "Event is not available."}</p>
        </div>
      </main>
    );
  }

  const hasSchedule = Boolean(event.event_date || event.start_time || event.end_time);
  const hasLocation = Boolean(event.venue || event.department || event.institution);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-36 -top-32 h-[430px] w-[430px] rounded-full bg-cyan-500/15 blur-[150px]" />
        <div className="absolute right-[-140px] top-24 h-[480px] w-[480px] rounded-full bg-violet-600/15 blur-[160px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-5 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between rounded-3xl border border-white/10 bg-[#070b18]/75 px-5 py-4 backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="text-lg font-semibold">Campus<span className="text-cyan-300">Loop</span></span>
          </Link>

          {event.registration_open && (
            <Link
              href={`/events/${event.slug}/register`}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950"
            >
              Register <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </header>

        <section className="grid min-h-[calc(100vh-110px)] items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-4 py-2 text-xs font-medium text-cyan-100">
              <ShieldCheck className="h-4 w-4 text-cyan-300" />
              CampusLoop Event
            </div>

            <h1 className="mt-8 max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              {event.title}
            </h1>

            {event.description && (
              <p className="mt-7 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
                {event.description}
              </p>
            )}

            {event.registration_open && (
              <Link
                href={`/events/${event.slug}/register`}
                className="mt-9 inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 px-6 py-4 font-semibold text-white shadow-xl shadow-blue-600/20 transition hover:-translate-y-0.5"
              >
                Register for event <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/[0.045] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.4)] backdrop-blur-2xl sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Event details</p>
            <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em]">{event.title}</h2>

            {(hasSchedule || hasLocation || event.coordinator || event.capacity) && (
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {event.event_date && (
                  <Detail icon={<CalendarDays />} label="Date" value={formatDate(event.event_date)} />
                )}

                {event.start_time && (
                  <Detail
                    icon={<Clock3 />}
                    label="Start time"
                    value={event.end_time ? `${formatTime(event.start_time)} – ${formatTime(event.end_time)}` : formatTime(event.start_time)}
                  />
                )}

                {hasLocation && (
                  <Detail
                    wide
                    icon={<MapPin />}
                    label="Location"
                    value={[event.venue, event.department, event.institution].filter(Boolean).join(" · ")}
                  />
                )}

                {event.coordinator && (
                  <Detail icon={<UserRound />} label="Coordinator" value={event.coordinator} />
                )}

                {event.capacity && (
                  <Detail label="Capacity" value={`${event.capacity} participants`} />
                )}
              </div>
            )}

            <div className="mt-7 border-t border-white/10 pt-5">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-600">Registration</p>
              <p className={`mt-2 text-sm font-medium ${event.registration_open ? "text-emerald-300" : "text-slate-400"}`}>
                {event.registration_open ? "Open" : "Closed"}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Detail({
  icon,
  label,
  value,
  wide = false,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.035] p-4 ${wide ? "sm:col-span-2" : ""}`}>
      {icon && <div className="[&>svg]:h-4 [&>svg]:w-4 text-cyan-300">{icon}</div>}
      <p className="mt-3 text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-200">{value}</p>
    </div>
  );
}
