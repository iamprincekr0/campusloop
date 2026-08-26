"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import AppShell from "../components/AppShell";
import AIGuide from "../components/AIGuide";

type User = { id: string; fullName: string; email: string };

type ProfileData = {
  college: string | null;
  course: string | null;
  branch: string | null;
  year: string | null;
  skills: string[] | null;
  bio: string | null;
  resume_url: string | null;
};

type ProjectData = {
  title: string;
  description: string | null;
  tech_stack: string[] | null;
};

export default function AIPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

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

      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("college, course, branch, year, skills, bio, resume_url")
        .eq("id", authUser.id)
        .single();

      if (active && profileData) {
        setProfile(profileData as ProfileData);
      }

      // Fetch projects
      const { data: projectsData } = await supabase
        .from("projects")
        .select("title, description, tech_stack")
        .eq("user_id", authUser.id);

      if (active && projectsData) {
        setProjects(projectsData as ProjectData[]);
      }

      // Fetch upcoming events
      const { data: eventsData } = await supabase
        .from("events")
        .select("id, slug, title, registration_open")
        .eq("is_published", true);

      if (active && eventsData) {
        setEvents(eventsData);
      }

      if (active) setLoading(false);
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

  if (loading || !user) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#050816]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-500/20 border-t-blue-500" />
          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading AI Guide...
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
        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-400">
            Campus Intelligence
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.05em] text-white sm:text-4xl">
            CampusLoop AI Guide
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
            Your personalized guide for study, project help, career pathing, opportunities, and next steps.
          </p>
        </div>

        <div className="w-full relative">
          <AIGuide
            userFullName={user.fullName}
            profile={profile}
            projects={projects}
            upcomingEvents={events}
          />
        </div>
      </section>
    </AppShell>
  );
}