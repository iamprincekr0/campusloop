"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  FolderKanban,
  Lightbulb,
  Network,
  Plus,
  Sparkles,
  Target,
  Trophy,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import AppShell from "../components/AppShell";
import { supabase } from "../../lib/supabase";

type DashboardUser = { id: string; email: string; fullName: string };

type Opportunity = {
  title: string;
  organization: string;
  meta: string;
  type: string;
  icon: LucideIcon;
  iconStyle: string;
  tagStyle: string;
};

const opportunities: Opportunity[] = [
  { title: "EV Battery Research Internship", organization: "Energy Innovation Lab", meta: "Remote · Apply by 24 Aug", type: "Internship", icon: Zap, iconStyle: "bg-emerald-50 text-emerald-600", tagStyle: "bg-emerald-50 text-emerald-700" },
  { title: "Power Systems Innovation Hackathon", organization: "Future Grid Foundation", meta: "Hybrid · Starts 30 Aug", type: "Hackathon", icon: Trophy, iconStyle: "bg-orange-50 text-orange-600", tagStyle: "bg-orange-50 text-orange-700" },
  { title: "Embedded Systems Project Challenge", organization: "CampusLoop Community", meta: "Online · Team applications open", type: "Project", icon: FolderKanban, iconStyle: "bg-violet-50 text-violet-600", tagStyle: "bg-violet-50 text-violet-700" },
];

const communities = [
  { name: "EV & Battery Systems", members: "1.8K members", description: "BMS, battery modelling, charging and EV architecture.", icon: Zap, color: "bg-emerald-50 text-emerald-600", accent: "bg-emerald-500" },
  { name: "Embedded Builders", members: "3.2K members", description: "ESP32, Arduino, IoT and real hardware projects.", icon: Network, color: "bg-blue-50 text-blue-600", accent: "bg-blue-600" },
  { name: "GATE EE Preparation", members: "5.6K members", description: "Subject plans, PYQs, revision and peer discussion.", icon: BookOpen, color: "bg-violet-50 text-violet-600", accent: "bg-violet-500" },
];

const quickLinks = [
  { title: "Study library", description: "Notes, PYQs and guides", icon: BookOpen, tone: "bg-blue-50 text-blue-600", href: "/dashboard#resources" },
  { title: "Events", description: "Workshops and meetups", icon: CalendarDays, tone: "bg-violet-50 text-violet-600", href: "/events/extension-board-2026" },
  { title: "Opportunities", description: "Internships and roles", icon: BriefcaseBusiness, tone: "bg-emerald-50 text-emerald-600", href: "/dashboard#opportunities" },
  { title: "Build a project", description: "Show your best work", icon: FolderKanban, tone: "bg-orange-50 text-orange-600", href: "/projects/new" },
];

