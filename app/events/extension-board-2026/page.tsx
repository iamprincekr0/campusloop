"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircuitBoard,
  Clock3,
  GraduationCap,
  MapPin,
  QrCode,
  ShieldCheck,
  Sparkles,
  Users,
  Wrench,
  Zap,
} from "lucide-react";

const EVENT = {
  title: "Electrical Extension Board Workshop",
  shortTitle: "Extension Board Workshop",
  date: "8 August 2026",
  time: "9:00 AM onwards",
  venue: "Department of Electrical Engineering",
  institution: "Sandip University, Nashik",
  registrationPath: "/events/extension-board-2026/register",

  // Event time alag ho to sirf ye line update karna
  countdownDate: "2026-08-08T09:00:00+05:30",
};

const workshopSteps = [
  {
    number: "01",
    title: "Register",
    description:
      "Scan the event QR code and submit your basic student details.",
    icon: QrCode,
  },
  {
    number: "02",
    title: "Join your group",
    description:
      "Receive or enter your assigned group code and meet your team.",
    icon: Users,
  },
  {
    number: "03",
    title: "Build safely",
    description:
      "Learn wiring, tools, connections and electrical safety with guidance.",
    icon: Wrench,
  },
  {
    number: "04",
    title: "Submit your project",
    description:
      "Add components, project details, team information and final photographs.",
    icon: CircuitBoard,
  },
];

const learningOutcomes = [
  "Understand phase, neutral and earth connections",
  "Learn correct switch, socket and indicator wiring",
  "Follow essential electrical safety practices",
  "Use basic electrical tools correctly",
  "Work collaboratively in an assigned student group",
  "Create a digital record of the completed project",
];

const faqs = [
  {
    question: "Who can participate in this workshop?",
    answer:
      "The workshop is designed for participating students attending the Extension Board event. Students should register through the official CampusLoop event page.",
  },
  {
    question: "Do I need to install an application?",
    answer:
      "No. Registration, group joining, project submission and future certificate access will work directly through the CampusLoop website.",
  },
  {
    question: "Should I bring electrical components?",
    answer:
      "Follow the instructions provided by the event organizers. Do not bring or handle mains electrical equipment unless specifically instructed and supervised.",
  },
  {
    question: "Will project work be submitted individually?",
    answer:
      "Projects will normally be submitted group-wise. One group submission can contain the project details and team member information.",
  },
];

