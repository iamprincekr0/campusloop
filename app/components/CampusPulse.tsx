"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Sun, Star } from "lucide-react";

type CampusPulseProps = {
  fullName: string;
};

type FestivalConfig = {
  title: string;
  message: string;
  start: string;
  end: string;
  emoji: string;
  gradient: string;
};

const FESTIVALS: FestivalConfig[] = [
  {
    title: "Happy Republic Day",
    message: "Reflecting on our constitution and building a smarter nation together.",
    start: "2026-01-25",
    end: "2026-01-27",
    emoji: "🇮🇳",
    gradient: "from-orange-500 via-white to-green-500",
  },
  {
    title: "Happy Holi",
    message: "Wishing you a bright, colorful, and energetic semester ahead!",
    start: "2026-03-02",
    end: "2026-03-04",
    emoji: "🎨",
    gradient: "from-pink-400 via-yellow-300 to-cyan-400",
  },
  {
    title: "Happy Independence Day",
    message: "Celebrating freedom, innovation, and the power of student building.",
    start: "2026-08-14",
    end: "2026-08-16",
    emoji: "🇮🇳",
    gradient: "from-orange-500 via-white to-green-500",
  },
  {
    title: "Happy Teacher's Day",
    message: "Thanking the educators and mentors guiding us toward our next big steps.",
    start: "2026-09-04",
    end: "2026-09-06",
    emoji: "🍎",
    gradient: "from-blue-400 via-indigo-500 to-purple-600",
  },
  {
    title: "Happy Ganesh Chaturthi",
    message: "May this new beginning bring clarity, courage, and progress to your journey.",
    start: "2026-09-14",
    end: "2026-09-25",
    emoji: "🙏",
    gradient: "from-orange-400 via-pink-500 to-violet-600",
  },
  {
    title: "Happy Engineer's Day",
    message: "Celebrating the builders, problem solvers, and engineers shaping our future.",
    start: "2026-09-14",
    end: "2026-09-16",
    emoji: "⚙️",
    gradient: "from-slate-700 via-slate-800 to-slate-950",
  },
  {
    title: "Happy Diwali",
    message: "May the festival of lights bring prosperity, learning, and success to you.",
    start: "2026-11-07",
    end: "2026-11-10",
    emoji: "🪔",
    gradient: "from-yellow-500 via-orange-500 to-red-600",
  },
  {
    title: "Mid-Semester Exams",
    message: "Stay focused, take breaks, and tackle one problem statement at a time. You've got this!",
    start: "2026-10-12",
    end: "2026-10-17",
    emoji: "📝",
    gradient: "from-blue-600 via-violet-600 to-indigo-700",
  },
  {
    title: "End-Semester Exams",
    message: "The final stretch of the semester. Keep your focus sharp and finish strong!",
    start: "2026-12-07",
    end: "2026-12-19",
    emoji: "🎓",
    gradient: "from-indigo-600 via-blue-600 to-slate-900",
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
  if (hour >= 17 && hour < 21) return "Good evening";
  return "Welcome back";
}

function getLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
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
  const dateKey = getLocalDateKey(date);

  return FESTIVALS.find(
    (festival) =>
      dateKey >= festival.start &&
      dateKey <= festival.end
  );
}

export default function CampusPulse({
  fullName,
}: CampusPulseProps) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const updateTime = () => {
      setNow(new Date());
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
      <div className="mb-6 h-[150px] animate-pulse rounded-[28px] bg-slate-100" />
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="relative mb-6 overflow-hidden rounded-[30px] border border-slate-200/70 bg-white shadow-[0_14px_45px_rgba(15,23,42,0.06)]"
    >
      {/* ambient glow */}
      <div
        className={`pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl ${
          pulse.festival
            ? "bg-orange-300/20"
            : "bg-blue-300/15"
        }`}
      />

      <div
        className={`pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full blur-3xl ${
          pulse.festival
            ? "bg-violet-300/15"
            : "bg-cyan-300/10"
        }`}
      />

      {/* festival top accent */}
      {pulse.festival && (
        <div
          className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${pulse.festival.gradient}`}
        />
      )}

      <div className="relative px-6 py-7 sm:px-8 sm:py-8">
        <div className="flex items-start gap-4">
          <div
            className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${
              pulse.festival
                ? "bg-gradient-to-br from-orange-100 to-pink-100 text-2xl"
                : "bg-blue-50 text-blue-600"
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
              <Sparkles className="h-3.5 w-3.5 text-blue-500" />

              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
                CampusPulse
              </span>

              {pulse.festival && (
                <>
                  <span className="h-1 w-1 rounded-full bg-slate-300" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-orange-600">
                    Special day
                  </span>
                </>
              )}
            </div>

            <h2 className="mt-2 text-2xl font-bold tracking-[-0.04em] text-slate-950 sm:text-3xl">
              {pulse.greeting}, {pulse.firstName}.
            </h2>

            {pulse.festival ? (
              <>
                <p className="mt-2 text-sm font-bold text-slate-800 sm:text-base">
                  {pulse.festival.title} {pulse.festival.emoji}
                </p>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                  {pulse.festival.message}
                </p>
              </>
            ) : (
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                {pulse.motivation}
              </p>
            )}
          </div>

          <Star
            className={`hidden h-4 w-4 shrink-0 sm:block ${
              pulse.festival
                ? "text-orange-400"
                : "text-slate-200"
            }`}
          />
        </div>
      </div>
    </motion.section>
  );
}