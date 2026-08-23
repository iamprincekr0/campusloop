"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  Compass,
  ExternalLink,
  FolderKanban,
  GitBranch,
  MapPin,
  Plus,
  Sparkles,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import AppShell from "../components/AppShell";
import CampusPulse from "../components/CampusPulse";
import { supabase } from "../../lib/supabase";

/* ─── types ─── */

type User = { id: string; fullName: string; email: string };

type EventRow = {
  id: string;
  slug: string;
  title: string;
  venue: string | null;
  event_date: string | null;
  start_time: string | null;
  registration_open: boolean;
};

type ProjectRow = {
  id: string;
  title: string;
  description: string | null;
  tech_stack: string[] | null;
  github_url: string | null;
  live_url: string | null;
};

/* ─── helpers ─── */

function formatEventDate(dateStr: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${dateStr}T00:00:00`));
}

/* ─── page ─── */

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      /* 1 — auth guard */
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (!active) return;
      if (authError || !authUser) {
        router.replace("/login");
        return;
      }

      setUser({
        id: authUser.id,
        fullName: authUser.user_metadata?.full_name ?? "Student",
        email: authUser.email ?? "",
      });

      /* 2 — upcoming events (published, any date — server knows what's relevant) */
      const { data: eventsData } = await supabase
        .from("events")
        .select(
          "id,slug,title,venue,event_date,start_time,registration_open"
        )
        .eq("is_published", true)
        .order("event_date", { ascending: true })
        .limit(4);

      if (active && eventsData) setEvents(eventsData as EventRow[]);

      /* 3 — user's projects */
      const { data: projectsData } = await supabase
        .from("projects")
        .select("id,title,description,tech_stack,github_url,live_url")
        .eq("user_id", authUser.id)
        .order("updated_at", { ascending: false })
        .limit(4);

      if (active && projectsData) setProjects(projectsData as ProjectRow[]);

      if (active) setLoading(false);
    }

    void load();
    return () => {
      active = false;
    };
  }, [router]);

  const initials = useMemo(
    () =>
      user?.fullName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0]?.toUpperCase())
        .join("") || "S",
    [user]
  );

  async function handleLogout() {
    setLoggingOut(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      setLoggingOut(false);
      return;
    }
    router.replace("/login");
    router.refresh();
  }

  /* loading state */
  if (loading || !user) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7f8fc]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading your workspace…
          </p>
        </div>
      </main>
    );
  }

  return (
    <AppShell
      fullName={user.fullName}
      email={user.email}
      initials={initials}
      onLogout={handleLogout}
      loggingOut={loggingOut}
    >
      <section className="mx-auto max-w-[1540px] px-4 py-6 pb-28 sm:px-7 sm:py-8 lg:px-10 lg:pb-10">
        {/* ── personalized greeting ── */}
        <CampusPulse fullName={user.fullName} />

        {/* ── quick actions ── */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <QuickAction
            href="/projects/new"
            icon={Plus}
            label="New Project"
            tone="bg-blue-50 text-blue-600"
          />
          <QuickAction
            href="/events/extension-board-2026"
            icon={Compass}
            label="Browse Events"
            tone="bg-violet-50 text-violet-600"
          />
          <QuickAction
            href="/profile"
            icon={UserRound}
            label="Edit Profile"
            tone="bg-emerald-50 text-emerald-600"
          />
          <QuickAction
            href="/ai"
            icon={Sparkles}
            label="AI Guide"
            tone="bg-amber-50 text-amber-600"
          />
        </div>

        {/* ── main grid ── */}
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          {/* ─ left column ─ */}
          <div className="space-y-6">
            {/* upcoming events */}
            <DashboardSection
              title="Upcoming Events"
              icon={CalendarDays}
              actionHref="/events/extension-board-2026"
              actionLabel="All events"
            >
              {events.length === 0 ? (
                <EmptyState
                  icon={CalendarDays}
                  message="No upcoming events right now."
                  cta="Browse events"
                  href="/events/extension-board-2026"
                />
              ) : (
                <div className="space-y-3">
                  {events.map((event) => (
                    <Link
                      key={event.id}
                      href={`/events/${event.slug}`}
                      className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                        <CalendarDays className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-slate-900">
                          {event.title}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {event.event_date
                            ? formatEventDate(event.event_date)
                            : "Date TBA"}
                          {event.venue ? ` · ${event.venue}` : ""}
                        </p>
                      </div>
                      {event.registration_open && (
                        <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                          Open
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </DashboardSection>

            {/* my projects */}
            <DashboardSection
              title="My Projects"
              icon={FolderKanban}
              actionHref="/projects"
              actionLabel="All projects"
            >
              {projects.length === 0 ? (
                <EmptyState
                  icon={FolderKanban}
                  message="You haven't added any projects yet."
                  cta="Create your first project"
                  href="/projects/new"
                />
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {projects.map((project) => (
                    <article
                      key={project.id}
                      className="rounded-2xl border border-slate-100 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <p className="truncate text-sm font-bold text-slate-900">
                        {project.title}
                      </p>
                      <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-slate-500">
                        {project.description ||
                          "No description yet."}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {(project.tech_stack ?? [])
                          .slice(0, 3)
                          .map((tech) => (
                            <span
                              key={tech}
                              className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600"
                            >
                              {tech}
                            </span>
                          ))}
                      </div>
                      {(project.github_url ||
                        project.live_url) && (
                        <div className="mt-3 flex gap-3 border-t border-slate-50 pt-2.5">
                          {project.github_url && (
                            <a
                              href={project.github_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-blue-600"
                            >
                              <GitBranch className="h-3 w-3" />{" "}
                              Code
                            </a>
                          )}
                          {project.live_url && (
                            <a
                              href={project.live_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-blue-600"
                            >
                              <ExternalLink className="h-3 w-3" />{" "}
                              Demo
                            </a>
                          )}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </DashboardSection>
          </div>

          {/* ─ right column ─ */}
          <div className="space-y-6">
            {/* campus intelligence promo */}
            <div className="rounded-[28px] bg-gradient-to-br from-slate-950 to-slate-800 p-6 text-white shadow-xl shadow-slate-900/10">
              <span className="inline-flex rounded-xl bg-white/10 p-2.5 text-blue-200">
                <Sparkles className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-bold">
                Need guidance?
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Ask CampusLoop AI about study plans, project ideas,
                career advice, or campus opportunities.
              </p>
              <Link
                href="/ai"
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-200 transition hover:text-white"
              >
                Open AI Guide{" "}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* your progress card */}
            <DashboardSection title="Your Campus" icon={MapPin}>
              <div className="space-y-4">
                <ProgressRow
                  label="Projects"
                  value={projects.length}
                  href="/projects"
                />
                <ProgressRow
                  label="Events available"
                  value={events.length}
                  href="/events/extension-board-2026"
                />
              </div>
              <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-4 py-4 text-center">
                <p className="text-xs leading-5 text-slate-500">
                  Complete your profile to unlock personalized
                  recommendations.
                </p>
                <Link
                  href="/profile"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800"
                >
                  Complete profile{" "}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </DashboardSection>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

/* ─── sub-components ─── */

function QuickAction({
  href,
  icon: Icon,
  label,
  tone,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  tone: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white px-4 py-3.5 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <span
        className={`grid h-9 w-9 place-items-center rounded-xl ${tone}`}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900">
        {label}
      </span>
    </Link>
  );
}

function DashboardSection({
  title,
  icon: Icon,
  actionHref,
  actionLabel,
  children,
}: {
  title: string;
  icon: LucideIcon;
  actionHref?: string;
  actionLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-slate-200/70 bg-white/60 p-5 shadow-sm backdrop-blur-sm sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Icon className="h-4 w-4 text-slate-400" />
          <h2 className="text-sm font-bold text-slate-800">
            {title}
          </h2>
        </div>
        {actionHref && actionLabel && (
          <Link
            href={actionHref}
            className="text-xs font-bold text-blue-600 transition hover:text-blue-800"
          >
            {actionLabel}
          </Link>
        )}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function EmptyState({
  icon: Icon,
  message,
  cta,
  href,
}: {
  icon: LucideIcon;
  message: string;
  cta: string;
  href: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 px-5 py-8 text-center">
      <span className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-slate-50 text-slate-400">
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-3 text-sm text-slate-500">{message}</p>
      <Link
        href={href}
        className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800"
      >
        {cta} <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}

function ProgressRow({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-xl px-1 py-1 transition hover:bg-slate-50"
    >
      <span className="text-sm text-slate-600">{label}</span>
      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
        {value}
      </span>
    </Link>
  );
}