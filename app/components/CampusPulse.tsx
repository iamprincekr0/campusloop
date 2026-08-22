"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Sparkles,
  Sun,
} from "lucide-react";

type CampusPulseProps = {
  fullName: string;
  profileComplete?: boolean;
  hasProjects?: boolean;
  hasRegistrations?: boolean;
};

type FestivalConfig = {
  id: string;
  title: string;
  message: string;
  start: string;
  end: string;
  icon: string;
  accent: string;
};

const FESTIVALS: FestivalConfig[] = [
  {
    id: "ganesh-chaturthi-2026",
    title: "Happy Ganesh Chaturthi",
    message:
      "May this new beginning bring clarity, courage and great things to build.",
    start: "2026-09-14",
    end: "2026-09-25",
    icon: "🙏",
    accent: "from-orange-500 via-pink-500 to-violet-600",
  },
];

const MOTIVATIONS = [
  "One meaningful step today is better than ten plans for tomorrow.",
  "Keep learning. Keep building. Your next breakthrough can start today.",
  "Small progress compounds. Make today's move count.",
  "Your campus journey is being built one decision at a time.",
  "Do not wait for the perfect moment. Build the next step.",
];

function getGreeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Welcome back";
}

function getTodayKey() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(today.getDate()).padStart(2, "0")}`;
}

function getActiveFestival(today: string) {
  return FESTIVALS.find(
    (festival) => today >= festival.start && today <= festival.end
  );
}

export default function CampusPulse({
  fullName,
  profileComplete = false,
  hasProjects = false,
  hasRegistrations = false,
}: CampusPulseProps) {
  const pulse = useMemo(() => {
    const now = new Date();
    const today = getTodayKey();
    const festival = getActiveFestival(today);
    const name = fullName.trim().split(/\s+/)[0] || "Student";
    const greeting = getGreeting(now.getHours());

    const dayIndex = Math.floor(
      new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      ).getTime() / 86400000
    );

    let action: {
      label: string;
      href: string;
      icon: typeof CheckCircle2;
    } = {
      label: "Complete your profile",
      href: "/profile",
      icon: CheckCircle2,
    };

    if (hasRegistrations) {
      action = {
        label: "Check your registrations",
        href: "/events/extension-board-2026",
        icon: CalendarDays,
      };
    } else if (hasProjects) {
      action = {
        label: "Continue your project",
        href: "/projects",
        icon: ArrowRight,
      };
    } else if (profileComplete) {
      action = {
        label: "Discover what is next",
        href: "/events/extension-board-2026",
        icon: Sparkles,
      };
    }

    return {
      name,
      greeting,
      festival,
      motivation:
        MOTIVATIONS[Math.abs(dayIndex) % MOTIVATIONS.length],
      action,
      dateText: now.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "short",
      }),
    };
  }, [fullName, profileComplete, hasProjects, hasRegistrations]);

  const ActionIcon = pulse.action.icon;

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative mb-6 overflow-hidden rounded-[28px] border p-5 shadow-sm sm:p-6 ${
        pulse.festival
          ? "border-orange-200 bg-white"
          : "border-slate-200/80 bg-white"
      }`}
    >
      {pulse.festival && (
        <>
          <div
            className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${pulse.festival.accent}`}
          />
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-orange-300/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-violet-300/10 blur-3xl" />
        </>
      )}

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
        <div
          className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${
            pulse.festival
              ? "bg-gradient-to-br from-orange-100 to-pink-100 text-2xl"
              : "bg-blue-50 text-blue-600"
          }`}
        >
          {pulse.festival ? (
            pulse.festival.icon
          ) : (
            <Sun className="h-6 w-6" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600">
              {pulse.dateText}
            </span>

            {pulse.festival && (
              <span className="rounded-full bg-orange-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-orange-700">
                Special day
              </span>
            )}
          </div>

          <h2 className="mt-2 text-xl font-bold tracking-[-0.03em] text-slate-900 sm:text-2xl">
            {pulse.greeting}, {pulse.name}{" "}
            <span aria-hidden="true">
              {pulse.festival ? "🙏" : "👋"}
            </span>
          </h2>

          {pulse.festival ? (
            <>
              <p className="mt-2 text-sm font-semibold text-slate-700">
                {pulse.festival.title}
              </p>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                {pulse.festival.message}
              </p>
            </>
          ) : (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              {pulse.motivation}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500">
              <Sparkles className="h-3.5 w-3.5 text-blue-500" />
              CampusPulse
            </span>

            <span className="text-xs leading-7 text-slate-400">
              Your CampusLoop experience adapts to your journey.
            </span>
          </div>
        </div>

        <a
          href={pulse.action.href}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-600"
        >
          <ActionIcon className="h-4 w-4" />
          {pulse.action.label}
        </a>
      </div>
    </motion.section>
  );
}
