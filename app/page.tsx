"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleCheckBig,
  Compass,
  FolderKanban,
  GraduationCap,
  Menu,
  Play,
  Search,
  Sparkles,
  Star,
  Trophy,
  Users,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import PremiumBackground from "./components/PremiumBackground";

const navigation = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Discover", href: "#discover" },
  { label: "For communities", href: "#communities" },
  { label: "Events", href: "/events/extension-board-2026" },
];

const features: { icon: LucideIcon; title: string; description: string; tone: string; iconTone: string }[] = [
  { icon: Compass, title: "Discover what matters", description: "Find projects, student communities, events, resources, and opportunities that suit where you want to go.", tone: "from-slate-900/40 to-slate-950/60 border border-slate-800/40", iconTone: "bg-blue-900/20 text-blue-400 border border-blue-500/20" },
  { icon: Users, title: "Find your people", description: "Meet teammates with complementary skills, join serious communities, and build a campus network with momentum.", tone: "from-slate-900/40 to-slate-950/60 border border-slate-800/40", iconTone: "bg-violet-900/20 text-violet-400 border border-violet-500/20" },
  { icon: FolderKanban, title: "Turn ambition into proof", description: "Keep projects visible, organise your work, and build a profile that opens real doors after college.", tone: "from-slate-900/40 to-slate-950/60 border border-slate-800/40", iconTone: "bg-emerald-900/20 text-emerald-400 border border-emerald-500/20" },
];

const steps = [
  { number: "01", title: "Build your student profile", description: "Your interests, skills, course, and goals create a workspace that feels personal from day one.", icon: GraduationCap, tone: "bg-blue-600" },
  { number: "02", title: "Explore your campus universe", description: "Use one calm, searchable home for events, teams, resources, and opportunities.", icon: Search, tone: "bg-violet-600" },
  { number: "03", title: "Make progress visible", description: "Share projects, join the right rooms, and keep track of what moves you forward.", icon: Sparkles, tone: "bg-emerald-600" },
];

const testimonials = [
  { quote: "I found two teammates for our energy-monitoring prototype and a mentor who helped us improve the demo.", name: "Aarav Mehta", detail: "Electrical Engineering · 3rd year", initials: "AM", color: "from-blue-500/20 to-cyan-500/20 border border-blue-500/20" },
  { quote: "CampusLoop makes opportunities feel discoverable instead of buried in ten different WhatsApp groups.", name: "Nandini Rao", detail: "Computer Science · 2nd year", initials: "NR", color: "from-violet-500/20 to-fuchsia-500/20 border border-violet-500/20" },
  { quote: "Our club finally has one space for applications, event updates, project teams, and resources.", name: "Karan Shah", detail: "Robotics Club Lead", initials: "KS", color: "from-emerald-500/20 to-teal-500/20 border border-emerald-500/20" },
];

const faqs = [
  { question: "Who is CampusLoop for?", answer: "CampusLoop is built for students, student communities, mentors, faculty teams, and early-career builders who want their campus work to connect." },
  { question: "Is CampusLoop free for students?", answer: "Yes. Students can create a profile, discover opportunities, explore communities, and organise projects through the core experience." },
  { question: "Can a club or college team use it?", answer: "Yes. Communities can use CampusLoop as a home for members, events, applications, resources, and team collaboration." },
];

const fadeUp = { hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0 } };

