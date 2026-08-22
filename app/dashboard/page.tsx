"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  ChevronRight,
  CircleUserRound,
  FolderKanban,
  Lightbulb,
  Plus,
  Sparkles,
  Target,
  Trophy,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

import AppShell from "../components/AppShell";
import CampusPulse from "../components/CampusPulse";
import { supabase } from "../../lib/supabase";

type DashboardUser = {
  id: string;
  email: string;
  fullName: string;
};

const upcomingEvent = {
  title: "Extension Board 2026",
  date: "24 Aug 2026",
  venue: "CampusLoop Event",
  description:
    "Join the upcoming Extension Board event and participate with other students.",
};

const opportunities = [
  {
    title: "EV & Battery Systems",
    description: "Explore EV, battery and BMS opportunities.",
    icon: Zap,
    tone: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "Projects & Hackathons",
    description: "Build something useful with other students.",
    icon: Trophy,
    tone: "bg-orange-50 text-orange-600",
  },
  {
    title: "Career Opportunities",
    description: "Discover internships, roles and challenges.",
    icon: BriefcaseBusiness,
    tone: "bg-blue-50 text-blue-600",
  },
];

const quickActions = [
  {
    title: "Complete profile",
    description: "Add your academic details and skills",
    href: "/profile",
    icon: CircleUserRound,
    tone: "bg-blue-50 text-blue-600",
  },
  {
    title: "Explore events",
    description: "Find workshops and campus activities",
    href: "/events/extension-board-2026",
    icon: CalendarDays,
    tone: "bg-violet-50 text-violet-600",
  },
  {
    title: "Create project",
    description: "Start building and showcase your work",
    href: "/projects/new",
    icon: FolderKanban,
    tone: "bg-orange-50 text-orange-600",
  },
  {
    title: "Explore opportunities",
    description: "Find your next learning opportunity",
    href: "#opportunities",
    icon: Target,
    tone: "bg-emerald-50 text-emerald-600",
  },
];

