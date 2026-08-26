"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Sun, Star } from "lucide-react";

type CampusPulseProps = {
  fullName: string;
  whatMattersToday?: string;
};

type FestivalConfig = {
  title: string;
  message: string;
  startMd: string;
  endMd: string;
  emoji: string;
  gradient: string;
  accentBar: string;
};

const FESTIVALS: FestivalConfig[] = [
  {
    title: "Happy Republic Day",
    message: "Reflecting on our constitution and building a smarter nation together.",
    startMd: "01-25",
    endMd: "01-27",
    emoji: "🇮🇳",
    gradient: "from-orange-500/15 via-white/5 to-green-500/15",
    accentBar: "from-orange-500 via-white to-green-500",
  },
  {
    title: "Happy Holi",
    message: "Wishing you a bright, colorful, and energetic semester ahead!",
    startMd: "03-02",
    endMd: "03-04",
    emoji: "🎨",
    gradient: "from-pink-500/15 via-yellow-500/10 to-cyan-500/15",
    accentBar: "from-pink-500 via-yellow-400 to-cyan-500",
  },
  {
    title: "Happy Independence Day",
    message: "Celebrating freedom, innovation, and the power of student building.",
    startMd: "08-14",
    endMd: "08-16",
    emoji: "🇮🇳",
    gradient: "from-orange-500/15 via-white/5 to-green-500/15",
    accentBar: "from-orange-500 via-white to-green-500",
  },
  {
    title: "Happy Teacher's Day",
    message: "Thanking the educators and mentors guiding us toward our next big steps.",
    startMd: "09-04",
    endMd: "09-06",
    emoji: "🍎",
    gradient: "from-blue-500/15 via-indigo-500/10 to-purple-600/15",
    accentBar: "from-blue-500 via-indigo-500 to-purple-600",
  },
  {
    title: "Happy Engineer's Day",
    message: "Celebrating the builders, problem solvers, and engineers shaping our future.",
    startMd: "09-14",
    endMd: "09-16",
    emoji: "⚙️",
    gradient: "from-slate-700/20 via-slate-800/20 to-slate-950/30",
    accentBar: "from-slate-650 via-slate-750 to-slate-900",
  },
  {
    title: "Happy Ganesh Chaturthi",
    message: "May this new beginning bring clarity, courage, and progress to your journey.",
    startMd: "09-17",
    endMd: "09-25",
    emoji: "🙏",
    gradient: "from-orange-500/20 via-red-500/15 to-yellow-600/20",
    accentBar: "from-orange-500 via-red-500 to-yellow-600",
  },
  {
    title: "Happy Diwali",
    message: "May the festival of lights bring prosperity, learning, and success to you.",
    startMd: "11-07",
    endMd: "11-10",
    emoji: "🪔",
    gradient: "from-yellow-500/20 via-orange-500/15 to-red-600/20",
    accentBar: "from-yellow-500 via-orange-500 to-red-600",
  },
  {
    title: "Mid-Semester Exams",
    message: "Stay focused, take breaks, and tackle one problem statement at a time. You've got this!",
    startMd: "10-12",
    endMd: "10-17",
    emoji: "📝",
    gradient: "from-blue-600/20 via-violet-600/15 to-indigo-700/20",
    accentBar: "from-blue-500 via-violet-500 to-indigo-650",
  },
  {
    title: "End-Semester Exams",
    message: "The final stretch of the semester. Keep your focus sharp and finish strong!",
    startMd: "12-07",
    endMd: "12-19",
    emoji: "🎓",
    gradient: "from-indigo-600/20 via-blue-600/15 to-slate-900/20",
    accentBar: "from-indigo-500 via-blue-500 to-slate-800",
  },
];

const DAILY_MESSAGES = [
  "Your campus is moving. Make your next move meaningful.",
  "One focused step today can change where you are tomorrow.",
  "Keep learning. Keep building. Keep moving forward.",
  "Your next opportunity can start with one small action today.",
  "Build something you will be proud to look back on.",
  "Great journeys are built from consistent small wins.",
  "You do not need to do everything today. Just do the next right thing.",
];

function getGreeting(hour: number) {
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  return "Good evening";
}

