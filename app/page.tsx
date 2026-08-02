/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Atom,
  ArrowRight,
  BadgeCheck,
  Bell,
  BookOpen,
  Bot,
  BrainCircuit,
  BriefcaseBusiness,
  CalendarDays,
  ChartNoAxesCombined,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Code2,
  Cpu,
  FileCode2,
  FileText,
  FolderKanban,
  GraduationCap,
  Lightbulb,
  Library,
  Mail,
  Menu,
  MessageCircleMore,
  Microscope,
  Network,
  Play,
  Plus,
  Rocket,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
  UploadCloud,
  Users,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";

const navigation = [
  { label: "Features", href: "#features" },
  { label: "Campus Life", href: "#campus-life" },
  { label: "Resources", href: "#resources" },
  { label: "Communities", href: "#communities" },
];

const universities = [
  "IIT Bombay",
  "NIT Trichy",
  "BITS Pilani",
  "VIT Vellore",
  "SRM University",
  "Sandip University",
];

const featureCards = [
  {
    icon: Network,
    title: "One connected campus",
    description:
      "Find people, clubs, events, notes, and opportunities without jumping between scattered groups.",
    gradient: "from-cyan-400 to-blue-500",
  },
  {
    icon: BrainCircuit,
    title: "AI that knows student life",
    description:
      "Turn syllabi into study plans, discover resources, and get clear answers grounded in your course.",
    gradient: "from-violet-400 to-fuchsia-500",
  },
  {
    icon: Users,
    title: "Communities with momentum",
    description:
      "Join serious builders, creators, researchers, and peers who are working toward the same goal.",
    gradient: "from-orange-400 to-pink-500",
  },
  {
    icon: Library,
    title: "Knowledge, beautifully organized",
    description:
      "Save lecture notes, lab manuals, PYQs, books, and project references in one searchable library.",
    gradient: "from-emerald-400 to-cyan-500",
  },
];

const learningResources = [
  { icon: FileText, title: "Lecture Notes", value: "4,800+", color: "text-cyan-300", surface: "bg-cyan-300/10" },
  { icon: ClipboardCheck, title: "Previous Papers", value: "2,100+", color: "text-violet-300", surface: "bg-violet-300/10" },
  { icon: Play, title: "Video Lessons", value: "1,400+", color: "text-pink-300", surface: "bg-pink-300/10" },
  { icon: FileCode2, title: "Project Files", value: "3,700+", color: "text-emerald-300", surface: "bg-emerald-300/10" },
];

const communities = [
  {
    icon: Code2,
    title: "Code & Build",
    members: "8.4K members",
    description: "Daily shipping, peer code reviews, open-source squads, and hackathon teams.",
    color: "from-cyan-400 to-blue-500",
  },
  {
    icon: Lightbulb,
    title: "Founders Circle",
    members: "5.2K members",
    description: "Turn a campus problem into a product with co-founders, mentors, and early users.",
    color: "from-orange-400 to-pink-500",
  },
  {
    icon: Microscope,
    title: "Research Network",
    members: "3.8K members",
    description: "Discuss papers, discover labs, and find collaborators across disciplines.",
    color: "from-violet-400 to-fuchsia-500",
  },
];

const engineeringClubs = [
  { icon: Cpu, name: "Robotics & Automation", meta: "42 projects · 1.8K members", color: "from-cyan-400 to-blue-500" },
  { icon: Zap, name: "EV & Energy Systems", meta: "31 projects · 1.2K members", color: "from-emerald-400 to-cyan-500" },
  { icon: FileCode2, name: "Developer Student Club", meta: "88 projects · 3.4K members", color: "from-violet-400 to-fuchsia-500" },
  { icon: Rocket, name: "Aero & Space Society", meta: "24 projects · 940 members", color: "from-orange-400 to-pink-500" },
];

const testimonials = [
  {
    quote: "CampusLoop helped me find two teammates for our EV battery project in one evening. We went from an idea to a working prototype in six weeks.",
    name: "Aarav Mehta",
    role: "Electrical Engineering · NIT Trichy",
    avatar: "https://i.pravatar.cc/120?img=11",
  },
  {
    quote: "The resource library is the first place I check before every exam. The best notes are easy to find, verified, and actually organized by unit.",
    name: "Meera Nair",
    role: "Computer Science · VIT Vellore",
    avatar: "https://i.pravatar.cc/120?img=45",
  },
  {
    quote: "I discovered a research internship, prepared with the AI assistant, and connected with a senior from the same lab — all without leaving CampusLoop.",
    name: "Rohan Verma",
    role: "Mechanical Engineering · IIT Bombay",
    avatar: "https://i.pravatar.cc/120?img=12",
  },
];

const faqs = [
  {
    question: "Who can join CampusLoop?",
    answer: "CampusLoop is built for university students, recent graduates, faculty mentors, and verified student organizations. You can join with your college email and build a profile around your real interests, skills, and goals.",
  },
  {
    question: "Is CampusLoop free for students?",
    answer: "Yes. Core networking, communities, resource discovery, project collaboration, events, and opportunity tracking are free for students. Optional advanced tools can be added later without limiting the essential campus experience.",
  },
  {
    question: "How are notes and resources kept useful?",
    answer: "Resources are organized by university, branch, semester, subject, and topic. Students can save, rate, report, and recommend material, while trusted contributors and moderators help maintain quality.",
  },
  {
    question: "Can clubs and departments create official spaces?",
    answer: "Yes. Verified clubs, cells, departments, and placement teams can run branded communities, publish announcements, host events, share resources, and manage applications from one place.",
  },
  {
    question: "How does the AI assistant use my information?",
    answer: "The assistant uses the context you choose to provide — such as subjects, deadlines, saved resources, and goals — to make answers more relevant. Your private drafts and personal workspace are not posted to communities.",
  },
];

function Logo() {
  return (
    <a href="#home" className="group flex items-center gap-3" aria-label="CampusLoop home">
      <span className="relative grid size-9 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 shadow-[0_0_30px_rgba(34,211,238,0.28)]">
        <span className="absolute inset-px rounded-[11px] bg-[#0a0e21]/40" />
        <GraduationCap className="relative size-5 text-white transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110" />
      </span>
      <span className="text-lg font-semibold tracking-[-0.03em] text-white">
        Campus<span className="text-cyan-300">Loop</span>
      </span>
    </a>
  );
}

function GlowButton({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: React.ReactNode;
  secondary?: boolean;
}) {
  return (
    <motion.a
      href={href}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={
        secondary
          ? "group inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.055] px-6 text-sm font-medium text-white backdrop-blur-xl transition-colors hover:border-white/20 hover:bg-white/[0.09]"
          : "group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-6 text-sm font-semibold text-[#070a17] shadow-[0_10px_40px_rgba(103,232,249,0.22)]"
      }
    >
      {!secondary && (
        <span className="absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-cyan-100/80 to-transparent transition-transform duration-700 group-hover:translate-x-[120%]" />
      )}
      <span className="relative">{children}</span>
      <ArrowRight className="relative size-4 transition-transform duration-300 group-hover:translate-x-1" />
    </motion.a>
  );
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
}) {
  return (
    <Reveal className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">{eyebrow}</p>
      <h2 className="mt-5 text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">{title}</h2>
      <p className={`mt-6 text-base leading-7 text-slate-400 sm:text-lg ${align === "center" ? "mx-auto max-w-2xl" : "max-w-xl"}`}>
        {description}
      </p>
    </Reveal>
  );
}

function AvatarStack({ seeds }: { seeds: number[] }) {
  return (
    <div className="flex -space-x-2" aria-label={`${seeds.length} community members`}>
      {seeds.map((seed) => (
        <img
          key={seed}
          src={`https://i.pravatar.cc/80?img=${seed}`}
          alt=""
          className="size-8 rounded-full border-2 border-[#0a0e1d] object-cover"
        />
      ))}
    </div>
  );
}

function SectionLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="group inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-cyan-300">
      {children}
      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
    </a>
  );
}

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between rounded-2xl border border-white/[0.08] bg-[#070a17]/70 px-4 shadow-[0_16px_50px_rgba(0,0,0,0.25)] backdrop-blur-2xl sm:px-5"
      >
        <Logo />
        <div className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm text-slate-400 transition-colors hover:bg-white/[0.05] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            >
              {item.label}
            </a>
          ))}
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <a
            href="#signin"
            className="rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-white"
          >
            Sign in
          </a>
          <a
            href="#join"
            className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          >
            Join free
          </a>
        </div>
        <button
          type="button"
          className="grid size-10 place-items-center rounded-xl border border-white/10 text-white md:hidden"
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((value) => !value)}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-2 max-w-7xl rounded-2xl border border-white/10 bg-[#090d1d]/95 p-3 shadow-2xl backdrop-blur-2xl md:hidden"
        >
          {navigation.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm text-slate-300 hover:bg-white/[0.06] hover:text-white"
            >
              {item.label}
            </a>
          ))}
          <div className="mt-2 grid grid-cols-2 gap-2 border-t border-white/[0.07] pt-3">
            <a href="#signin" className="rounded-xl border border-white/10 px-4 py-3 text-center text-sm text-white">
              Sign in
            </a>
            <a href="#join" className="rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-slate-950">
              Join free
            </a>
          </div>
        </motion.div>
      )}
    </header>
  );
}