const reveal = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadUser() {
      const { data: { user: authUser }, error } = await supabase.auth.getUser();
      if (!mounted) return;
      if (error || !authUser) { router.replace("/login"); return; }
      setUser({ id: authUser.id, email: authUser.email ?? "", fullName: authUser.user_metadata?.full_name ?? "Student" });
      setLoading(false);
    }
    loadUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) router.replace("/login");
    });
    return () => { mounted = false; subscription.unsubscribe(); };
  }, [router]);

  const firstName = useMemo(() => user?.fullName.trim().split(" ")[0] || "Student", [user]);
  const initials = useMemo(() => user?.fullName.split(" ").filter(Boolean).slice(0, 2).map((name) => name[0].toUpperCase()).join("") || "S", [user]);

  async function handleLogout() {
    setLoggingOut(true);
    const { error } = await supabase.auth.signOut();
    if (error) { setLoggingOut(false); return; }
    router.replace("/login");
    router.refresh();
  }

  if (loading || !user) {
    return <main className="grid min-h-screen place-items-center bg-[#f7f8fc]"><div className="text-center"><div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" /><p className="mt-4 text-sm font-medium text-slate-500">Preparing your workspace…</p></div></main>;
  }

  return (
    <AppShell fullName={user.fullName} email={user.email} initials={initials} onLogout={handleLogout} loggingOut={loggingOut}>
      <section className="mx-auto max-w-[1540px] px-4 py-6 pb-28 sm:px-7 sm:py-8 lg:px-10 lg:pb-10">
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.07 } } }}>
          <motion.div variants={reveal} className="relative overflow-hidden rounded-[30px] bg-slate-950 px-6 py-7 text-white shadow-[0_24px_60px_rgba(15,23,42,0.17)] sm:px-8 sm:py-9 lg:px-10">
            <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-blue-500/35 blur-3xl" />
            <div className="absolute -bottom-32 right-[24%] h-64 w-64 rounded-full bg-violet-500/30 blur-3xl" />
            <div className="relative grid gap-8 xl:grid-cols-[1fr_420px] xl:items-end">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-blue-100"><Sparkles className="h-3.5 w-3.5" /> Your campus, organized</p>
                <h1 className="mt-5 max-w-2xl text-3xl font-bold tracking-[-0.055em] sm:text-4xl lg:text-5xl">Good morning, {firstName}.</h1>
                <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">Everything that moves your student life forward—from team projects to events and opportunities—now has one home.</p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link href="/profile" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-blue-50">Complete your profile <ArrowRight className="h-4 w-4" /></Link>
                  <Link href="/projects/new" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/15"><Plus className="h-4 w-4" /> Add a project</Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <HeroStat value="12" label="New matches" />
                <HeroStat value="3" label="Communities" />
                <HeroStat value="0" label="Projects shared" />
                <HeroStat value="35%" label="Profile complete" />
              </div>
            </div>
          </motion.div>

          <motion.div variants={reveal} className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Profile strength" value="35%" helper="Add your education and skills" icon={CircleUserRound} tone="bg-blue-50 text-blue-600" />
            <StatCard label="Your network" value="0" helper="Start connecting with peers" icon={Users} tone="bg-violet-50 text-violet-600" />
            <StatCard label="Projects" value="0" helper="Share your best work" icon={FolderKanban} tone="bg-orange-50 text-orange-600" />
            <StatCard label="Opportunities" value="12" helper="Curated for your interests" icon={Target} tone="bg-emerald-50 text-emerald-600" />
          </motion.div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
            <motion.section variants={reveal} id="opportunities" className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7"><SectionHeading eyebrow="Recommended for you" title="Don’t miss these" action="See all" />
              <div className="mt-5 space-y-3">{opportunities.map((item) => <OpportunityRow key={item.title} item={item} />)}</div>
            </motion.section>
            <motion.section variants={reveal} className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7"><SectionHeading eyebrow="Profile progress" title="Small steps, big signal" action="Edit profile" href="/profile" />
              <div className="mt-6 flex items-center gap-5"><div className="relative grid h-24 w-24 shrink-0 place-items-center rounded-full bg-[conic-gradient(#2563eb_0deg,#7c3aed_126deg,#e9edf5_126deg)] p-2"><div className="grid h-full w-full place-items-center rounded-full bg-white text-center"><span className="text-xl font-bold tracking-tight text-slate-950">35%</span><span className="text-[10px] text-slate-400">complete</span></div></div><p className="text-sm leading-6 text-slate-500">Finish your profile to receive more relevant project teammates and opportunities.</p></div>
              <div className="mt-6 space-y-3"><ProgressItem label="Account created" complete /><ProgressItem label="Add your academic details" /><ProgressItem label="List your skills" /><ProgressItem label="Share a first project" /></div>
              <Link href="/profile" className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700">Continue profile <ArrowRight className="h-4 w-4" /></Link>
            </motion.section>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <motion.section variants={reveal} className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7"><SectionHeading eyebrow="Find your people" title="Communities for you" action="Explore" />
              <div className="mt-5 grid gap-3 md:grid-cols-3">{communities.map((community) => <CommunityCard key={community.name} {...community} />)}</div>
            </motion.section>
            <motion.section variants={reveal} className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7"><SectionHeading eyebrow="Your week" title="Next up" action="View calendar" />
              <div className="mt-5 space-y-5"><Activity icon={CheckCircle2} color="bg-emerald-50 text-emerald-600" title="Your CampusLoop account is ready" detail="Complete a few profile details to unlock tailored suggestions." time="Today" /><Activity icon={CalendarDays} color="bg-blue-50 text-blue-600" title="Extension Board 2026 registration" detail="Early-bird registration is open for members." time="Aug 24" /><Activity icon={Lightbulb} color="bg-amber-50 text-amber-600" title="Add a project to get discovered" detail="Projects make your profile easier for potential teammates to find." time="Suggested" /></div>
              <Link href="/events/extension-board-2026" className="mt-5 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700">Open event calendar <ChevronRight className="h-4 w-4" /></Link>
            </motion.section>
          </div>

          <motion.section variants={reveal} id="resources" className="mt-6 rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7"><SectionHeading eyebrow="Everything in one place" title="Quick access" action="Browse all" />
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{quickLinks.map((link) => <Link key={link.title} href={link.href} className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 transition hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-md"><span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${link.tone}`}><link.icon className="h-5 w-5" /></span><span className="min-w-0 flex-1"><span className="block text-sm font-bold text-slate-800">{link.title}</span><span className="mt-1 block text-xs leading-5 text-slate-500">{link.description}</span></span><ChevronRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-blue-600" /></Link>)}</div>
          </motion.section>
        </motion.div>
      </section>
    </AppShell>
  );
}

