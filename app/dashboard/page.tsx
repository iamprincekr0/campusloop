"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Circle,
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

type ProfileData = {
  skills: string[] | null;
  bio: string | null;
  resume_url: string | null;
  avatar_url: string | null;
};

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

type ChecklistItem = {
  id: string;
  label: string;
  completed: boolean;
  href: string;
  cta: string;
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
  const [profile, setProfile] = useState<ProfileData | null>(null);
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

      /* 2 — profile stats check */
      const { data: profileData } = await supabase
        .from("profiles")
        .select("skills, bio, resume_url, avatar_url")
        .eq("id", authUser.id)
        .single();

      if (active && profileData) {
        setProfile(profileData as ProfileData);
      }

      /* 3 — upcoming events */
      const { data: eventsData } = await supabase
        .from("events")
        .select(
          "id,slug,title,venue,event_date,start_time,registration_open"
        )
        .eq("is_published", true)
        .order("event_date", { ascending: true })
        .limit(4);

      if (active && eventsData) setEvents(eventsData as EventRow[]);

      /* 4 — user's projects */
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

  // Actionable dynamic checklist for student guidance
  const checklist = useMemo<ChecklistItem[]>(() => {
    const list: ChecklistItem[] = [];

    list.push({
      id: "projects",
      label: "Showcase a project to highlight your skills",
      completed: projects.length > 0,
      href: "/projects/new",
      cta: "Add project",
    });

    list.push({
      id: "avatar",
      label: "Upload a profile photo for peers and recruiters",
      completed: !!profile?.avatar_url,
      href: "/profile",
      cta: "Upload photo",
    });

    list.push({
      id: "resume",
      label: "Upload a resume PDF to prepare for matching",
      completed: !!profile?.resume_url,
      href: "/profile",
      cta: "Upload resume",
    });

    list.push({
      id: "skills_bio",
      label: "Add technical skills and a brief bio",
      completed: !!(profile?.bio && profile?.skills && profile.skills.length > 0),
      href: "/profile",
      cta: "Update profile",
    });

    return list;
  }, [projects, profile]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  /* loading state */
  if (loading || !user) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#050816]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-500/20 border-t-blue-500" />
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
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-[1540px] px-4 py-6 pb-28 sm:px-7 sm:py-8 lg:px-10 lg:pb-10"
      >
        {/* ── personalized greeting ── */}
        <motion.div variants={itemVariants}>
          <CampusPulse fullName={user.fullName} />
        </motion.div>

        {/* ── quick actions ── */}
        <motion.div 
          variants={itemVariants} 
          className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          <QuickAction
            href="/projects/new"
            icon={Plus}
            label="New Project"
            tone="bg-blue-500/10 text-blue-400 border border-blue-500/20"
          />
          <QuickAction
            href="/events/extension-board-2026"
            icon={Compass}
            label="Browse Events"
            tone="bg-violet-500/10 text-violet-400 border border-violet-500/20"
          />
          <QuickAction
            href="/profile"
            icon={UserRound}
            label="Edit Profile"
            tone="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          />
          <QuickAction
            href="/ai"
            icon={Sparkles}
            label="AI Guide"
            tone="bg-amber-500/10 text-amber-400 border border-amber-500/20"
          />
        </motion.div>

        {/* ── main grid ── */}
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          {/* ─ left column ─ */}
          <div className="space-y-6">
            {/* upcoming events */}
            <motion.div variants={itemVariants}>
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
                        className="group flex items-center gap-4 rounded-2xl border border-slate-900 bg-slate-950/20 p-4 transition-all duration-300 hover:scale-[1.01] hover:border-slate-800 hover:bg-slate-900/10"
                      >
                        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                          <CalendarDays className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
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
                          <span className="shrink-0 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 text-[10px] font-bold text-emerald-400">
                            Open
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </DashboardSection>
            </motion.div>

            {/* my projects */}
            <motion.div variants={itemVariants}>
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
                        className="rounded-2xl border border-slate-900 bg-slate-950/20 p-4 hover:border-slate-800 transition duration-300 hover:scale-[1.01]"
                      >
                        <p className="truncate text-sm font-bold text-slate-100">
                          {project.title}
                        </p>
                        <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-slate-400">
                          {project.description ||
                            "No description yet."}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {(project.tech_stack ?? [])
                            .slice(0, 3)
                            .map((tech) => (
                              <span
                                key={tech}
                                className="rounded-full bg-slate-900 border border-slate-800/80 px-2.5 py-0.5 text-[10px] font-bold text-slate-400"
                              >
                                {tech}
                              </span>
                            ))}
                        </div>
                        {(project.github_url ||
                          project.live_url) && (
                          <div className="mt-3 flex gap-3 border-t border-slate-900/60 pt-2.5">
                            {project.github_url && (
                              <a
                                href={project.github_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-blue-400 transition"
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
                                className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-blue-400 transition"
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
            </motion.div>
          </div>

          {/* ─ right column ─ */}
          <div className="space-y-6">
            {/* what should i do next? Checklist */}
            <motion.div variants={itemVariants}>
              <DashboardSection title="What should I do next?" icon={CheckCircle2}>
                <div className="space-y-4">
                  {checklist.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 rounded-xl p-2 transition duration-255 hover:bg-white/5"
                    >
                      {item.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-450 shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="h-5 w-5 text-slate-700 shrink-0 mt-0.5" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-sm font-medium leading-relaxed ${
                            item.completed
                              ? "text-slate-500 line-through"
                              : "text-slate-300"
                          }`}
                        >
                          {item.label}
                        </p>
                        {!item.completed && (
                          <Link
                            href={item.href}
                            className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300 transition"
                          >
                            {item.cta} <ArrowRight className="h-3 w-3" />
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </DashboardSection>
            </motion.div>

            {/* campus intelligence promo */}
            <motion.div 
              variants={itemVariants}
              className="rounded-[28px] bg-gradient-to-br from-slate-900/60 to-slate-950/80 border border-slate-800/40 p-6 text-white shadow-xl"
            >
              <span className="inline-flex rounded-xl bg-white/5 border border-white/5 p-2.5 text-blue-300">
                <Sparkles className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-white">
                Need guidance?
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Ask CampusLoop AI about study plans, project ideas,
                career advice, or campus opportunities.
              </p>
              <Link
                href="/ai"
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-300 transition hover:text-white"
              >
                Open AI Guide{" "}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>

            {/* your progress card */}
            <motion.div variants={itemVariants}>
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
              </DashboardSection>
            </motion.div>
          </div>
        </div>
      </motion.section>
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
      className="group flex items-center gap-3 rounded-2xl border border-slate-800/40 bg-slate-950/30 px-4 py-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-900/40 hover:shadow-lg hover:border-slate-800/80"
    >
      <span
        className={`grid h-9 w-9 place-items-center rounded-xl ${tone}`}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">
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
    <section className="rounded-[28px] border border-slate-800/40 bg-slate-950/40 p-5 shadow-xl backdrop-blur-xl sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Icon className="h-4 w-4 text-slate-500" />
          <h2 className="text-sm font-bold text-slate-200">
            {title}
          </h2>
        </div>
        {actionHref && actionLabel && (
          <Link
            href={actionHref}
            className="text-xs font-bold text-blue-400 transition hover:text-blue-300"
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
    <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/20 px-5 py-8 text-center">
      <span className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-slate-900/50 text-slate-500 border border-slate-800/30">
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-3 text-sm text-slate-400">{message}</p>
      <Link
        href={href}
        className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition"
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
      className="flex items-center justify-between rounded-xl px-2 py-1.5 transition duration-150 hover:bg-white/5"
    >
      <span className="text-sm text-slate-400">{label}</span>
      <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-0.5 text-xs font-bold text-blue-400">
        {value}
      </span>
    </Link>
  );
}