function HeroVisual() {
  const { scrollYProgress } = useScroll();
  const imageY = useTransform(scrollYProgress, [0, 0.35], [0, 70]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 48 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto w-full max-w-[650px] lg:mx-0"
    >
      <div className="absolute -inset-8 rounded-[3rem] bg-gradient-to-br from-cyan-500/20 via-violet-500/10 to-pink-500/20 blur-3xl" />
      <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.12] bg-white/[0.06] p-2 shadow-[0_40px_100px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:rounded-[2.5rem]">
        <div className="relative h-[460px] overflow-hidden rounded-[1.55rem] sm:h-[560px] sm:rounded-[2rem]">
          <motion.img
            style={{ y: imageY, scale: 1.12 }}
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1400&q=90"
            alt="Students walking together through a modern university campus"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-[#050816]/10 to-blue-950/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-violet-500/10 mix-blend-color" />
        </div>

        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-4 top-8 rounded-2xl border border-white/15 bg-[#08101f]/70 p-3 shadow-2xl backdrop-blur-xl sm:-left-10 sm:top-16 sm:p-4"
        >
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-emerald-300 to-cyan-500 text-slate-950">
              <Code2 className="size-5" />
            </span>
            <div>
              <p className="text-xs text-slate-400">Project match</p>
              <p className="text-sm font-semibold text-white">EV Innovation Team</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          className="absolute bottom-16 right-3 w-52 rounded-2xl border border-white/15 bg-[#0b1023]/75 p-4 shadow-2xl backdrop-blur-xl sm:-right-8 sm:bottom-20 sm:w-60"
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex -space-x-2">
              {["32", "47", "56"].map((seed) => (
                <img
                  key={seed}
                  src={`https://i.pravatar.cc/80?img=${seed}`}
                  alt=""
                  className="size-8 rounded-full border-2 border-[#0b1023] object-cover"
                />
              ))}
            </div>
            <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
              LIVE
            </span>
          </div>
          <p className="text-sm font-semibold text-white">Robotics Club Meetup</p>
          <p className="mt-1 text-xs text-slate-400">18 students joining tonight</p>
        </motion.div>

        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur-xl sm:bottom-6 sm:left-6 sm:right-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-200">Your campus, connected</p>
            <p className="mt-1 text-lg font-semibold text-white">Everything student life needs.</p>
          </div>
          <span className="hidden size-10 place-items-center rounded-full bg-white text-slate-950 sm:grid">
            <ArrowRight className="size-4 -rotate-45" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function Hero() {
  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden px-5 pb-20 pt-32 sm:px-6 lg:pt-28">
      <div className="absolute left-[8%] top-[12%] size-[26rem] rounded-full bg-cyan-500/15 blur-[120px]" />
      <div className="absolute right-[8%] top-[10%] size-[34rem] rounded-full bg-violet-600/15 blur-[150px]" />
      <motion.div
        animate={{ x: [0, 45, 0], y: [0, -30, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[5%] left-[35%] size-72 rounded-full bg-pink-500/10 blur-[120px]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_90%)]" />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
          }}
          className="max-w-2xl"
        >
          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-3.5 py-2 text-xs font-medium text-cyan-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl"
          >
            <Sparkles className="size-3.5 text-cyan-300" />
            The modern student network
            <span className="size-1 rounded-full bg-cyan-300" />
            Built for what&apos;s next
          </motion.div>
          <motion.h1
            variants={{ hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } }}
            className="text-[clamp(3.25rem,7vw,6.5rem)] font-semibold leading-[0.92] tracking-[-0.065em] text-white"
          >
            Campus life,
            <span className="mt-2 block bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              in one loop.
            </span>
          </motion.h1>
          <motion.p
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
            className="mt-7 max-w-xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8"
          >
            Meet your people. Master your courses. Build ambitious projects. Discover the opportunities that shape your future — all inside one intelligent campus network.
          </motion.p>
          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <GlowButton href="#join">Join CampusLoop free</GlowButton>
            <GlowButton href="#dashboard" secondary>
              Explore the experience
            </GlowButton>
          </motion.div>
          <motion.div
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            className="mt-10 grid max-w-lg grid-cols-3 divide-x divide-white/10"
          >
            {[
              ["50K+", "Students"],
              ["800+", "Communities"],
              ["12K+", "Resources"],
            ].map(([value, label], index) => (
              <div key={label} className={index === 0 ? "pr-4" : "px-4 sm:px-6"}>
                <p className="text-xl font-semibold tracking-tight text-white sm:text-2xl">{value}</p>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">{label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
        <HeroVisual />
      </div>

      <a
        href="#universities"
        aria-label="Scroll to explore CampusLoop"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] font-medium uppercase tracking-[0.24em] text-slate-500 transition-colors hover:text-white xl:flex"
      >
        Explore
        <motion.span animate={{ y: [0, 5, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
          <ChevronDown className="size-4" />
        </motion.span>
      </a>
    </section>
  );
}

function Universities() {
  return (
    <section id="universities" className="relative border-y border-white/[0.06] bg-white/[0.018] px-5 py-10 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <p className="mb-7 text-center text-[11px] font-medium uppercase tracking-[0.22em] text-slate-500">
          Powering student communities across leading campuses
        </p>
        <div className="grid grid-cols-2 items-center gap-x-6 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
          {universities.map((university) => (
            <div key={university} className="text-center text-sm font-semibold tracking-tight text-slate-500 transition-colors hover:text-slate-200">
              {university}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="relative overflow-hidden px-5 py-24 sm:px-6 sm:py-32">
      <div className="absolute left-1/2 top-1/3 h-[32rem] w-[52rem] -translate-x-1/2 rounded-full bg-blue-600/[0.07] blur-[140px]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Everything finally connected</p>
          <h2 className="mt-5 text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
            One place for your entire student journey.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            CampusLoop brings learning, people, opportunities, and ambitious work into a single beautifully organized space.
          </p>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {featureCards.map((feature, index) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-white/[0.035] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-colors hover:border-white/[0.16] hover:bg-white/[0.055]"
            >
              <div className={`absolute -right-16 -top-16 size-40 rounded-full bg-gradient-to-br ${feature.gradient} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20`} />
              <div className={`relative grid size-12 place-items-center rounded-2xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg`}>
                <feature.icon className="size-5" />
              </div>
              <h3 className="relative mt-8 text-lg font-semibold tracking-tight text-white">{feature.title}</h3>
              <p className="relative mt-3 text-sm leading-6 text-slate-400">{feature.description}</p>
              <ArrowRight className="relative mt-7 size-4 text-slate-600 transition-all duration-300 group-hover:translate-x-1 group-hover:text-cyan-300" />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CampusLife() {
  const moments = [
    {
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=88",
      label: "Campus moments",
      title: "Belong from day one",
      className: "md:col-span-2 md:row-span-2",
    },
    {
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=88",
      label: "Study circles",
      title: "Learn together",
      className: "md:col-span-1",
    },
    {
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=88",
      label: "Student teams",
      title: "Build something real",
      className: "md:col-span-1",
    },
  ];

  return (
    <section id="campus-life" className="relative px-5 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeader
            eyebrow="Campus life"
            title="Every good college story starts with people."
            description="Discover the conversations, events, friendships, and shared ambitions that turn a campus into your community."
            align="left"
          />
          <Reveal>
            <SectionLink href="#communities">Explore campus communities</SectionLink>
          </Reveal>
        </div>
        <div className="mt-14 grid min-h-[650px] gap-4 md:grid-cols-3 md:grid-rows-2">
          {moments.map((moment, index) => (
            <Reveal key={moment.title} className={moment.className} delay={index * 0.08}>
              <motion.article
                whileHover="hover"
                className="group relative h-full min-h-[300px] overflow-hidden rounded-[2rem] border border-white/[0.09] bg-white/[0.04] shadow-[0_28px_80px_rgba(0,0,0,0.3)]"
              >
                <motion.img
                  variants={{ hover: { scale: 1.05 } }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  src={moment.image}
                  alt={`${moment.title} at university`}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-[#050816]/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">{moment.label}</p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">{moment.title}</h3>
                </div>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function LearningResources() {
  return (
    <section id="resources" className="relative overflow-hidden border-y border-white/[0.055] bg-white/[0.016] px-5 py-24 sm:px-6 sm:py-32">
      <div className="absolute right-0 top-1/2 size-[34rem] -translate-y-1/2 rounded-full bg-violet-600/[0.08] blur-[150px]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <SectionHeader
            eyebrow="Learning resources"
            title="The clearest path from syllabus to mastery."
            description="Find what you need by university, branch, semester, subject, or topic — then save it into a study space that stays beautifully organized."
            align="left"
          />
          <Reveal className="mt-9 flex flex-col gap-4 sm:flex-row">
            <GlowButton href="#library">Open the library</GlowButton>
            <GlowButton href="#ai-assistant" secondary>Ask CampusAI</GlowButton>
          </Reveal>
          <Reveal className="mt-10 flex items-center gap-4">
            <AvatarStack seeds={[21, 25, 36, 49]} />
            <p className="text-sm text-slate-400"><span className="font-semibold text-white">2,400+ contributors</span> sharing better ways to learn</p>
          </Reveal>
        </div>

        <Reveal>
          <div className="relative rounded-[2rem] border border-white/[0.1] bg-[#090d1d]/80 p-4 shadow-[0_40px_100px_rgba(0,0,0,0.38)] backdrop-blur-xl sm:p-6">
            <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.045] px-4 py-3.5">
              <Search className="size-4 text-slate-500" />
              <span className="text-sm text-slate-500">Search power systems, data structures, thermodynamics...</span>
              <span className="ml-auto hidden rounded-lg border border-white/10 px-2 py-1 text-[10px] text-slate-500 sm:block">⌘ K</span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {learningResources.map((resource) => (
                <motion.article
                  key={resource.title}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-5 transition-colors hover:border-white/[0.14] hover:bg-white/[0.055]"
                >
                  <div className={`grid size-10 place-items-center rounded-xl ${resource.surface} ${resource.color}`}>
                    <resource.icon className="size-5" />
                  </div>
                  <p className="mt-6 text-2xl font-semibold tracking-tight text-white">{resource.value}</p>
                  <p className="mt-1 text-sm text-slate-400">{resource.title}</p>
                </motion.article>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between rounded-2xl border border-emerald-300/10 bg-emerald-300/[0.045] p-4">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-emerald-300/10 text-emerald-300"><BadgeCheck className="size-5" /></span>
                <div>
                  <p className="text-sm font-medium text-white">Quality-checked by the community</p>
                  <p className="mt-0.5 text-xs text-slate-500">Useful resources rise. Outdated ones don&apos;t.</p>
                </div>
              </div>
              <ShieldCheck className="hidden size-5 text-emerald-300 sm:block" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function DigitalLibrary() {
  const documents = [
    { type: "Notes", title: "Power System Stability — Complete Unit Notes", author: "Ananya S.", rating: "4.9", pages: "42 pages", color: "bg-cyan-300" },
    { type: "PYQ", title: "GATE EE Network Theory — Solved 2015–2026", author: "Rohit K.", rating: "4.8", pages: "86 pages", color: "bg-violet-300" },
    { type: "Lab", title: "MATLAB Simulink for BMS — Practical Manual", author: "EV Systems Club", rating: "4.9", pages: "64 pages", color: "bg-emerald-300" },
  ];

  return (
    <section id="library" className="relative px-5 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Digital library"
          title="Your smartest shelf. Always with you."
          description="Curated notes, books, papers, lab manuals, and project references — searchable in seconds and saved exactly where your brain expects them."
        />
        <Reveal className="mt-14">
          <div className="overflow-hidden rounded-[2rem] border border-white/[0.09] bg-[#090d1d] shadow-[0_40px_120px_rgba(0,0,0,0.4)]">
            <div className="flex flex-col gap-4 border-b border-white/[0.07] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white"><Library className="size-5" /></span>
                <div>
                  <h3 className="font-semibold text-white">CampusLoop Library</h3>
                  <p className="text-xs text-slate-500">12,000+ student-approved resources</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button type="button" className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-white/[0.08]">My library</button>
                <button type="button" className="inline-flex items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-xs font-semibold text-slate-950 transition-transform hover:scale-[1.02]"><UploadCloud className="size-3.5" /> Contribute</button>
              </div>
            </div>
            <div className="grid lg:grid-cols-[220px_1fr]">
              <aside className="hidden border-r border-white/[0.07] p-5 lg:block">
                <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">Browse</p>
                {["Discover", "My subjects", "Saved", "Downloads", "Contributions"].map((item, index) => (
                  <div key={item} className={`mb-1 flex items-center justify-between rounded-xl px-3 py-2.5 text-sm ${index === 0 ? "bg-white/[0.07] text-white" : "text-slate-500"}`}>
                    <span>{item}</span>{index === 0 && <ChevronRight className="size-3.5" />}
                  </div>
                ))}
              </aside>
              <div className="p-4 sm:p-6 lg:p-8">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row">
                  <div className="flex flex-1 items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 py-3"><Search className="size-4 text-slate-500" /><span className="text-sm text-slate-500">Search your academic universe</span></div>
                  <button type="button" className="rounded-xl border border-white/[0.08] px-4 py-3 text-sm text-slate-300">All subjects</button>
                </div>
                <div className="flex items-center justify-between">
                  <div><p className="text-sm font-semibold text-white">Recommended for you</p><p className="mt-1 text-xs text-slate-500">Based on Electrical Engineering · Semester 5</p></div>
                  <button type="button" className="text-xs font-medium text-cyan-300">View all</button>
                </div>
                <div className="mt-5 grid gap-3">
                  {documents.map((document) => (
                    <motion.article key={document.title} whileHover={{ x: 4 }} className="group flex items-start gap-4 rounded-2xl border border-white/[0.065] bg-white/[0.025] p-4 transition-colors hover:border-white/[0.13] hover:bg-white/[0.045] sm:items-center">
                      <span className={`mt-1 h-12 w-1 shrink-0 rounded-full ${document.color} sm:mt-0`} />
                      <span className="hidden size-11 shrink-0 place-items-center rounded-xl bg-white/[0.05] text-slate-300 sm:grid"><FileText className="size-5" /></span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2"><span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">{document.type}</span><span className="size-0.5 rounded-full bg-slate-600" /><span className="text-xs text-slate-600">{document.pages}</span></div>
                        <h4 className="mt-1 truncate text-sm font-medium text-white sm:text-base">{document.title}</h4>
                        <p className="mt-1 text-xs text-slate-500">by {document.author}</p>
                      </div>
                      <div className="hidden items-center gap-1 text-xs text-amber-300 sm:flex"><Star className="size-3.5 fill-current" /> {document.rating}</div>
                      <button type="button" aria-label={`Save ${document.title}`} className="grid size-9 shrink-0 place-items-center rounded-xl border border-white/[0.08] text-slate-500 transition-colors group-hover:text-white"><Plus className="size-4" /></button>
                    </motion.article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function StudentCommunities() {
  return (
    <section id="communities" className="relative overflow-hidden border-y border-white/[0.055] bg-white/[0.016] px-5 py-24 sm:px-6 sm:py-32">
      <div className="absolute left-1/2 top-1/2 size-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500/[0.07] blur-[160px]" />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Student communities"
          title="Find your people. Move faster together."
          description="Go beyond noisy group chats. Join focused communities designed around the things you want to learn, build, and become."
        />
        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {communities.map((community, index) => (
            <Reveal key={community.title} delay={index * 0.08}>
              <motion.article whileHover={{ y: -8 }} className="group relative h-full overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#090d1d]/80 p-7 shadow-[0_28px_80px_rgba(0,0,0,0.3)] backdrop-blur-xl">
                <div className={`absolute -right-20 -top-20 size-56 rounded-full bg-gradient-to-br ${community.color} opacity-10 blur-3xl transition-opacity duration-500 group-hover:opacity-20`} />
                <div className="relative flex items-start justify-between">
                  <span className={`grid size-12 place-items-center rounded-2xl bg-gradient-to-br ${community.color} text-white shadow-lg`}><community.icon className="size-5" /></span>
                  <button type="button" className="rounded-full border border-white/[0.09] px-4 py-2 text-xs font-semibold text-slate-300 transition-colors hover:bg-white hover:text-slate-950">Join</button>
                </div>
                <h3 className="relative mt-8 text-2xl font-semibold tracking-tight text-white">{community.title}</h3>
                <p className="relative mt-2 text-xs font-medium text-cyan-300">{community.members}</p>
                <p className="relative mt-5 text-sm leading-6 text-slate-400">{community.description}</p>
                <div className="relative mt-8 flex items-center justify-between border-t border-white/[0.07] pt-5">
                  <AvatarStack seeds={[index * 7 + 8, index * 7 + 14, index * 7 + 22]} />
                  <span className="text-xs text-slate-500">Active now</span>
                </div>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function EngineeringClubs() {
  return (
    <section id="clubs" className="relative px-5 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.88fr_1.12fr] lg:gap-20">
        <div>
          <SectionHeader
            eyebrow="Engineering clubs"
            title="Where curiosity becomes hardware."
            description="Meet the teams turning circuits, code, mechanics, and ambitious ideas into machines that move, think, and compete."
            align="left"
          />
          <Reveal className="mt-9">
            <SectionLink href="#projects">Explore engineering projects</SectionLink>
          </Reveal>
          <Reveal className="mt-10 grid grid-cols-3 gap-3">
            {[["180+", "Active clubs"], ["620+", "Live projects"], ["96", "Competition wins"]].map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                <p className="text-xl font-semibold tracking-tight text-white">{value}</p>
                <p className="mt-1 text-[11px] leading-4 text-slate-500">{label}</p>
              </div>
            ))}
          </Reveal>
        </div>
        <Reveal>
          <div className="relative rounded-[2rem] border border-white/[0.09] bg-white/[0.03] p-3 shadow-[0_40px_110px_rgba(0,0,0,0.35)]">
            <div className="relative mb-3 h-56 overflow-hidden rounded-[1.4rem] sm:h-72">
              <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=88" alt="Engineering students collaborating on a technical project" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070a17] via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-xs font-medium text-white backdrop-blur-xl">Open builds this week · 36</div>
            </div>
            <div className="space-y-2">
              {engineeringClubs.map((club, index) => (
                <motion.div key={club.name} whileHover={{ x: 5 }} className="group flex items-center gap-4 rounded-2xl border border-transparent p-3 transition-colors hover:border-white/[0.07] hover:bg-white/[0.035]">
                  <span className={`grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${club.color} text-white`}><club.icon className="size-5" /></span>
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-white">{club.name}</p><p className="mt-1 text-xs text-slate-500">{club.meta}</p></div>
                  <div className="hidden sm:block"><AvatarStack seeds={[index + 4, index + 15, index + 31]} /></div>
                  <ChevronRight className="size-4 text-slate-600 transition-transform group-hover:translate-x-1 group-hover:text-white" />
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ProjectCollaboration() {
  const tasks = [
    { label: "Battery data acquisition", owner: 14, status: "Complete", statusColor: "text-emerald-300 bg-emerald-300/10" },
    { label: "SoC estimation model", owner: 32, status: "In progress", statusColor: "text-cyan-300 bg-cyan-300/10" },
    { label: "ESP32 dashboard", owner: 47, status: "Review", statusColor: "text-violet-300 bg-violet-300/10" },
  ];

  return (
    <section id="projects" className="relative overflow-hidden border-y border-white/[0.055] bg-white/[0.016] px-5 py-24 sm:px-6 sm:py-32">
      <div className="absolute -left-40 top-1/3 size-[34rem] rounded-full bg-cyan-600/[0.08] blur-[150px]" />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Project collaboration"
          title="Turn the group project into your best work."
          description="Find complementary teammates, define milestones, share files, track decisions, and keep your build moving in one focused workspace."
        />
        <Reveal className="mt-14">
          <div className="grid overflow-hidden rounded-[2rem] border border-white/[0.09] bg-[#080c1b] shadow-[0_40px_120px_rgba(0,0,0,0.42)] lg:grid-cols-[1fr_320px]">
            <div className="border-b border-white/[0.07] p-4 sm:p-7 lg:border-b-0 lg:border-r">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-slate-950"><Zap className="size-5" /></span>
                  <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">Electrical engineering</p><h3 className="mt-1 text-lg font-semibold text-white">Smart Micro-BMS Prototype</h3></div>
                </div>
                <div className="flex items-center gap-3"><AvatarStack seeds={[14, 32, 47, 55]} /><button type="button" className="grid size-9 place-items-center rounded-full border border-dashed border-white/20 text-slate-400 hover:text-white"><Plus className="size-4" /></button></div>
              </div>
              <div className="mt-8 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <div className="flex items-center justify-between"><p className="text-sm font-medium text-white">Prototype milestone</p><span className="text-xs font-semibold text-cyan-300">72%</span></div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.06]"><motion.div initial={{ width: 0 }} whileInView={{ width: "72%" }} viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.2 }} className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500" /></div>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500"><span>18 tasks completed</span><span>Due 14 Sep</span></div>
              </div>
              <div className="mt-4 space-y-2">
                {tasks.map((task) => (
                  <div key={task.label} className="flex items-center gap-3 rounded-2xl border border-white/[0.065] bg-white/[0.02] p-4">
                    <CheckCircle2 className="size-4 shrink-0 text-slate-600" />
                    <p className="min-w-0 flex-1 truncate text-sm text-slate-300">{task.label}</p>
                    <img src={`https://i.pravatar.cc/80?img=${task.owner}`} alt="Task owner" className="size-7 rounded-full object-cover" />
                    <span className={`hidden rounded-full px-2.5 py-1 text-[10px] font-semibold sm:block ${task.statusColor}`}>{task.status}</span>
                  </div>
                ))}
              </div>
            </div>
            <aside className="p-5 sm:p-7">
              <div className="flex items-center justify-between"><h4 className="text-sm font-semibold text-white">Project activity</h4><Bell className="size-4 text-slate-500" /></div>
              <div className="mt-6 space-y-6">
                {[
                  ["Meera uploaded", "cell-voltage-test.csv", "8 min ago", 45],
                  ["Aarav completed", "Sensor calibration", "32 min ago", 11],
                  ["You commented on", "PCB review notes", "1 hr ago", 23],
                ].map(([action, detail, time, avatar]) => (
                  <div key={String(detail)} className="flex gap-3">
                    <img src={`https://i.pravatar.cc/80?img=${avatar}`} alt="" className="size-8 rounded-full object-cover" />
                    <div><p className="text-xs leading-5 text-slate-400">{action} <span className="font-medium text-white">{detail}</span></p><p className="mt-1 text-[10px] text-slate-600">{time}</p></div>
                  </div>
                ))}
              </div>
              <button type="button" className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.035] py-3 text-xs font-semibold text-slate-300 transition-colors hover:bg-white/[0.07] hover:text-white"><MessageCircleMore className="size-4" /> Open team chat</button>
            </aside>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Hackathons() {
  const events = [
    { month: "SEP", day: "18", title: "CampusLoop BuildSprint", mode: "Online + 12 campuses", prize: "₹5L prize pool", color: "from-cyan-400 to-blue-500" },
    { month: "OCT", day: "04", title: "GreenTech Challenge", mode: "IIT Bombay · Mumbai", prize: "Industry mentorship", color: "from-emerald-400 to-cyan-500" },
    { month: "OCT", day: "26", title: "AI for Bharat Hackathon", mode: "BITS Pilani · Hybrid", prize: "₹8L prize pool", color: "from-violet-400 to-fuchsia-500" },
  ];

  return (
    <section id="hackathons" className="relative px-5 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeader eyebrow="Hackathons" title="Build under pressure. Break into your potential." description="Discover high-signal competitions, form a balanced team, track deadlines, and walk in with a plan worth shipping." align="left" />
          <Reveal><SectionLink href="#join">See the full event calendar</SectionLink></Reveal>
        </div>
        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {events.map((event, index) => (
            <Reveal key={event.title} delay={index * 0.08}>
              <motion.article whileHover={{ y: -7 }} className="group relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.03] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.25)]">
                <div className={`absolute -right-14 -top-14 size-40 rounded-full bg-gradient-to-br ${event.color} opacity-10 blur-3xl transition-opacity group-hover:opacity-25`} />
                <div className="relative flex items-start justify-between">
                  <div className="rounded-2xl border border-white/[0.09] bg-white/[0.04] px-4 py-3 text-center"><p className="text-[10px] font-semibold tracking-[0.17em] text-cyan-300">{event.month}</p><p className="mt-1 text-2xl font-semibold text-white">{event.day}</p></div>
                  <Trophy className="size-5 text-amber-300" />
                </div>
                <h3 className="relative mt-8 text-xl font-semibold tracking-tight text-white">{event.title}</h3>
                <p className="relative mt-3 flex items-center gap-2 text-sm text-slate-400"><CalendarDays className="size-4 text-slate-600" />{event.mode}</p>
                <div className="relative mt-7 flex items-center justify-between border-t border-white/[0.07] pt-5"><span className="text-xs font-medium text-slate-300">{event.prize}</span><ArrowRight className="size-4 text-slate-600 transition-transform group-hover:translate-x-1 group-hover:text-cyan-300" /></div>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Internships() {
  const opportunities = [
    { company: "Ather Energy", role: "Battery Systems Intern", location: "Bengaluru · On-site", tags: ["BMS", "MATLAB"], color: "bg-emerald-300 text-emerald-950" },
    { company: "Microsoft", role: "Software Engineering Intern", location: "Hyderabad · Hybrid", tags: ["DSA", "React"], color: "bg-cyan-300 text-cyan-950" },
    { company: "ISRO", role: "Research Project Trainee", location: "Ahmedabad · On-site", tags: ["Control", "Embedded"], color: "bg-orange-300 text-orange-950" },
  ];

  return (
    <section id="internships" className="relative overflow-hidden border-y border-white/[0.055] bg-white/[0.016] px-5 py-24 sm:px-6 sm:py-32">
      <div className="absolute right-0 top-1/3 size-[34rem] rounded-full bg-blue-600/[0.08] blur-[150px]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20">
        <Reveal>
          <div className="rounded-[2rem] border border-white/[0.09] bg-[#090d1d]/90 p-4 shadow-[0_40px_100px_rgba(0,0,0,0.38)] sm:p-6">
            <div className="flex items-center justify-between"><div><p className="text-sm font-semibold text-white">Opportunities for you</p><p className="mt-1 text-xs text-slate-500">Matched to your skills and interests</p></div><span className="rounded-full bg-cyan-300/10 px-3 py-1.5 text-[10px] font-semibold text-cyan-300">24 NEW</span></div>
            <div className="mt-6 space-y-3">
              {opportunities.map((opportunity) => (
                <motion.article key={opportunity.role} whileHover={{ x: 5 }} className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 transition-colors hover:border-white/[0.14] hover:bg-white/[0.045] sm:p-5">
                  <div className="flex items-start gap-4">
                    <span className={`grid size-11 shrink-0 place-items-center rounded-xl text-sm font-black ${opportunity.color}`}>{opportunity.company.slice(0, 1)}</span>
                    <div className="min-w-0 flex-1"><h3 className="truncate text-sm font-semibold text-white sm:text-base">{opportunity.role}</h3><p className="mt-1 text-xs text-slate-400">{opportunity.company}</p><p className="mt-2 text-xs text-slate-600">{opportunity.location}</p></div>
                    <ArrowRight className="mt-1 size-4 text-slate-600 transition-transform group-hover:translate-x-1 group-hover:text-white" />
                  </div>
                  <div className="mt-4 flex gap-2 pl-0 sm:pl-15">{opportunity.tags.map((tag) => <span key={tag} className="rounded-lg bg-white/[0.05] px-2.5 py-1 text-[10px] font-medium text-slate-400">{tag}</span>)}</div>
                </motion.article>
              ))}
            </div>
          </div>
        </Reveal>
        <div>
          <SectionHeader eyebrow="Internships" title="The right opportunity, before everyone finds it." description="Get skill-matched internships, research roles, and industry projects — with alumni context and deadlines that never disappear in a chat." align="left" />
          <Reveal className="mt-9"><GlowButton href="#join">Build your opportunity profile</GlowButton></Reveal>
          <Reveal className="mt-8 flex items-center gap-3 text-sm text-slate-500"><BadgeCheck className="size-5 text-emerald-300" /><span>Verified roles from trusted employers and campus cells</span></Reveal>
        </div>
      </div>
    </section>
  );
}

function Research() {
  return (
    <section id="research" className="relative px-5 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2.25rem] border border-white/[0.1] bg-[#091020] shadow-[0_45px_130px_rgba(0,0,0,0.45)]">
          <img src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1800&q=90" alt="University students conducting research in a modern laboratory" className="absolute inset-0 h-full w-full object-cover opacity-55" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050816] via-[#050816]/90 to-[#050816]/20" />
          <div className="relative grid min-h-[600px] items-center gap-12 p-7 sm:p-12 lg:grid-cols-[0.9fr_1.1fr] lg:p-16">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Research</p>
              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">Ideas deserve the right minds around them.</h2>
              <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">Follow research areas, discuss meaningful papers, discover open lab positions, and connect with students who can take the question further.</p>
              <div className="mt-9"><GlowButton href="#join">Enter the research network</GlowButton></div>
            </Reveal>
            <Reveal className="lg:justify-self-end">
              <div className="w-full max-w-md rounded-[1.75rem] border border-white/15 bg-[#080c1b]/75 p-5 shadow-2xl backdrop-blur-2xl sm:p-6">
                <div className="flex items-center justify-between"><span className="grid size-11 place-items-center rounded-2xl bg-violet-300/15 text-violet-300"><Atom className="size-5" /></span><span className="rounded-full bg-emerald-300/10 px-3 py-1.5 text-[10px] font-semibold text-emerald-300">OPEN TO COLLABORATION</span></div>
                <p className="mt-7 text-xs font-semibold uppercase tracking-[0.17em] text-slate-500">Featured research thread</p>
                <h3 className="mt-3 text-xl font-semibold leading-7 text-white">Physics-informed battery health prediction for real driving cycles</h3>
                <p className="mt-4 text-sm leading-6 text-slate-400">A cross-campus exploration of SoH estimation using hybrid electrochemical and machine learning models.</p>
                <div className="mt-7 flex items-center justify-between border-t border-white/[0.08] pt-5"><div className="flex items-center gap-3"><AvatarStack seeds={[9, 16, 27]} /><span className="text-xs text-slate-500">7 researchers</span></div><ArrowRight className="size-4 text-white" /></div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function PlacementPreparation() {
  const preparationItems = [
    { label: "Resume strength", value: 92, color: "bg-cyan-400" },
    { label: "Aptitude practice", value: 76, color: "bg-violet-400" },
    { label: "Technical interview", value: 84, color: "bg-emerald-400" },
    { label: "Communication", value: 68, color: "bg-orange-400" },
  ];

  return (
    <section id="placement" className="relative overflow-hidden border-y border-white/[0.055] bg-white/[0.016] px-5 py-24 sm:px-6 sm:py-32">
      <div className="absolute left-1/2 top-1/2 size-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/[0.07] blur-[170px]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <SectionHeader eyebrow="Placement preparation" title="Walk into the interview already ready." description="Know where you stand, practice with intent, and turn preparation into a measurable weekly system — from resume to final HR round." align="left" />
          <Reveal className="mt-9 flex flex-col gap-3 sm:flex-row"><GlowButton href="#join">Start your placement plan</GlowButton><GlowButton href="#ai-assistant" secondary>Try a mock interview</GlowButton></Reveal>
          <Reveal className="mt-9 grid grid-cols-2 gap-3">
            {[["1,200+", "Company questions"], ["340+", "Mock interviews"], ["86%", "Profile completion"], ["24/7", "AI practice"]].map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4"><p className="text-xl font-semibold text-white">{value}</p><p className="mt-1 text-xs text-slate-500">{label}</p></div>
            ))}
          </Reveal>
        </div>
        <Reveal>
          <div className="rounded-[2rem] border border-white/[0.1] bg-[#090d1d]/90 p-5 shadow-[0_40px_110px_rgba(0,0,0,0.4)] sm:p-7">
            <div className="flex items-start justify-between">
              <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Placement readiness</p><h3 className="mt-2 text-xl font-semibold text-white">Your weekly pulse</h3></div>
              <div className="relative grid size-24 place-items-center rounded-full bg-[conic-gradient(#67e8f9_0deg,#8b5cf6_302deg,rgba(255,255,255,0.06)_302deg)] p-2"><div className="grid size-full place-items-center rounded-full bg-[#090d1d]"><div className="text-center"><p className="text-2xl font-semibold text-white">84</p><p className="text-[9px] uppercase tracking-wider text-slate-500">Strong</p></div></div></div>
            </div>
            <div className="mt-8 space-y-5">
              {preparationItems.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-xs"><span className="text-slate-400">{item.label}</span><span className="font-semibold text-white">{item.value}%</span></div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]"><motion.div initial={{ width: 0 }} whileInView={{ width: `${item.value}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.15 }} className={`h-full rounded-full ${item.color}`} /></div>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.045] p-4">
              <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-cyan-300/10 text-cyan-300"><Target className="size-5" /></span><div><p className="text-sm font-medium text-white">Next best action</p><p className="mt-1 text-xs text-slate-400">Complete one behavioral interview simulation</p></div><ChevronRight className="ml-auto size-4 text-slate-500" /></div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function AIAssistant() {
  return (
    <section id="ai-assistant" className="relative px-5 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="CampusAI" title="An intelligent study partner that knows your context." description="Ask better questions, understand difficult concepts, turn deadlines into plans, and move from confusion to a clear next step." />
        <Reveal className="mt-14">
          <div className="relative overflow-hidden rounded-[2.25rem] border border-white/[0.1] bg-[#080c1b] shadow-[0_45px_130px_rgba(0,0,0,0.46)]">
            <div className="absolute left-1/3 top-0 size-[26rem] rounded-full bg-cyan-600/[0.08] blur-[140px]" />
            <div className="absolute right-0 top-1/2 size-[28rem] rounded-full bg-violet-600/[0.09] blur-[150px]" />
            <div className="relative grid min-h-[620px] lg:grid-cols-[300px_1fr]">
              <aside className="hidden border-r border-white/[0.07] p-5 lg:block">
                <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 text-white"><Bot className="size-5" /></span><div><p className="text-sm font-semibold text-white">CampusAI</p><p className="text-[10px] text-emerald-300">● Ready to help</p></div></div>
                <button type="button" className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-xs font-semibold text-slate-950"><Plus className="size-4" /> New conversation</button>
                <p className="mb-3 mt-8 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">Recent</p>
                {["Network Theory revision", "BMS project roadmap", "Resume for EV internship", "GATE study schedule"].map((item, index) => <div key={item} className={`mb-1 truncate rounded-xl px-3 py-2.5 text-xs ${index === 0 ? "bg-white/[0.06] text-white" : "text-slate-500"}`}>{item}</div>)}
              </aside>
              <div className="flex min-w-0 flex-col">
                <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-4 sm:px-6"><div className="flex items-center gap-3 lg:hidden"><span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500"><Bot className="size-4" /></span><p className="text-sm font-semibold">CampusAI</p></div><p className="hidden text-sm font-medium text-slate-300 lg:block">Network Theory revision</p><button type="button" className="rounded-xl border border-white/[0.08] px-3 py-2 text-xs text-slate-400">Study mode</button></div>
                <div className="flex-1 space-y-6 overflow-hidden p-4 sm:p-8">
                  <div className="ml-auto max-w-xl rounded-[1.4rem] rounded-br-md bg-white p-4 text-sm leading-6 text-slate-900 shadow-xl">Explain KCL and KVL in simple Hinglish, then give me one GATE-level practice question.</div>
                  <div className="flex max-w-2xl gap-3">
                    <span className="mt-1 grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 text-white"><Sparkles className="size-4" /></span>
                    <div className="rounded-[1.4rem] rounded-tl-md border border-white/[0.08] bg-white/[0.035] p-5 text-sm leading-7 text-slate-300">
                      <p><strong className="text-white">KCL</strong> bolta hai: kisi junction par jitna current enter karega, utna hi current exit karega — charge junction par जमा नहीं होता.</p>
                      <div className="my-4 rounded-xl border border-cyan-300/10 bg-cyan-300/[0.045] px-4 py-3 font-mono text-cyan-200">Σ I<sub>in</sub> = Σ I<sub>out</sub></div>
                      <p><strong className="text-white">KVL</strong> bolta hai: closed loop ke around sab voltage rises aur drops ka algebraic sum zero hota hai.</p>
                      <div className="my-4 rounded-xl border border-violet-300/10 bg-violet-300/[0.045] px-4 py-3 font-mono text-violet-200">Σ V = 0</div>
                      <p className="text-slate-400">Ready for the practice circuit? I&apos;ll check each step, not just the final answer.</p>
                    </div>
                  </div>
                </div>
                <div className="border-t border-white/[0.07] p-4 sm:p-6">
                  <div className="flex items-center gap-3 rounded-2xl border border-white/[0.1] bg-white/[0.035] p-2.5 pl-4 shadow-inner"><span className="flex-1 text-sm text-slate-500">Ask anything about your course, project, or career...</span><button type="button" aria-label="Send message" className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 text-slate-950 transition-transform hover:scale-105"><Send className="size-4" /></button></div>
                  <p className="mt-2 text-center text-[10px] text-slate-600">CampusAI can make mistakes. Verify critical academic and career information.</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function DashboardPreview() {
  const activity = [
    { icon: FolderKanban, label: "Smart Micro-BMS", meta: "Project · 3 new updates", color: "text-emerald-300 bg-emerald-300/10" },
    { icon: BookOpen, label: "Power Systems Notes", meta: "Saved by 148 students", color: "text-cyan-300 bg-cyan-300/10" },
    { icon: Trophy, label: "GreenTech Challenge", meta: "Registration closes in 4 days", color: "text-amber-300 bg-amber-300/10" },
  ];

  return (
    <section id="dashboard" className="relative overflow-hidden border-y border-white/[0.055] bg-white/[0.016] px-5 py-24 sm:px-6 sm:py-32">
      <div className="absolute left-1/2 top-1/2 size-[50rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/[0.08] blur-[180px]" />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeader eyebrow="Student dashboard" title="Your next move, clear at a glance." description="One calm, personalized home for classes, projects, communities, opportunities, events, and the goals you care about now." />
        <Reveal className="mt-14">
          <div className="overflow-hidden rounded-[2rem] border border-white/[0.1] bg-[#080b18] shadow-[0_45px_130px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-2 border-b border-white/[0.07] bg-white/[0.018] px-4 py-3"><span className="size-2.5 rounded-full bg-red-400/70" /><span className="size-2.5 rounded-full bg-amber-300/70" /><span className="size-2.5 rounded-full bg-emerald-300/70" /><span className="ml-3 flex-1 rounded-lg bg-white/[0.04] py-1.5 text-center text-[10px] text-slate-600">app.campusloop.in/home</span></div>
            <div className="grid min-h-[650px] lg:grid-cols-[220px_1fr]">
              <aside className="hidden border-r border-white/[0.07] p-5 lg:flex lg:flex-col">
                <Logo />
                <nav className="mt-8 space-y-1">{[[ChartNoAxesCombined, "Overview"], [BookOpen, "Learning"], [Users, "Communities"], [FolderKanban, "Projects"], [BriefcaseBusiness, "Opportunities"], [CalendarDays, "Events"]].map(([Icon, label], index) => { const ItemIcon = Icon as typeof ChartNoAxesCombined; return <div key={String(label)} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs ${index === 0 ? "bg-white/[0.07] text-white" : "text-slate-500"}`}><ItemIcon className="size-4" />{String(label)}</div>; })}</nav>
                <div className="mt-auto rounded-2xl border border-violet-300/10 bg-violet-300/[0.045] p-4"><WandSparkles className="size-5 text-violet-300" /><p className="mt-3 text-xs font-medium text-white">Ask CampusAI</p><p className="mt-1 text-[10px] leading-4 text-slate-500">Get help with your next task.</p></div>
              </aside>
              <div className="min-w-0 p-4 sm:p-7 lg:p-9">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm text-slate-500">Sunday, 2 August</p><h3 className="mt-1 text-2xl font-semibold tracking-tight text-white">Good morning, Prince.</h3></div><div className="flex items-center gap-3"><button type="button" aria-label="Search" className="grid size-10 place-items-center rounded-xl border border-white/[0.08] text-slate-400"><Search className="size-4" /></button><button type="button" aria-label="Notifications" className="relative grid size-10 place-items-center rounded-xl border border-white/[0.08] text-slate-400"><Bell className="size-4" /><span className="absolute right-2 top-2 size-1.5 rounded-full bg-cyan-300" /></button><img src="https://i.pravatar.cc/80?img=68" alt="Prince's profile" className="size-10 rounded-xl object-cover" /></div></div>
                <div className="mt-8 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
                  <div className="rounded-[1.5rem] border border-white/[0.075] bg-gradient-to-br from-cyan-400/[0.12] via-blue-500/[0.07] to-violet-500/[0.12] p-5 sm:p-6">
                    <div className="flex items-start justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">Today&apos;s focus</p><h4 className="mt-3 max-w-sm text-xl font-semibold text-white sm:text-2xl">Finish the SoC estimation model before your team review.</h4></div><span className="hidden size-11 place-items-center rounded-2xl bg-white/[0.07] text-white sm:grid"><Target className="size-5" /></span></div>
                    <div className="mt-6 flex flex-wrap items-center gap-3"><button type="button" className="rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-slate-950">Continue project</button><span className="flex items-center gap-1.5 text-xs text-slate-400"><Clock3 className="size-3.5" /> 1h 40m planned</span></div>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/[0.075] bg-white/[0.025] p-5"><div className="flex items-center justify-between"><p className="text-sm font-semibold text-white">Weekly momentum</p><span className="text-xs font-semibold text-emerald-300">+18%</span></div><div className="mt-5 flex h-24 items-end gap-2">{[38, 55, 43, 68, 62, 82, 74].map((height, index) => <motion.div key={index} initial={{ height: 0 }} whileInView={{ height: `${height}%` }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className={`flex-1 rounded-t-md ${index === 5 ? "bg-gradient-to-t from-cyan-500 to-violet-400" : "bg-white/[0.07]"}`} />)}</div><div className="mt-2 flex justify-between text-[9px] text-slate-600">{["M", "T", "W", "T", "F", "S", "S"].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}</div></div>
                </div>
                <div className="mt-4 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-[1.5rem] border border-white/[0.075] bg-white/[0.025] p-5"><div className="flex items-center justify-between"><p className="text-sm font-semibold text-white">In your loop</p><button type="button" className="text-[10px] text-cyan-300">View all</button></div><div className="mt-4 space-y-2">{activity.map((item) => <div key={item.label} className="flex items-center gap-3 rounded-xl border border-white/[0.055] bg-white/[0.018] p-3"><span className={`grid size-9 place-items-center rounded-xl ${item.color}`}><item.icon className="size-4" /></span><div className="min-w-0 flex-1"><p className="truncate text-xs font-medium text-white">{item.label}</p><p className="mt-1 truncate text-[10px] text-slate-600">{item.meta}</p></div><ChevronRight className="size-3.5 text-slate-600" /></div>)}</div></div>
                  <div className="rounded-[1.5rem] border border-white/[0.075] bg-white/[0.025] p-5"><div className="flex items-center justify-between"><p className="text-sm font-semibold text-white">Upcoming</p><CalendarDays className="size-4 text-slate-500" /></div><div className="mt-5 space-y-5">{[["03", "Project team review", "4:30 PM"], ["05", "Power systems quiz", "10:00 AM"], ["08", "Robotics club meetup", "6:00 PM"]].map(([date, title, time]) => <div key={title} className="flex gap-3"><div className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/[0.05] text-xs font-semibold text-white">{date}</div><div><p className="text-xs font-medium text-slate-300">{title}</p><p className="mt-1 text-[10px] text-slate-600">{time}</p></div></div>)}</div></div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section id="stories" className="relative px-5 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Student stories" title="Built for the moments that change your trajectory." description="Real progress happens when the right person, resource, or opportunity arrives at the right time." />
        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Reveal key={testimonial.name} delay={index * 0.08}>
              <motion.article whileHover={{ y: -7 }} className="flex h-full flex-col rounded-[2rem] border border-white/[0.08] bg-white/[0.03] p-7 shadow-[0_25px_80px_rgba(0,0,0,0.24)]">
                <div className="flex gap-1 text-amber-300" aria-label="5 out of 5 stars">{Array.from({ length: 5 }).map((_, star) => <Star key={star} className="size-3.5 fill-current" />)}</div>
                <blockquote className="mt-7 flex-1 text-base leading-8 text-slate-300">“{testimonial.quote}”</blockquote>
                <div className="mt-8 flex items-center gap-3 border-t border-white/[0.07] pt-5"><img src={testimonial.avatar} alt={testimonial.name} className="size-11 rounded-full object-cover" /><div><p className="text-sm font-semibold text-white">{testimonial.name}</p><p className="mt-1 text-xs text-slate-500">{testimonial.role}</p></div></div>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="relative overflow-hidden border-y border-white/[0.055] bg-white/[0.016] px-5 py-24 sm:px-6 sm:py-32">
      <div className="absolute left-1/2 top-1/2 size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-600/[0.05] blur-[160px]" />
      <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
        <div>
          <SectionHeader eyebrow="Questions, answered" title="Everything you need to know." description="Still curious? Our student support team is one message away." align="left" />
          <Reveal className="mt-8"><a href="mailto:hello@campusloop.in" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 hover:text-cyan-200"><Mail className="size-4" /> hello@campusloop.in</a></Reveal>
        </div>
        <Reveal>
          <div className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={faq.question}>
                  <button type="button" onClick={() => setOpenIndex(isOpen ? -1 : index)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-6 py-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">
                    <span className="text-base font-medium text-white sm:text-lg">{faq.question}</span>
                    <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className="grid size-8 shrink-0 place-items-center rounded-full border border-white/[0.09] text-slate-400"><Plus className="size-4" /></motion.span>
                  </button>
                  <motion.div initial={false} animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }} className="overflow-hidden">
                    <p className="max-w-2xl pb-6 pr-10 text-sm leading-7 text-slate-400 sm:text-base">{faq.answer}</p>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section id="join" className="relative overflow-hidden px-5 py-24 sm:px-6 sm:py-32">
      <div className="absolute left-1/4 top-1/2 size-[30rem] -translate-y-1/2 rounded-full bg-cyan-500/[0.1] blur-[150px]" />
      <div className="absolute right-1/4 top-1/2 size-[30rem] -translate-y-1/2 rounded-full bg-violet-500/[0.12] blur-[150px]" />
      <Reveal className="relative mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/[0.12] bg-gradient-to-br from-white/[0.09] via-white/[0.035] to-white/[0.07] px-6 py-20 text-center shadow-[0_50px_150px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:px-12 sm:py-28">
          <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 28, repeat: Infinity, ease: "linear" }} className="absolute -left-24 -top-24 size-72 rounded-[40%] border border-cyan-300/10 bg-cyan-300/[0.025]" />
          <motion.div animate={{ rotate: [360, 0] }} transition={{ duration: 34, repeat: Infinity, ease: "linear" }} className="absolute -bottom-32 -right-24 size-80 rounded-[42%] border border-violet-300/10 bg-violet-300/[0.03]" />
          <span className="relative mx-auto grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500 text-white shadow-[0_15px_50px_rgba(34,211,238,0.28)]"><GraduationCap className="size-6" /></span>
          <p className="relative mt-8 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Your next chapter starts here</p>
          <h2 className="relative mx-auto mt-5 max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">The people, knowledge, and opportunities are already here.</h2>
          <p className="relative mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">Join the student network built to make every semester more connected, more ambitious, and more meaningful.</p>
          <div className="relative mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"><GlowButton href="#home">Join CampusLoop free</GlowButton><GlowButton href="mailto:campus@campusloop.in" secondary>Bring CampusLoop to your university</GlowButton></div>
          <p className="relative mt-6 text-xs text-slate-600">Free for students · University email verification · No credit card</p>
        </div>
      </Reveal>
    </section>
  );
}

function Footer() {
  const columns = [
    { title: "Product", links: [["Features", "#features"], ["CampusAI", "#ai-assistant"], ["Digital Library", "#library"], ["Dashboard", "#dashboard"]] },
    { title: "Explore", links: [["Communities", "#communities"], ["Projects", "#projects"], ["Hackathons", "#hackathons"], ["Internships", "#internships"]] },
    { title: "Campus", links: [["Engineering Clubs", "#clubs"], ["Research", "#research"], ["Placements", "#placement"], ["Student Stories", "#stories"]] },
    { title: "Company", links: [["About", "#home"], ["Contact", "mailto:hello@campusloop.in"], ["Privacy", "#privacy"], ["Terms", "#terms"]] },
  ];

  return (
    <footer className="border-t border-white/[0.07] bg-[#040611] px-5 pb-8 pt-16 sm:px-6 sm:pt-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 border-b border-white/[0.07] pb-14 md:grid-cols-[1.25fr_2fr]">
          <div className="max-w-sm"><Logo /><p className="mt-5 text-sm leading-6 text-slate-500">The modern student network for learning, building, belonging, and becoming.</p><div className="mt-6 flex gap-2"><a href="https://www.linkedin.com" aria-label="CampusLoop on LinkedIn" className="grid size-9 place-items-center rounded-xl border border-white/[0.08] text-slate-500 transition-colors hover:border-white/[0.15] hover:text-white"><BriefcaseBusiness className="size-4" /></a><a href="https://www.twitter.com" aria-label="CampusLoop on Twitter" className="grid size-9 place-items-center rounded-xl border border-white/[0.08] text-slate-500 transition-colors hover:border-white/[0.15] hover:text-white"><MessageCircleMore className="size-4" /></a><a href="mailto:hello@campusloop.in" aria-label="Email CampusLoop" className="grid size-9 place-items-center rounded-xl border border-white/[0.08] text-slate-500 transition-colors hover:border-white/[0.15] hover:text-white"><Mail className="size-4" /></a></div></div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">{columns.map((column) => <div key={column.title}><h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">{column.title}</h3><ul className="mt-5 space-y-3">{column.links.map(([label, href]) => <li key={label}><a href={href} className="text-sm text-slate-600 transition-colors hover:text-white">{label}</a></li>)}</ul></div>)}</div>
        </div>
        <div className="flex flex-col gap-4 pt-7 text-xs text-slate-700 sm:flex-row sm:items-center sm:justify-between"><p>© 2026 CampusLoop. Made for ambitious students.</p><div className="flex items-center gap-5"><span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-emerald-400" /> All systems operational</span><a href="#home" className="transition-colors hover:text-white">Back to top ↑</a></div></div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <title>CampusLoop — The Modern Student Network</title>
      <meta name="description" content="CampusLoop connects students with learning resources, communities, projects, hackathons, internships, research, placement preparation, and an intelligent AI study assistant." />
      <meta name="theme-color" content="#050816" />
      <main className="min-h-screen overflow-x-hidden bg-[#050816] font-sans text-white selection:bg-cyan-300 selection:text-slate-950">
        <Navbar />
        <Hero />
        <Universities />
        <Features />
        <CampusLife />
        <LearningResources />
        <DigitalLibrary />
        <StudentCommunities />
        <EngineeringClubs />
        <ProjectCollaboration />
        <Hackathons />
        <Internships />
        <Research />
        <PlacementPreparation />
        <AIAssistant />
        <DashboardPreview />
        <Testimonials />
        <FAQ />
        <FinalCTA />
        <Footer />
      </main>
    </>
  );
}
