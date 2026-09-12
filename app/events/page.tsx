"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronRight, LoaderCircle, MapPin, Search } from "lucide-react";
import { supabase } from "../../lib/supabase";

type EventRecord = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  institution: string | null;
  venue: string | null;
  event_date: string | null;
  registration_open: boolean;
};

function formatDate(value: string | null) {
  if (!value) return "Date to be announced";
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${value}T00:00:00`));
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function loadEvents() {
      const { data, error: eventsError } = await supabase
        .from("events")
        .select("id,slug,title,description,institution,venue,event_date,registration_open")
        .eq("is_published", true)
        .order("event_date", { ascending: true });
      if (!active) return;
      if (eventsError) setError("Events could not be loaded right now.");
      else setEvents((data ?? []) as EventRecord[]);
      setLoading(false);
    }
    void loadEvents();
    return () => { active = false; };
  }, []);

  const filteredEvents = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return events;
    return events.filter((event) => [event.title, event.description, event.institution, event.venue].filter(Boolean).some((value) => value!.toLowerCase().includes(normalized)));
  }, [events, query]);

  return (
    <main className="min-h-screen bg-[#050816] px-5 py-8 text-slate-100 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">CampusLoop events</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-6xl">Find your next room.</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">Browse published events from your campus network. Only events currently available in CampusLoop are shown here.</p>
          </div>
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 hover:text-white">Back to workspace <ChevronRight className="h-4 w-4" /></Link>
        </header>

        <div className="mt-8 flex max-w-xl items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 backdrop-blur-xl">
          <Search className="h-4 w-4 text-slate-500" />
          <label htmlFor="event-search" className="sr-only">Search published events</label>
          <input id="event-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search events, institutions, venues" className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600" />
        </div>

        {loading && <div className="mt-16 flex items-center gap-3 text-slate-400"><LoaderCircle className="h-5 w-5 animate-spin text-cyan-300" /> Loading published events…</div>}
        {!loading && error && <div role="alert" className="mt-10 rounded-3xl border border-rose-400/20 bg-rose-400/[0.06] p-6 text-sm text-rose-200">{error}</div>}
        {!loading && !error && filteredEvents.length === 0 && <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.035] p-8 text-slate-400">No published events match your search.</div>}

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <article key={event.id} className="premium-surface rounded-[28px] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3"><span className="rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-3 py-1 text-xs font-semibold text-cyan-200">{event.registration_open ? "Registration open" : "View details"}</span><CalendarDays className="h-4 w-4 text-cyan-300" /></div>
              <h2 className="mt-6 text-2xl font-semibold tracking-[-0.04em] text-white">{event.title}</h2>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">{event.description || "Explore this published campus event in CampusLoop."}</p>
              <div className="mt-6 space-y-2 text-sm text-slate-300"><p>{formatDate(event.event_date)}</p>{(event.venue || event.institution) && <p className="flex items-center gap-2 text-slate-500"><MapPin className="h-4 w-4 text-cyan-300" />{[event.venue, event.institution].filter(Boolean).join(" · ")}</p>}</div>
              <Link href={`/events/${event.slug}`} className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 hover:text-white">Open event <ChevronRight className="h-4 w-4" /></Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