const reveal = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<DashboardUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      const {
        data: { user: authUser },
        error,
      } = await supabase.auth.getUser();

      if (!mounted) return;

      if (error || !authUser) {
        router.replace("/login");
        return;
      }

      setUser({
        id: authUser.id,
        email: authUser.email ?? "",
        fullName:
          authUser.user_metadata?.full_name ??
          authUser.user_metadata?.name ??
          "Student",
      });

      setLoading(false);
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        router.replace("/login");
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  const firstName = useMemo(() => {
    return user?.fullName.trim().split(/\s+/)[0] || "Student";
  }, [user]);

  const initials = useMemo(() => {
    return (
      user?.fullName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((name) => name[0]?.toUpperCase())
        .join("") || "S"
    );
  }, [user]);

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

  if (loading || !user) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7f8fc]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
          <p className="mt-4 text-sm font-medium text-slate-500">
            Preparing your workspace...
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
      <main className="mx-auto max-w-[1540px] px-4 py-6 pb-28 sm:px-7 sm:py-8 lg:px-10 lg:pb-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.06,
              },
            },
          }}
        >
          {/* PERSONALIZED CAMPUS PULSE */}
          <CampusPulse fullName={user.fullName} />

          {/* HERO */}
          <motion.section
            variants={reveal}
            className="relative overflow-hidden rounded-[30px] bg-slate-950 px-6 py-8 text-white shadow-[0_24px_60px_rgba(15,23,42,0.16)] sm:px-8 lg:px-10"
          >
            <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full bg-blue-500/25 blur-3xl" />
            <div className="absolute -bottom-32 right-1/3 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />

            <div className="relative grid gap-8 xl:grid-cols-[1fr_360px] xl:items-end">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-bold text-blue-100">
                  <Sparkles className="h-3.5 w-3.5" />
                  Your student workspace
                </div>

                <h1 className="mt-5 max-w-3xl text-3xl font-bold tracking-[-0.055em] sm:text-4xl lg:text-5xl">
                  Welcome back, {firstName}.
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                  CampusLoop brings your events, projects, opportunities and
                  student journey into one place.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/events/extension-board-2026"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-blue-50"
                  >
                    Explore events
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href="/projects/new"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/15"
                  >
                    <Plus className="h-4 w-4" />
                    Start a project
                  </Link>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.07] p-5 backdrop-blur">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10">
                    <CircleUserRound className="h-5 w-5 text-blue-200" />
                  </span>

                  <div>
                    <p className="text-xs font-semibold text-slate-400">
                      Your CampusLoop account
                    </p>
                    <p className="mt-1 font-bold text-white">
                      Ready to build your journey
                    </p>
                  </div>
                </div>

                <Link
                  href="/profile"
                  className="mt-5 flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold transition hover:bg-white/15"
                >
                  Complete your profile
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.section>

          {/* QUICK STATS */}
          <motion.section
            variants={reveal}
            className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            <StatCard
              label="Profile"
              value="Get started"
              helper="Add your academic details and skills."
              icon={CircleUserRound}
              tone="bg-blue-50 text-blue-600"
              href="/profile"
            />

            <StatCard
              label="Registrations"
              value="None yet"
              helper="Your registered events will appear here."
              icon={CalendarDays}
              tone="bg-violet-50 text-violet-600"
              href="/events/extension-board-2026"
            />

            <StatCard
              label="Projects"
              value="Start one"
              helper="Build your first project on CampusLoop."
              icon={FolderKanban}
              tone="bg-orange-50 text-orange-600"
              href="/projects/new"
            />

            <StatCard
              label="Opportunities"
              value="Explore"
              helper="Discover what you can learn and build next."
              icon={Target}
              tone="bg-emerald-50 text-emerald-600"
              href="#opportunities"
            />
          </motion.section>

          {/* EVENTS + REGISTRATIONS */}
          <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <motion.section
              variants={reveal}
              className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7"
            >
              <SectionHeading
                eyebrow="Upcoming event"
                title="Don't miss what's happening"
                action="View event"
                href="/events/extension-board-2026"
              />

              <div className="mt-5 overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-violet-50 p-5 sm:p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white shadow-sm">
                    <CalendarDays className="h-7 w-7 text-blue-600" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-700">
                      Featured event
                    </div>

                    <h3 className="mt-3 text-xl font-bold tracking-tight text-slate-900">
                      {upcomingEvent.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {upcomingEvent.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                      <span className="rounded-full bg-white px-3 py-1.5">
                        {upcomingEvent.date}
                      </span>
                      <span className="rounded-full bg-white px-3 py-1.5">
                        {upcomingEvent.venue}
                      </span>
                    </div>
                  </div>

                  <Link
                    href="/events/extension-board-2026"
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                  >
                    Explore
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.section>

            <motion.section
              variants={reveal}
              className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7"
            >
              <SectionHeading
                eyebrow="My activity"
                title="My registrations"
                action="Find events"
                href="/events/extension-board-2026"
              />

              <EmptyState
                icon={CalendarDays}
                title="No registrations yet"
                description="When you register for a CampusLoop event, your registrations will appear here."
                href="/events/extension-board-2026"
                action="Explore events"
              />
            </motion.section>
          </div>

          {/* PROJECTS */}
          <motion.section
            variants={reveal}
            className="mt-6 rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7"
          >
            <SectionHeading
              eyebrow="Build something"
              title="My projects"
              action="View projects"
              href="/projects"
            />

            <div className="mt-5 rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-orange-50 text-orange-600">
                  <FolderKanban className="h-6 w-6" />
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-slate-900">
                    Your project space is empty
                  </h3>

                  <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                    Add a project to showcase your skills, find teammates and
                    make your work discoverable.
                  </p>
                </div>

                <Link
                  href="/projects/new"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-600"
                >
                  <Plus className="h-4 w-4" />
                  Create project
                </Link>
              </div>
            </div>
          </motion.section>

          {/* OPPORTUNITIES */}
          <motion.section
            variants={reveal}
            id="opportunities"
            className="mt-6 rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7"
          >
            <SectionHeading
              eyebrow="Grow"
              title="Opportunities"
              action="Explore more"
              href="/projects"
            />

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {opportunities.map((item) => (
                <OpportunityCard key={item.title} {...item} />
              ))}
            </div>
          </motion.section>

          {/* QUICK ACTIONS */}
          <motion.section
            variants={reveal}
            className="mt-6 rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7"
          >
            <SectionHeading
              eyebrow="Start here"
              title="Quick actions"
              action=""
            />

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {quickActions.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="group flex items-center gap-4 rounded-2xl border border-slate-100 p-4 transition hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-md"
                  >
                    <span
                      className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${item.tone}`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-slate-800">
                        {item.title}
                      </span>

                      <span className="mt-1 block text-xs leading-5 text-slate-500">
                        {item.description}
                      </span>
                    </span>

                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-blue-600" />
                  </Link>
                );
              })}
            </div>
          </motion.section>

          {/* NEXT MOVE */}
          <motion.section
            variants={reveal}
            className="mt-6 rounded-[28px] border border-slate-200/80 bg-slate-950 p-6 text-white shadow-sm sm:p-8"
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-blue-100">
                  <Lightbulb className="h-3.5 w-3.5" />
                  Your next move
                </div>

                <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
                  Build your CampusLoop journey one useful step at a time.
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Add your education, skills and first project to unlock better
                  recommendations later.
                </p>
              </div>

              <Link
                href="/profile"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-blue-50"
              >
                Complete profile
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.section>
        </motion.div>
      </main>
    </AppShell>
  );
}

function SectionHeading({
  eyebrow,
  title,
  action,
  href,
}: {
  eyebrow: string;
  title: string;
  action: string;
  href?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600">
          {eyebrow}
        </p>

        <h2 className="mt-2 text-xl font-bold tracking-[-0.035em] text-slate-900">
          {title}
        </h2>
      </div>

      {action &&
        (href ? (
          <Link
            href={href}
            className="text-xs font-bold text-blue-600 transition hover:text-blue-800"
          >
            {action}
          </Link>
        ) : (
          <span className="text-xs font-bold text-slate-300">{action}</span>
        ))}
    </div>
  );
}

function StatCard({
  label,
  value,
  helper,
  icon: Icon,
  tone,
  href,
}: {
  label: string;
  value: string;
  helper: string;
  icon: LucideIcon;
  tone: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>

          <p className="mt-2 text-xl font-bold tracking-[-0.03em] text-slate-950">
            {value}
          </p>
        </div>

        <span
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${tone}`}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>

      <p className="mt-4 text-xs leading-5 text-slate-400">{helper}</p>

      <div className="mt-4 flex items-center gap-1 text-xs font-bold text-blue-600 opacity-0 transition group-hover:opacity-100">
        Open
        <ArrowRight className="h-3.5 w-3.5" />
      </div>
    </Link>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
  href,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  action: string;
}) {
  return (
    <div className="mt-5 rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white text-slate-400 shadow-sm">
        <Icon className="h-5 w-5" />
      </div>

      <h3 className="mt-4 text-sm font-bold text-slate-800">{title}</h3>

      <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-slate-500">
        {description}
      </p>

      <Link
        href={href}
        className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700"
      >
        {action}
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

function OpportunityCard({
  title,
  description,
  icon: Icon,
  tone,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  tone: string;
}) {
  return (
    <article className="group rounded-3xl border border-slate-100 p-5 transition hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-md">
      <span
        className={`grid h-11 w-11 place-items-center rounded-2xl ${tone}`}
      >
        <Icon className="h-5 w-5" />
      </span>

      <h3 className="mt-5 text-sm font-bold text-slate-800">{title}</h3>

      <p className="mt-2 text-xs leading-5 text-slate-500">{description}</p>

      <span className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-blue-600">
        Explore
        <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
      </span>
    </article>
  );
}