function getDailyMessage(date: Date) {
  const start = new Date(date.getFullYear(), 0, 1);
  const dayOfYear =
    Math.floor(
      (date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;

  return DAILY_MESSAGES[(dayOfYear - 1) % DAILY_MESSAGES.length];
}

function getActiveFestival(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const md = `${month}-${day}`;

  return FESTIVALS.find(
    (festival) =>
      md >= festival.startMd &&
      md <= festival.endMd
  );
}

export default function CampusPulse({
  fullName,
  whatMattersToday,
}: CampusPulseProps) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const previewDateStr = process.env.NEXT_PUBLIC_CAMPUSLOOP_PREVIEW_DATE;
      if (previewDateStr) {
        setNow(new Date(previewDateStr));
      } else {
        setNow(new Date());
      }
    };

    updateTime();

    const timer = window.setInterval(updateTime, 60_000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const pulse = useMemo(() => {
    if (!now) return null;

    const firstName =
      fullName.trim().split(/\s+/)[0] || "Student";

    const festival = getActiveFestival(now);

    return {
      firstName,
      greeting: getGreeting(now.getHours()),
      motivation: getDailyMessage(now),
      festival,
    };
  }, [fullName, now]);

  if (!pulse) {
    return (
      <div className="mb-6 h-[150px] animate-pulse rounded-[28px] bg-slate-900/40 border border-slate-900/60" />
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="relative mb-6 overflow-hidden rounded-[30px] border border-slate-800/40 bg-slate-950/40 backdrop-blur-xl shadow-2xl"
    >
      {/* Dynamic ambient glow based on festival or normal state */}
      <div
        className={`pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-[100px] transition-all duration-700 ${
          pulse.festival
            ? "bg-orange-500/10"
            : "bg-blue-500/10"
        }`}
      />

      <div
        className={`pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full blur-[100px] transition-all duration-700 ${
          pulse.festival
            ? "bg-violet-500/8"
            : "bg-indigo-500/5"
        }`}
      />

      {/* Reusable ambient color panel for active festival */}
      {pulse.festival && (
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${pulse.festival.gradient} opacity-20`}
        />
      )}

      {/* festival top accent */}
      {pulse.festival && (
        <div
          className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${pulse.festival.accentBar} shadow-[0_0_12px_#ffedd5]`}
        />
      )}

      <div className="relative px-6 py-7 sm:px-8 sm:py-8">
        <div className="flex items-start gap-4">
          <div
            className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${
              pulse.festival
                ? "bg-gradient-to-br from-orange-500/20 to-pink-500/20 border border-orange-500/30 text-2xl"
                : "bg-blue-500/10 border border-blue-500/20 text-blue-400"
            }`}
          >
            {pulse.festival ? (
              <span aria-hidden="true">
                {pulse.festival.emoji}
              </span>
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />

              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-400">
                CampusPulse
              </span>

              {pulse.festival && (
                <>
                  <span className="h-1 w-1 rounded-full bg-slate-800" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-orange-400">
                    Special day
                  </span>
                </>
              )}
            </div>

            <h2 className="mt-2 text-2xl font-bold tracking-[-0.04em] text-white sm:text-3xl">
              {pulse.greeting}, {pulse.firstName}.
            </h2>

            {pulse.festival ? (
              <>
                <p className="mt-2 text-sm font-bold text-slate-200 sm:text-base">
                  {pulse.festival.title} {pulse.festival.emoji}
                </p>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-400">
                  {pulse.festival.message}
                </p>
              </>
            ) : (
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                {pulse.motivation}
              </p>
            )}

            {whatMattersToday && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-blue-500/5 border border-blue-500/10 px-3.5 py-2.5 text-xs text-slate-300">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse shrink-0" />
                <span>
                  <strong className="text-blue-400 font-bold uppercase tracking-wider text-[9px] mr-1.5">What matters today</strong> 
                  {whatMattersToday}
                </span>
              </div>
            )}
          </div>

          <Star
            className={`hidden h-4 w-4 shrink-0 sm:block ${
              pulse.festival
                ? "text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                : "text-slate-800"
            }`}
          />
        </div>
      </div>
    </motion.section>
  );
}