function HeroStat({ value, label }: { value: string; label: string }) { return <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-4 backdrop-blur-sm"><p className="text-2xl font-bold tracking-tight">{value}</p><p className="mt-1 text-xs text-slate-300">{label}</p></div>; }
function StatCard({ label, value, helper, icon: Icon, tone }: { label: string; value: string; helper: string; icon: LucideIcon; tone: string }) { return <article className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><div className="flex items-start justify-between"><div><p className="text-sm font-medium text-slate-500">{label}</p><p className="mt-2 text-3xl font-bold tracking-[-0.04em] text-slate-950">{value}</p></div><span className={`grid h-11 w-11 place-items-center rounded-2xl ${tone}`}><Icon className="h-5 w-5" /></span></div><p className="mt-4 text-xs leading-5 text-slate-400">{helper}</p></article>; }
function SectionHeading({ eyebrow, title, action, href }: { eyebrow: string; title: string; action: string; href?: string }) { const classes = "text-xs font-bold text-blue-600 transition hover:text-blue-800"; return <div className="flex items-end justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600">{eyebrow}</p><h2 className="mt-2 text-xl font-bold tracking-[-0.035em] text-slate-900">{title}</h2></div>{href ? <Link href={href} className={classes}>{action}</Link> : <button type="button" className={classes}>{action}</button>}</div>; }
function OpportunityRow({ item }: { item: Opportunity }) { const Icon = item.icon; return <article className="group flex flex-col gap-4 rounded-2xl border border-slate-100 p-4 transition hover:border-blue-100 hover:bg-blue-50/40 sm:flex-row sm:items-center"><span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${item.iconStyle}`}><Icon className="h-5 w-5" /></span><div className="min-w-0 flex-1"><h3 className="text-sm font-bold text-slate-800">{item.title}</h3><p className="mt-1 text-xs text-slate-500">{item.organization} · {item.meta}</p><span className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${item.tagStyle}`}>{item.type}</span></div><button type="button" aria-label={`View ${item.title}`} className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-400 transition group-hover:border-blue-200 group-hover:bg-white group-hover:text-blue-600"><ChevronRight className="h-4 w-4" /></button></article>; }
function ProgressItem({ label, complete = false }: { label: string; complete?: boolean }) { return <div className="flex items-center gap-3"><span className={`grid h-6 w-6 place-items-center rounded-full ${complete ? "bg-emerald-100 text-emerald-600" : "border border-slate-200 text-slate-300"}`}><CheckCircle2 className="h-3.5 w-3.5" /></span><span className={`text-sm ${complete ? "font-medium text-slate-700" : "text-slate-400"}`}>{label}</span></div>; }
function CommunityCard({ name, members, description, icon: Icon, color, accent }: { name: string; members: string; description: string; icon: LucideIcon; color: string; accent: string }) { return <article className="group relative overflow-hidden rounded-2xl border border-slate-100 p-4 transition hover:-translate-y-0.5 hover:shadow-md"><span className={`absolute inset-x-0 top-0 h-1 ${accent}`} /><span className={`grid h-10 w-10 place-items-center rounded-xl ${color}`}><Icon className="h-5 w-5" /></span><h3 className="mt-5 text-sm font-bold text-slate-800">{name}</h3><p className="mt-1 text-xs font-semibold text-blue-600">{members}</p><p className="mt-3 text-xs leading-5 text-slate-500">{description}</p><button type="button" className="mt-4 text-xs font-bold text-slate-500 transition group-hover:text-blue-600">Join community</button></article>; }
function Activity({ icon: Icon, color, title, detail, time }: { icon: LucideIcon; color: string; title: string; detail: string; time: string }) { return <div className="flex gap-3"><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${color}`}><Icon className="h-4 w-4" /></span><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><p className="text-sm font-bold text-slate-700">{title}</p><span className="shrink-0 text-[10px] font-semibold text-slate-400">{time}</span></div><p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p></div></div>; }
