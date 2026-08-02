"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircleMore,
  Network,
  Plus,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Users,
  X,
  Zap,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

type DashboardUser = {
  id: string;
  email: string;
  fullName: string;
};

const stats = [
  {
    title: "Profile Strength",
    value: "35%",
    description: "Complete your student profile",
    icon: CircleUserRound,
    gradient: "from-cyan-400 to-blue-500",
    glow: "bg-cyan-400/10",
  },
  {
    title: "Connections",
    value: "0",
    description: "Build your student network",
    icon: Users,
    gradient: "from-violet-400 to-fuchsia-500",
    glow: "bg-violet-400/10",
  },
  {
    title: "Projects",
    value: "0",
    description: "Showcase your technical work",
    icon: FolderKanban,
    gradient: "from-orange-400 to-pink-500",
    glow: "bg-orange-400/10",
  },
  {
    title: "Opportunities",
    value: "12",
    description: "New matches available",
    icon: Target,
    gradient: "from-emerald-400 to-cyan-500",
    glow: "bg-emerald-400/10",
  },
];

const opportunities = [
  {
    title: "EV Battery Research Internship",
    company: "Energy Innovation Lab",
    location: "Remote",
    type: "Internship",
    icon: Zap,
    color: "from-emerald-400 to-cyan-500",
  },
  {
    title: "Power Systems Innovation Hackathon",
    company: "Future Grid Foundation",
    location: "Hybrid",
    type: "Hackathon",
    icon: Trophy,
    color: "from-orange-400 to-pink-500",
  },
  {
    title: "Embedded Systems Project Challenge",
    company: "CampusLoop Community",
    location: "Online",
    type: "Project",
    icon: FolderKanban,
    color: "from-violet-400 to-fuchsia-500",
  },
];

const communities = [
  {
    name: "EV & Battery Systems",
    members: "1.8K members",
    description: "BMS, battery modelling, EV architecture and charging.",
    icon: Zap,
    color: "from-emerald-400 to-cyan-500",
  },
  {
    name: "Embedded Builders",
    members: "3.2K members",
    description: "ESP32, Arduino, IoT and real hardware projects.",
    icon: Network,
    color: "from-cyan-400 to-blue-500",
  },
  {
    name: "GATE EE Preparation",
    members: "5.6K members",
    description: "Subject plans, PYQs, revision and peer discussion.",
    icon: BookOpen,
    color: "from-violet-400 to-fuchsia-500",
  },
];

const activities = [
  {
    title: "Profile created",
    description: "Your CampusLoop account is ready.",
    time: "Today",
    icon: CheckCircle2,
    color: "text-emerald-300 bg-emerald-300/10",
  },
  {
    title: "New opportunities available",
    description: "12 opportunities match your interests.",
    time: "Today",
    icon: BriefcaseBusiness,
    color: "text-cyan-300 bg-cyan-300/10",
  },
  {
    title: "Complete your first project",
    description: "Add your project to improve profile visibility.",
    time: "Recommended",
    icon: FolderKanban,
    color: "text-violet-300 bg-violet-300/10",
  },
];

const sidebarItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    active: true,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: CircleUserRound,
    active: false,
  },
  {
    label: "Projects",
    href: "/projects",
    icon: FolderKanban,
    active: false,
  },
  {
    label: "Resources",
    href: "#resources",
    icon: BookOpen,
    active: false,
  },
  {
    label: "Network",
    href: "#network",
    icon: Users,
    active: false,
  },
  {
    label: "Opportunities",
    href: "#opportunities",
    icon: BriefcaseBusiness,
    active: false,
  },
];

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<DashboardUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        fullName: authUser.user_metadata?.full_name ?? "Student",
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
    return user?.fullName?.trim().split(" ")[0] || "Student";
  }, [user]);

  const initials = useMemo(() => {
    if (!user?.fullName) return "S";

    return user.fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((name) => name.charAt(0).toUpperCase())
      .join("");
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

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050816] text-white">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-cyan-400" />
          <p className="mt-4 text-sm text-slate-400">
            Loading your dashboard...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[160px]" />
        <div className="absolute right-[-180px] top-20 h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[170px]" />
        <div className="absolute bottom-[-200px] left-[30%] h-[450px] w-[450px] rounded-full bg-pink-600/10 blur-[170px]" />
      </div>

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-white/[0.07] bg-[#070a17]/95 p-5 shadow-2xl backdrop-blur-2xl transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 shadow-lg shadow-blue-500/20">
              <GraduationCap className="h-5 w-5" />
            </span>

            <div>
              <p className="text-lg font-semibold tracking-tight">
                Campus<span className="text-cyan-300">Loop</span>
              </p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-600">
                Student Network
              </p>
            </div>
          </Link>

          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-slate-400 lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="mt-10 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  item.active
                    ? "border border-cyan-300/15 bg-cyan-300/[0.08] text-cyan-200"
                    : "text-slate-500 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${
                    item.active
                      ? "text-cyan-300"
                      : "text-slate-600 group-hover:text-white"
                  }`}
                />

                {item.label}

                {item.active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-300" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto">
          <div className="rounded-3xl border border-violet-300/10 bg-gradient-to-br from-violet-500/10 to-cyan-500/5 p-5">
            <Sparkles className="h-5 w-5 text-violet-300" />

            <p className="mt-4 font-semibold">Complete your profile</p>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              Add your skills, college and projects to improve recommendations.
            </p>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[35%] rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" />
            </div>

            <div className="mt-2 flex justify-between text-[10px] text-slate-500">
              <span>Progress</span>
              <span>35%</span>
            </div>

            <Link
              href="/profile"
              className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-slate-950 transition hover:scale-[1.02]"
            >
              Complete Profile
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="mt-4 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-red-300 transition hover:bg-red-500/10 disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" />
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </aside>

      <div className="lg:pl-[280px]">
        <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#050816]/80 backdrop-blur-2xl">
          <div className="flex h-20 items-center gap-4 px-5 sm:px-7 lg:px-10">
            <button
              type="button"
              aria-label="Open sidebar"
              onClick={() => setSidebarOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-slate-300 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="hidden max-w-md flex-1 items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 md:flex">
              <Search className="h-4 w-4 text-slate-600" />
              <input
                type="search"
                placeholder="Search projects, students, resources..."
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
              />
            </div>

            <div className="ml-auto flex items-center gap-3">
              <button
                type="button"
                aria-label="Messages"
                className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/[0.07] bg-white/[0.03] text-slate-400 transition hover:text-white"
              >
                <MessageCircleMore className="h-4 w-4" />
              </button>

              <button
                type="button"
                aria-label="Notifications"
                className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/[0.07] bg-white/[0.03] text-slate-400 transition hover:text-white"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-pink-400 ring-2 ring-[#050816]" />
              </button>

              <div className="hidden items-center gap-3 border-l border-white/10 pl-4 sm:flex">
                <div className="text-right">
                  <p className="max-w-40 truncate text-sm font-semibold">
                    {user?.fullName}
                  </p>
                  <p className="max-w-40 truncate text-xs text-slate-600">
                    {user?.email}
                  </p>
                </div>

                <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 font-semibold shadow-lg shadow-blue-500/15">
                  {initials}
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="px-5 py-8 sm:px-7 lg:px-10 lg:py-10">
          <div className="relative overflow-hidden rounded-[32px] border border-white/[0.09] bg-gradient-to-br from-blue-600/35 via-violet-600/25 to-pink-600/20 p-6 shadow-2xl sm:p-8 lg:p-10">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />

            <div className="relative flex flex-col justify-between gap-8 xl:flex-row xl:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-cyan-100">
                  <Sparkles className="h-3.5 w-3.5" />
                  Your student workspace
                </div>

                <h1 className="mt-5 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                  Welcome back, {firstName} 👋
                </h1>

                <p className="mt-4 max-w-2xl leading-7 text-slate-300">
                  Continue building your profile, discover opportunities and
                  connect with students who share your interests.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/profile"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
                  >
                    Complete Profile
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href="/projects/new"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.05] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.09]"
                  >
                    <Plus className="h-4 w-4" />
                    Add Project
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:w-[460px] xl:grid-cols-2">
                <HeroMiniStat value="12" label="New matches" />
                <HeroMiniStat value="3" label="Recommended clubs" />
                <HeroMiniStat value="0" label="Projects added" />
                <HeroMiniStat value="35%" label="Profile complete" />
              </div>
            </div>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <article
                  key={stat.title}
                  className="group relative overflow-hidden rounded-3xl border border-white/[0.075] bg-white/[0.03] p-6 transition duration-300 hover:-translate-y-1 hover:border-white/[0.14] hover:bg-white/[0.05]"
                >
                  <div
                    className={`absolute -right-16 -top-16 h-40 w-40 rounded-full ${stat.glow} blur-3xl transition group-hover:scale-125`}
                  />

                  <div className="relative flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-500">{stat.title}</p>
                      <p className="mt-3 text-3xl font-semibold tracking-tight">
                        {stat.value}
                      </p>
                    </div>

                    <span
                      className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>

                  <p className="relative mt-5 text-sm text-slate-500">
                    {stat.description}
                  </p>
                </article>
              );
            })}
          </div>

          <div className="mt-7 grid gap-7 xl:grid-cols-[1.35fr_0.65fr]">
            <section
              id="opportunities"
              className="rounded-[30px] border border-white/[0.075] bg-white/[0.03] p-5 sm:p-7"
            >
              <SectionTitle
                eyebrow="Recommended for you"
                title="Opportunities"
                action="View all"
              />

              <div className="mt-6 space-y-3">
                {opportunities.map((opportunity) => {
                  const Icon = opportunity.icon;

                  return (
                    <article
                      key={opportunity.title}
                      className="group flex flex-col gap-4 rounded-2xl border border-white/[0.065] bg-[#080c1b]/70 p-4 transition hover:border-white/[0.13] hover:bg-white/[0.045] sm:flex-row sm:items-center"
                    >
                      <span
                        className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${opportunity.color}`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold">
                          {opportunity.title}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {opportunity.company}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="rounded-full bg-cyan-300/10 px-3 py-1 text-[10px] font-semibold text-cyan-300">
                            {opportunity.type}
                          </span>

                          <span className="rounded-full bg-white/[0.05] px-3 py-1 text-[10px] text-slate-400">
                            {opportunity.location}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/[0.08] text-slate-500 transition group-hover:text-white"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="rounded-[30px] border border-white/[0.075] bg-white/[0.03] p-5 sm:p-7">
              <SectionTitle
                eyebrow="This week"
                title="Profile Progress"
                action="Edit"
              />

              <div className="mt-7 flex justify-center">
                <div className="relative grid h-40 w-40 place-items-center rounded-full bg-[conic-gradient(#22d3ee_0deg,#8b5cf6_126deg,rgba(255,255,255,0.06)_126deg)] p-3">
                  <div className="grid h-full w-full place-items-center rounded-full bg-[#080b19]">
                    <div className="text-center">
                      <p className="text-4xl font-semibold">35%</p>
                      <p className="mt-1 text-xs text-slate-500">Complete</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-7 space-y-3">
                <ProgressTask
                  label="Create account"
                  completed
                />
                <ProgressTask
                  label="Add college details"
                  completed={false}
                />
                <ProgressTask
                  label="Add skills"
                  completed={false}
                />
                <ProgressTask
                  label="Upload resume"
                  completed={false}
                />
                <ProgressTask
                  label="Add first project"
                  completed={false}
                />
              </div>

              <Link
                href="/profile"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
              >
                Complete Profile
                <ArrowRight className="h-4 w-4" />
              </Link>
            </section>
          </div>

          <div className="mt-7 grid gap-7 xl:grid-cols-[1.1fr_0.9fr]">
            <section
              id="network"
              className="rounded-[30px] border border-white/[0.075] bg-white/[0.03] p-5 sm:p-7"
            >
              <SectionTitle
                eyebrow="Recommended"
                title="Student Communities"
                action="Explore"
              />

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {communities.map((community) => {
                  const Icon = community.icon;

                  return (
                    <article
                      key={community.name}
                      className="group rounded-3xl border border-white/[0.065] bg-[#080c1b]/70 p-5 transition hover:-translate-y-1 hover:border-white/[0.13]"
                    >
                      <span
                        className={`grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br ${community.color}`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>

                      <h3 className="mt-6 font-semibold">{community.name}</h3>

                      <p className="mt-2 text-xs font-medium text-cyan-300">
                        {community.members}
                      </p>

                      <p className="mt-4 text-sm leading-6 text-slate-500">
                        {community.description}
                      </p>

                      <button
                        type="button"
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-white hover:text-slate-950"
                      >
                        Join Community
                      </button>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="rounded-[30px] border border-white/[0.075] bg-white/[0.03] p-5 sm:p-7">
              <SectionTitle
                eyebrow="Your updates"
                title="Recent Activity"
                action="View all"
              />

              <div className="mt-6 space-y-5">
                {activities.map((activity) => {
                  const Icon = activity.icon;

                  return (
                    <div key={activity.title} className="flex gap-4">
                      <span
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${activity.color}`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm font-semibold">
                            {activity.title}
                          </p>

                          <span className="shrink-0 text-[10px] text-slate-600">
                            {activity.time}
                          </span>
                        </div>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {activity.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-7 rounded-2xl border border-orange-300/10 bg-orange-300/[0.05] p-4">
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-orange-300/10 text-orange-300">
                    <TrendingUp className="h-4 w-4" />
                  </span>

                  <div>
                    <p className="text-sm font-semibold">
                      Improve your visibility
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Students with projects receive more collaboration
                      invitations.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <section
            id="resources"
            className="mt-7 rounded-[30px] border border-white/[0.075] bg-white/[0.03] p-5 sm:p-7"
          >
            <SectionTitle
              eyebrow="Learning"
              title="Quick Access"
              action="Browse resources"
            />

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <QuickAccessCard
                icon={BookOpen}
                title="Study Resources"
                description="Notes, PYQs and technical guides"
                gradient="from-cyan-400 to-blue-500"
              />

              <QuickAccessCard
                icon={CalendarDays}
                title="Campus Events"
                description="Workshops, seminars and meetups"
                gradient="from-violet-400 to-fuchsia-500"
              />

              <QuickAccessCard
                icon={BriefcaseBusiness}
                title="Internships"
                description="Explore industry opportunities"
                gradient="from-emerald-400 to-cyan-500"
              />

              <QuickAccessCard
                icon={Trophy}
                title="Hackathons"
                description="Competitions and challenges"
                gradient="from-orange-400 to-pink-500"
              />
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

function HeroMiniStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl">
      <p className="text-2xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-slate-300">{label}</p>
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
          {eyebrow}
        </p>

        <h2 className="mt-2 text-xl font-semibold tracking-tight">
          {title}
        </h2>
      </div>

      <button
        type="button"
        className="text-xs font-semibold text-slate-500 transition hover:text-cyan-300"
      >
        {action}
      </button>
    </div>
  );
}

function ProgressTask({
  label,
  completed,
}: {
  label: string;
  completed: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/[0.025] px-3 py-3">
      <span
        className={`grid h-6 w-6 place-items-center rounded-full ${
          completed
            ? "bg-emerald-300/15 text-emerald-300"
            : "border border-white/10 text-slate-600"
        }`}
      >
        <CheckCircle2 className="h-3.5 w-3.5" />
      </span>

      <span
        className={`text-sm ${
          completed ? "text-slate-300" : "text-slate-500"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function QuickAccessCard({
  icon: Icon,
  title,
  description,
  gradient,
}: {
  icon: typeof BookOpen;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <button
      type="button"
      className="group flex items-center gap-4 rounded-2xl border border-white/[0.065] bg-[#080c1b]/70 p-4 text-left transition hover:-translate-y-1 hover:border-white/[0.13]"
    >
      <span
        className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${gradient}`}
      >
        <Icon className="h-5 w-5" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold">{title}</span>
        <span className="mt-1 block text-xs leading-5 text-slate-500">
          {description}
        </span>
      </span>

      <ChevronRight className="h-4 w-4 text-slate-600 transition group-hover:translate-x-1 group-hover:text-white" />
    </button>
  );
}