function calculateTimeLeft() {
  const difference = new Date(EVENT.countdownDate).getTime() - Date.now();

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      started: true,
    };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    started: false,
  };
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{
        duration: 0.65,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function ExtensionBoardEventPage() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const countdownItems = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[#050816] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[4%] top-[8%] size-[28rem] rounded-full bg-cyan-500/10 blur-[130px]" />
        <div className="absolute right-[4%] top-[18%] size-[32rem] rounded-full bg-violet-600/10 blur-[150px]" />
        <div className="absolute bottom-[4%] left-[35%] size-[25rem] rounded-full bg-blue-500/10 blur-[140px]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_94%)]" />
      </div>

      {/* Navigation */}
      <header className="relative z-50 px-4 pt-4 sm:px-6">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between rounded-2xl border border-white/[0.08] bg-[#070a17]/75 px-4 shadow-2xl backdrop-blur-2xl sm:px-5">
          <Link
            href="/"
            className="group flex items-center gap-3"
            aria-label="CampusLoop homepage"
          >
            <span className="relative grid size-9 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600">
              <GraduationCap className="size-5 text-white transition-transform group-hover:-rotate-6" />
            </span>

            <span className="font-semibold tracking-[-0.03em]">
              Campus<span className="text-cyan-300">Loop</span>
            </span>
          </Link>

          <div className="hidden items-center gap-6 text-sm text-slate-400 md:flex">
            <a href="#details" className="transition hover:text-white">
              Details
            </a>
            <a href="#timeline" className="transition hover:text-white">
              Process
            </a>
            <a href="#learning" className="transition hover:text-white">
              Learning
            </a>
            <a href="#faq" className="transition hover:text-white">
              FAQ
            </a>
          </div>

          <Link
            href={EVENT.registrationPath}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:scale-[1.03]"
          >
            Register
            <ArrowRight className="size-4" />
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative px-5 pb-24 pt-20 sm:px-6 sm:pt-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.05,
                  },
                },
              }}
            >
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-3.5 py-2 text-xs font-medium text-cyan-100"
              >
                <span className="relative flex size-2">
                  <span className="absolute size-full animate-ping rounded-full bg-cyan-300 opacity-60" />
                  <span className="relative size-2 rounded-full bg-cyan-300" />
                </span>

                CampusLoop Event OS

                <span className="size-1 rounded-full bg-slate-500" />

                Official Workshop
              </motion.div>

              <motion.h1
                variants={{
                  hidden: { opacity: 0, y: 28 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="mt-7 max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl"
              >
                Learn. Build.
                <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                  Connect safely.
                </span>
              </motion.h1>

              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="mt-7 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8"
              >
                Join a hands-on workshop where students learn the construction,
                wiring logic and safety principles of an electrical extension
                board through guided group activity.
              </motion.p>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="mt-9 flex flex-col gap-3 sm:flex-row"
              >
                <Link
                  href={EVENT.registrationPath}
                  className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-slate-950 shadow-[0_14px_50px_rgba(34,211,238,0.2)] transition hover:-translate-y-0.5"
                >
                  Register for workshop
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <a
                  href="#details"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 text-sm font-medium text-white transition hover:bg-white/[0.08]"
                >
                  View event details
                  <ChevronDown className="size-4" />
                </a>
              </motion.div>

              <motion.div
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1 },
                }}
                className="mt-9 flex flex-wrap gap-3"
              >
                {[
                  { icon: CalendarDays, text: EVENT.date },
                  { icon: Clock3, text: EVENT.time },
                  { icon: MapPin, text: EVENT.institution },
                ].map(({ icon: Icon, text }) => (
                  <div
                    key={text}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3.5 py-3 text-xs text-slate-400"
                  >
                    <Icon className="size-4 text-cyan-300" />
                    {text}
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Event pass visual */}
            <motion.div
              initial={{ opacity: 0, x: 50, rotateY: 8 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{
                duration: 0.85,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative mx-auto w-full max-w-lg"
            >
              <div className="absolute -inset-10 rounded-full bg-gradient-to-br from-cyan-400/15 via-blue-500/10 to-violet-600/15 blur-3xl" />

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative overflow-hidden rounded-[2.25rem] border border-white/[0.1] bg-[#0a0e20]/90 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-8"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                      Workshop pass
                    </p>

                    <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                      {EVENT.shortTitle}
                    </h2>
                  </div>

                  <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg">
                    <Zap className="size-6" />
                  </span>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-4">
                    <CalendarDays className="size-5 text-cyan-300" />
                    <p className="mt-3 text-xs text-slate-500">Event date</p>
                    <p className="mt-1 text-sm font-medium">{EVENT.date}</p>
                  </div>

                  <div className="rounded-2xl border border-white/[0.07] bg-white/[0.035] p-4">
                    <Clock3 className="size-5 text-violet-300" />
                    <p className="mt-3 text-xs text-slate-500">Starting time</p>
                    <p className="mt-1 text-sm font-medium">{EVENT.time}</p>
                  </div>
                </div>

                <div className="mt-3 rounded-2xl border border-white/[0.07] bg-white/[0.035] p-4">
                  <MapPin className="size-5 text-emerald-300" />
                  <p className="mt-3 text-xs text-slate-500">Venue</p>
                  <p className="mt-1 text-sm font-medium">{EVENT.venue}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {EVENT.institution}
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-dashed border-white/10 pt-6">
                  <div>
                    <p className="text-xs text-slate-500">Registration</p>
                    <p className="mt-1 text-sm font-medium text-emerald-300">
                      Open
                    </p>
                  </div>

                  <QrCode className="size-14 text-white" />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Countdown */}
      <section className="relative px-5 pb-24 sm:px-6">
        <Reveal className="mx-auto max-w-5xl">
          <div className="rounded-[2rem] border border-white/[0.08] bg-white/[0.025] p-6 sm:p-9">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                {timeLeft.started ? "Workshop day" : "Workshop begins in"}
              </p>

              <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">
                {timeLeft.started
                  ? "The workshop has started"
                  : "Get ready to build"}
              </h2>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {countdownItems.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/[0.07] bg-[#080c1c] p-5 text-center"
                >
                  <motion.p
                    key={item.value}
                    initial={{ opacity: 0.4, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-3xl font-semibold tabular-nums text-white sm:text-4xl"
                  >
                    {String(item.value).padStart(2, "0")}
                  </motion.p>

                  <p className="mt-2 text-xs uppercase tracking-[0.15em] text-slate-500">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* Details */}
      <section
        id="details"
        className="relative border-y border-white/[0.06] bg-white/[0.018] px-5 py-24 sm:px-6 sm:py-32"
      >
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              About the workshop
            </p>

            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Practical learning with safety at the centre.
            </h2>

            <p className="mt-6 text-base leading-7 text-slate-400">
              Students will learn the function of switches, sockets,
              indicators, phase, neutral and earth connections through a
              structured group activity under supervision.
            </p>

            <div className="mt-8 rounded-2xl border border-amber-300/15 bg-amber-300/[0.055] p-5">
              <div className="flex gap-3">
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-amber-300" />

                <p className="text-sm leading-6 text-amber-100/75">
                  Electrical assembly and testing must only be performed under
                  authorized faculty or instructor supervision. Students should
                  not independently connect equipment to mains power.
                </p>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: Users,
                title: "Group-based activity",
                text: "Students collaborate in organized teams and document their contribution.",
              },
              {
                icon: CircuitBoard,
                title: "Understand the circuit",
                text: "Learn the purpose and connection of each component before assembly.",
              },
              {
                icon: Wrench,
                title: "Hands-on practice",
                text: "Observe and practise correct tool usage under controlled supervision.",
              },
              {
                icon: ShieldCheck,
                title: "Safety-first approach",
                text: "Follow insulation, continuity, earthing and safe testing principles.",
              },
            ].map(({ icon: Icon, title, text }, index) => (
              <Reveal key={title} delay={index * 0.06}>
                <article className="h-full rounded-[1.75rem] border border-white/[0.08] bg-[#080c1c]/80 p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/20">
                  <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400/15 to-violet-500/15 text-cyan-300 ring-1 ring-white/10">
                    <Icon className="size-5" />
                  </span>

                  <h3 className="mt-6 text-lg font-semibold">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {text}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="timeline" className="relative px-5 py-24 sm:px-6 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Smooth event flow
            </p>

            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Scan, register, build and submit.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-400">
              CampusLoop keeps the workshop process simple so students can
              focus on learning and teamwork.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {workshopSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <Reveal key={step.number} delay={index * 0.07}>
                  <article className="relative h-full overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-white/[0.025] p-6">
                    <span className="absolute right-5 top-4 text-5xl font-semibold text-white/[0.035]">
                      {step.number}
                    </span>

                    <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg">
                      <Icon className="size-5" />
                    </span>

                    <h3 className="mt-7 text-xl font-semibold">{step.title}</h3>

                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      {step.description}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Learning outcomes */}
      <section
        id="learning"
        className="relative border-y border-white/[0.06] bg-white/[0.018] px-5 py-24 sm:px-6 sm:py-32"
      >
        <div className="mx-auto max-w-6xl">
          <Reveal className="text-center">
            <Sparkles className="mx-auto size-7 text-cyan-300" />

            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              What students will learn
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {learningOutcomes.map((outcome, index) => (
              <Reveal key={outcome} delay={index * 0.04}>
                <div className="flex items-start gap-3 rounded-2xl border border-white/[0.07] bg-[#080c1c]/70 p-5">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-300" />

                  <p className="text-sm leading-6 text-slate-300">{outcome}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative px-5 py-24 sm:px-6 sm:py-32">
        <div className="mx-auto max-w-4xl">
          <Reveal className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Frequently asked questions
            </p>

            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Before you join
            </h2>
          </Reveal>

          <div className="mt-12 space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <Reveal key={faq.question} delay={index * 0.04}>
                  <article className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025]">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="flex w-full items-center justify-between gap-4 p-5 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="font-medium text-white">
                        {faq.question}
                      </span>

                      <ChevronDown
                        className={`size-5 shrink-0 text-slate-400 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="border-t border-white/[0.06] px-5 py-5"
                      >
                        <p className="text-sm leading-7 text-slate-400">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative px-5 pb-24 sm:px-6 sm:pb-32">
        <Reveal className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-[2.25rem] border border-cyan-300/15 bg-gradient-to-br from-cyan-400/[0.09] via-blue-500/[0.06] to-violet-500/[0.09] px-6 py-14 text-center sm:px-10 sm:py-20">
            <div className="absolute left-1/2 top-0 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/15 blur-[100px]" />

            <div className="relative">
              <QrCode className="mx-auto size-9 text-cyan-300" />

              <h2 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
                Ready to join the workshop?
              </h2>

              <p className="mx-auto mt-5 max-w-xl leading-7 text-slate-400">
                Complete the short registration process and receive your
                workshop participation details through CampusLoop.
              </p>

              <Link
                href={EVENT.registrationPath}
                className="group mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
              >
                Continue to registration
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/[0.06] px-5 py-8 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center text-xs text-slate-500 sm:flex-row sm:text-left">
          <p>
            CampusLoop Event OS · {EVENT.institution}
          </p>

          <p>Built for a safe and organized student workshop experience.</p>
        </div>
      </footer>
    </main>
  );
}