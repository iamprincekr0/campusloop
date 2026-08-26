"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  Clock,
  Compass,
  FileCode,
  GraduationCap,
  Sparkles,
  Trophy,
} from "lucide-react";
import AppShell from "../components/AppShell";
import { supabase } from "../../lib/supabase";
import { OPPORTUNITIES, matchOpportunity, type Opportunity } from "../lib/campus-intelligence";

type User = { id: string; fullName: string; email: string };
type ProfileData = {
  branch: string | null;
  year: string | null;
  skills: string[] | null;
};
type ProjectData = {
  id: string;
};

export default function OpportunitiesPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [projectsCount, setProjectsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  useEffect(() => {
    let active = true;

    async function loadData() {
      const {
        data: { user: authUser },
        error,
      } = await supabase.auth.getUser();

      if (error || !authUser) {
        if (active) router.replace("/login");
        return;
      }

      if (!active) return;
      setUser({
        id: authUser.id,
        fullName: authUser.user_metadata?.full_name ?? "Student",
        email: authUser.email ?? "",
      });

      // Load profile branch/year/skills for match calculations
      const { data: profileData } = await supabase
        .from("profiles")
        .select("branch, year, skills")
        .eq("id", authUser.id)
        .single();

      if (active && profileData) {
        setProfile(profileData as ProfileData);
      }

      // Load project count for match calculations
      const { count } = await supabase
        .from("projects")
        .select("id", { count: "exact", head: true })
        .eq("user_id", authUser.id);

      if (active) {
        setProjectsCount(count || 0);
        setLoading(false);
      }
    }

    loadData();

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

  // Pre-calculate matching values for each opportunity
  const matchedOpportunities = useMemo(() => {
    if (!profile) return OPPORTUNITIES.map(opp => ({ opp, score: 0, matched: false, reasons: [] }));

    return OPPORTUNITIES.map((opp) => {
      const { matched, score, reasons } = matchOpportunity(
        opp,
        profile.branch || "",
        profile.year || "",
        profile.skills || [],
        projectsCount
      );
      return { opp, score, matched, reasons };
    }).sort((a, b) => b.score - a.score);
  }, [profile, projectsCount]);

  // Categories list
  const categories = ["All", "Internship", "Hackathon", "Workshop", "Competition", "Certification"];

  // Filter opportunities by active category
  const filteredOpps = useMemo(() => {
    return matchedOpportunities.filter((item) => {
      if (activeCategory === "All") return true;
      return item.opp.category === activeCategory;
    });
  }, [matchedOpportunities, activeCategory]);

  if (loading || !user) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#050816]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-500/20 border-t-blue-500" />
          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading opportunities...
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
      <section className="mx-auto max-w-[1540px] px-4 py-6 pb-28 sm:px-7 sm:py-8 lg:px-10 lg:pb-10">
        <div className="mb-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-400">
            Campus Ecosystem
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.05em] text-white sm:text-4xl">
            Campus Opportunities
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
            Discover internships, workshops, hackathons, and certifications tailored to your branch, skills, and progress.
          </p>
        </div>

        {/* Category Filters */}
        <div className="mb-8 flex flex-wrap gap-2 border-b border-slate-900 pb-5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                  : "bg-slate-950/60 text-slate-450 border border-slate-900/60 hover:bg-white/5"
              }`}
            >
              {cat}s
            </button>
          ))}
        </div>

        {/* Opportunities List */}
        {filteredOpps.length === 0 ? (
          <div className="rounded-[30px] border border-slate-900 bg-slate-950/20 px-6 py-14 text-center shadow-xl backdrop-blur-md">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-900/50 border border-slate-800/30 text-slate-500">
              <Compass className="h-6 w-6" />
            </span>
            <h2 className="mt-5 text-xl font-bold text-white">No matching opportunities yet.</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
              Improve your skills, add projects, or update your profile to unlock tailored opportunities.
            </p>
            <button
              onClick={() => router.push("/profile")}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-slate-100 text-slate-950 px-5 py-3.5 text-sm font-bold transition hover:bg-slate-200"
            >
              Update Profile <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredOpps.map(({ opp, score, matched, reasons }) => (
              <article
                key={opp.id}
                id={opp.id}
                className="flex flex-col rounded-[28px] border border-slate-900 bg-slate-950/20 p-6 shadow-xl backdrop-blur-sm transition duration-300 hover:scale-[1.01] hover:border-slate-800"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <span className="rounded-full bg-slate-900 border border-slate-800/80 px-3 py-1 text-[10px] font-bold text-slate-400">
                    {opp.category}
                  </span>
                  {matched && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-400">
                      <Sparkles className="h-3.5 w-3.5" /> Match: {score}%
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                  {opp.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-400 leading-relaxed mb-4 flex-1">
                  {opp.description}
                </p>

                {/* Meta details */}
                <div className="space-y-2.5 border-t border-slate-900/60 pt-4 mb-4">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    <span>Apply by: <strong>{opp.deadline}</strong></span>
                  </div>
                  {opp.eligibility.skills && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {opp.eligibility.skills.slice(0, 4).map(skill => (
                        <span key={skill} className="text-[9px] font-bold bg-slate-900 text-slate-500 border border-slate-900 px-2 py-0.5 rounded-md">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Why this matches you */}
                {matched && reasons.length > 0 && (
                  <div className="mb-5 rounded-2xl bg-blue-500/5 border border-blue-500/10 p-3.5">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-blue-400 mb-1.5">
                      Why this matches you
                    </h4>
                    <ul className="space-y-1">
                      {reasons.map((reason, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-xs text-slate-400 leading-normal">
                          <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action button */}
                <a
                  href={opp.actionHref}
                  className="mt-auto block text-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3 transition shadow-lg shadow-blue-600/10"
                >
                  {opp.actionLabel}
                </a>
              </article>
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}