export default function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <main className="min-h-screen overflow-hidden text-slate-100 relative">
      <PremiumBackground />

      <header className="relative z-40 mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <nav className="flex h-16 items-center justify-between rounded-2xl border border-slate-800/40 bg-slate-950/40 px-4 shadow-lg backdrop-blur-xl sm:px-5">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="text-lg font-bold tracking-[-0.05em] text-white">
              Campus<span className="text-blue-400">Loop</span>
            </span>
          </Link>
          <div className="hidden items-center gap-7 lg:flex">
            {navigation.map((item) => (
              <Link key={item.label} href={item.href} className="text-sm font-semibold text-slate-400 transition hover:text-blue-400">
                {item.label}
              </Link>
            ))}
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <Link href="/login" className="rounded-xl px-4 py-2 text-sm font-bold text-slate-300 transition hover:bg-white/5">
              Sign in
            </Link>
            <Link href="/signup" className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700">
              Join CampusLoop
            </Link>
          </div>
          <button type="button" aria-label="Open navigation" onClick={() => setMobileOpen(true)} className="grid h-10 w-10 place-items-center rounded-xl text-slate-300 hover:bg-white/5 sm:hidden">
            <Menu className="h-5 w-5" />
          </button>
        </nav>
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="absolute inset-x-4 top-[4.75rem] rounded-2xl border border-slate-800 bg-slate-950 p-4 shadow-2xl sm:hidden">
              <div className="flex justify-end">
                <button type="button" aria-label="Close navigation" onClick={() => setMobileOpen(false)} className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 text-slate-400">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-2 space-y-1">
                {navigation.map((item) => (
                  <Link key={item.label} href={item.href} onClick={() => setMobileOpen(false)} className="block rounded-xl px-3 py-3 text-sm font-bold text-slate-300 hover:bg-white/5 hover:text-blue-400">
                    {item.label}
                  </Link>
                ))}
              </div>
              <Link href="/signup" onClick={() => setMobileOpen(false)} className="mt-3 flex items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white">
                Join CampusLoop
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <section className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pb-24 sm:pt-20 lg:px-8 lg:pb-28 lg:pt-28">
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.09 } } }} className="grid items-center gap-12 lg:grid-cols-[1fr_0.93fr] lg:gap-16">
          <div>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-600/10 px-3.5 py-2 text-xs font-bold text-blue-300">
              <span className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" /> Built for the student life you actually live
            </motion.div>
            <motion.h1 variants={fadeUp} className="mt-6 max-w-3xl text-4xl font-bold leading-[1.02] tracking-[-0.065em] text-white sm:text-5xl lg:text-6xl">
              Your entire campus life, <span className="text-blue-400">beautifully connected.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-6 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">
              CampusLoop turns scattered groups, missed deadlines, and hidden opportunities into one calm place to learn, build, belong, and move forward.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/signup" className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-600/25 transition hover:-translate-y-0.5 hover:bg-blue-700">
                Create your student space <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
              <Link href="#how-it-works" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/40 px-5 py-3.5 text-sm font-bold text-slate-300 transition hover:border-slate-700 hover:text-white">
                <Play className="h-4 w-4 fill-current" /> See how it works
              </Link>
            </motion.div>
            <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-semibold text-slate-400">
              <span className="flex items-center gap-2"><CircleCheckBig className="h-4 w-4 text-emerald-500" /> Free for students</span>
              <span className="flex items-center gap-2"><CircleCheckBig className="h-4 w-4 text-emerald-500" /> Built for campus life</span>
              <span className="flex items-center gap-2"><CircleCheckBig className="h-4 w-4 text-emerald-500" /> Your profile, your progress</span>
            </motion.div>
          </div>
          
          <motion.div variants={fadeUp} className="relative mx-auto w-full max-w-[570px] lg:ml-auto">
            <div className="absolute -left-8 top-12 hidden rounded-2xl border border-slate-800/40 bg-slate-950/80 p-3 shadow-xl backdrop-blur sm:block z-10">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-950/50 border border-emerald-500/20 text-emerald-400">
                  <Trophy className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-xs font-bold text-slate-200">New event match</span>
                  <span className="block text-[10px] text-slate-500">Just for your interests</span>
                </span>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-[32px] border border-slate-800/80 bg-slate-950/40 p-3 shadow-2xl backdrop-blur sm:p-4">
              <div className="rounded-[23px] bg-slate-900/35 border border-slate-900/40 p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
                      <GraduationCap className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-bold text-white">Campus<span className="text-blue-400">Loop</span></span>
                  </div>
                  <div className="flex gap-2">
                    <span className="h-7 w-7 rounded-lg bg-slate-800" />
                    <span className="h-7 w-7 rounded-full bg-violet-900/20 border border-violet-500/20" />
                  </div>
                </div>
                
                <div className="mt-6 rounded-2xl bg-slate-950/90 border border-slate-900/80 p-5 text-white">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-300">Thursday, August 20</p>
                  <div className="mt-3 flex items-end justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold tracking-tight text-white">Good morning, Aarav.</h2>
                      <p className="mt-1 text-xs text-slate-400">Your campus world is moving.</p>
                    </div>
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-blue-300 border border-white/5">
                      <Sparkles className="h-5 w-5" />
                    </span>
                  </div>
                  <div className="mt-5 grid grid-cols-3 gap-2">
                    <MiniStat value="12" label="Matches" />
                    <MiniStat value="3" label="Events" />
                    <MiniStat value="68%" label="Profile" />
                  </div>
                </div>
                
                <div className="mt-4 grid gap-3 sm:grid-cols-[1.15fr_.85fr]">
                  <div className="rounded-2xl border border-slate-950/80 bg-slate-950/30 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-300">For you</p>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
                    </div>
                    <DashboardRow icon={Zap} color="bg-emerald-950/50 text-emerald-400 border border-emerald-500/20" title="EV battery internship" meta="Apply by Aug 24" />
                    <DashboardRow icon={Users} color="bg-violet-950/50 text-violet-400 border border-violet-500/20" title="Embedded Builders" meta="3.2K members" />
                  </div>
                  
                  <div className="rounded-2xl border border-slate-950/80 bg-slate-950/30 p-4">
                    <p className="text-xs font-bold text-slate-300">This week</p>
                    <div className="mt-4 space-y-3">
                      <div className="rounded-xl bg-blue-950/30 border border-blue-900/20 p-3">
                        <p className="text-[10px] font-bold text-blue-400">SAT · 10:00 AM</p>
                        <p className="mt-1 text-xs font-bold text-slate-200">Extension Board</p>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-500">
                        <ClockDot /> Project proposal review
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-7 -right-4 hidden rounded-2xl border border-slate-800/40 bg-slate-950/80 p-3 shadow-xl sm:block z-10">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-violet-950/50 border border-violet-500/20 text-violet-400">
                  <Users className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-xs font-bold text-slate-200">Team invite accepted</span>
                  <span className="block text-[10px] text-slate-400">Your project just got stronger</span>
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section className="border-y border-slate-900 bg-slate-950/30 backdrop-blur-sm py-5">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-4 text-center text-xs font-bold uppercase tracking-[0.16em] text-slate-500 sm:px-6">
          <span>One platform for</span>
          <span className="text-slate-300">Learning</span>
          <span className="text-slate-300">Projects</span>
          <span className="text-slate-300">Communities</span>
          <span className="text-slate-300">Events</span>
          <span className="text-slate-300">Opportunities</span>
        </div>
      </section>

      <section id="discover" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <SectionIntro eyebrow="One connected campus" title="The student experience should not be split across a dozen tabs." description="CampusLoop creates one intentional home for every signal, relationship, and next step that matters." />
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className="mt-10 grid gap-5 md:grid-cols-3">
          {features.map((feature) => (
            <motion.article variants={fadeUp} key={feature.title} className={`group rounded-[28px] bg-slate-900/20 p-6 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-slate-800 ${feature.tone} sm:p-7`}>
              <span className={`grid h-12 w-12 place-items-center rounded-2xl ${feature.iconTone}`}>
                <feature.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-7 text-xl font-bold tracking-[-0.035em] text-white">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{feature.description}</p>
              <span className="mt-7 inline-flex items-center gap-1 text-xs font-bold text-slate-500 transition group-hover:text-blue-400">
                Explore more <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </motion.article>
          ))}
        </motion.div>
      </section>

      <section id="how-it-works" className="bg-slate-950/40 border-y border-slate-900 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[.83fr_1.17fr] lg:items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300">How it works</p>
              <h2 className="mt-4 text-3xl font-bold tracking-[-0.055em] text-white sm:text-4xl">Your campus world starts feeling intentional.</h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">No more lost links or scattered updates. CampusLoop quietly connects the parts of student life that deserve to work together.</p>
              <Link href="/signup" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-blue-300 hover:text-white transition">
                Start your student space <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {steps.map((step) => (
                <article key={step.number} className="rounded-3xl border border-slate-800/40 bg-slate-900/10 p-5 backdrop-blur-sm">
                  <span className={`grid h-10 w-10 place-items-center rounded-xl ${step.tone} text-sm font-bold text-white shadow-md`}>
                    {step.number}
                  </span>
                  <step.icon className="mt-9 h-5 w-5 text-blue-300" />
                  <h3 className="mt-4 text-lg font-bold tracking-tight text-white">{step.title}</h3>
                  <p className="mt-3 text-xs leading-6 text-slate-400">{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="communities" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_.9fr] lg:items-center">
          <div className="relative order-2 lg:order-1">
            <div className="rounded-[32px] border border-slate-800/60 bg-slate-950/40 p-5 shadow-2xl backdrop-blur-md sm:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-400">Community home</p>
                  <p className="mt-1 text-lg font-bold text-white">Robotics & Automation</p>
                </div>
                <span className="rounded-full bg-emerald-950/50 border border-emerald-500/20 px-3 py-1.5 text-[10px] font-bold text-emerald-400">
                  Verified club
                </span>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <InfoCard icon={Users} label="Members" value="1,842" tone="bg-blue-950/50 text-blue-400 border border-blue-500/20" />
                <InfoCard icon={FolderKanban} label="Projects" value="42" tone="bg-violet-950/50 text-violet-400 border border-violet-500/20" />
                <InfoCard icon={CalendarDays} label="Upcoming" value="06" tone="bg-emerald-950/50 text-emerald-400 border border-emerald-500/20" />
              </div>
              <div className="mt-5 rounded-2xl bg-slate-900/10 border border-slate-900/30 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-slate-300">Next event</p>
                  <span className="text-[10px] font-bold text-blue-400">See calendar</span>
                </div>
                <div className="mt-4 flex items-center gap-3 rounded-xl bg-slate-950/40 border border-slate-900/60 p-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-950/50 border border-orange-500/20 text-orange-450">
                    <Zap className="h-4 w-4" />
                  </span>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-200">Rapid prototyping workshop</p>
                    <p className="mt-1 text-[10px] text-slate-500">Saturday · Innovation Lab · 10:00 AM</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-600" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">For student communities</p>
            <h2 className="mt-4 text-3xl font-bold tracking-[-0.055em] text-white sm:text-4xl">Give your community a home worth joining.</h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-400">A single, welcoming space for members, events, resources, applications, and the projects that make your club matter.</p>
            <ul className="mt-7 space-y-4">
              {["Keep events, announcements, and applications together", "Help members discover teams and active projects", "Give new students a clear way to join and contribute"].map((item) => (
                <li key={item} className="flex gap-3 text-sm font-semibold text-slate-300">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />{item}
                </li>
              ))}
            </ul>
            <Link href="/signup" className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white text-slate-950 px-5 py-3 text-sm font-bold transition hover:bg-slate-100 hover:scale-[1.02]">
              Bring your community in <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-900 bg-slate-950/30 backdrop-blur-sm py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionIntro eyebrow="Made for real momentum" title="A better kind of campus network." description="Students do their best work when useful people and useful opportunities are easy to find." />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <figure key={testimonial.name} className="rounded-[28px] border border-slate-800/40 bg-slate-900/10 p-6">
                <div className="flex gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-5 text-base font-semibold leading-7 tracking-[-0.015em] text-slate-200">“{testimonial.quote}”</blockquote>
                <figcaption className="mt-7 flex items-center gap-3">
                  <span className={`grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br ${testimonial.color} text-xs font-bold text-slate-300`}>
                    {testimonial.initials}
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-slate-200">{testimonial.name}</span>
                    <span className="mt-0.5 block text-xs text-slate-500">{testimonial.detail}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-28">
        <SectionIntro eyebrow="Frequently asked" title="Questions, answered." description="Everything you need to know before making CampusLoop your home on campus." />
        <div className="mt-10 divide-y divide-slate-800/60 rounded-3xl border border-slate-800/60 bg-slate-950/40 px-5 shadow-sm sm:px-7">
          {faqs.map((faq, index) => (
            <div key={faq.question}>
              <button type="button" onClick={() => setOpenFaq(openFaq === index ? -1 : index)} className="flex w-full items-center justify-between gap-5 py-5 text-left text-sm font-bold text-slate-200">
                <span>{faq.question}</span>
                <ChevronDown className={`h-4 w-4 shrink-0 text-slate-500 transition ${openFaq === index ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence initial={false}>
                {openFaq === index && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <p className="max-w-2xl pb-5 text-sm leading-6 text-slate-400">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 sm:pb-28 lg:px-8">
        <div className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-blue-700 to-indigo-800 px-6 py-12 text-center text-white shadow-2xl shadow-blue-900/20 sm:px-10 sm:py-16">
          <div className="absolute -left-16 top-0 h-52 w-52 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -right-20 bottom-[-6rem] h-64 w-64 rounded-full bg-violet-600/10 blur-3xl" />
          <div className="relative">
            <span className="mx-auto grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-white border border-white/5 shadow-inner">
              <GraduationCap className="h-5 w-5" />
            </span>
            <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-bold tracking-[-0.055em] sm:text-4xl">Make your time on campus count for more.</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-blue-200">Join the students and communities turning daily campus life into meaningful progress.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-bold text-blue-700 transition hover:-translate-y-0.5 hover:bg-blue-50 hover:scale-[1.02]">
                Create your free account <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/login" className="inline-flex items-center justify-center rounded-2xl border border-white/30 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-white/10">
                I already have an account
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-900 bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <Link href="/" className="flex items-center gap-2 text-sm font-bold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-white shadow-sm">
              <GraduationCap className="h-4 w-4" />
            </span>
            <span className="text-white">Campus<span className="text-blue-400">Loop</span></span>
          </Link>
          <p className="text-xs text-slate-500">One campus. More momentum.</p>
          <div className="flex gap-5 text-xs font-semibold text-slate-500">
            <Link href="/login" className="hover:text-blue-400">Sign in</Link>
            <Link href="/signup" className="hover:text-blue-400">Create account</Link>
            <Link href="/events/extension-board-2026" className="hover:text-blue-400">Events</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/5 px-3 py-2.5">
      <p className="text-sm font-bold text-slate-100">{value}</p>
      <p className="mt-0.5 text-[9px] text-slate-400">{label}</p>
    </div>
  );
}

function DashboardRow({ icon: Icon, color, title, meta }: { icon: LucideIcon; color: string; title: string; meta: string }) {
  return (
    <div className="mt-3 flex items-center gap-2">
      <span className={`grid h-8 w-8 place-items-center rounded-lg ${color}`}>
        <Icon className="h-3.5 w-3.5" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[10px] font-bold text-slate-200">{title}</span>
        <span className="block text-[9px] text-slate-500">{meta}</span>
      </span>
    </div>
  );
}

function ClockDot() {
  return <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />;
}

// Fixed semantic text variables and accessibility contrast in SectionIntro
function SectionIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">{eyebrow}</p>
      <h2 className="mt-4 text-3xl font-bold tracking-[-0.055em] text-white sm:text-4xl">{title}</h2>
      <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">{description}</p>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value, tone }: { icon: LucideIcon; label: string; value: string; tone: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/10 p-3 shadow-inner">
      <span className={`grid h-8 w-8 place-items-center rounded-lg ${tone}`}>
        <Icon className="h-3.5 w-3.5" />
      </span>
      <p className="mt-4 text-lg font-bold text-white">{value}</p>
      <p className="text-[10px] font-semibold text-slate-500">{label}</p>
    </div>
  );
}
