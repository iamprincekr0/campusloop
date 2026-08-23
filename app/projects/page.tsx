"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ExternalLink, FolderKanban, GitBranch, Plus, Sparkles } from "lucide-react";
import AppShell from "../components/AppShell";
import { supabase } from "../../lib/supabase";

type User = { id: string; fullName: string; email: string };
type Project = { id: string; title: string; description: string | null; tech_stack: string[] | null; github_url: string | null; live_url: string | null; updated_at: string | null };

export default function ProjectsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function loadPage() {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      if (!active) return;
      if (authError || !authUser) { router.replace("/login"); return; }
      setUser({ id: authUser.id, fullName: authUser.user_metadata?.full_name ?? "Student", email: authUser.email ?? "" });
      const { data, error: projectsError } = await supabase.from("projects").select("id,title,description,tech_stack,github_url,live_url,updated_at").eq("user_id", authUser.id).order("updated_at", { ascending: false });
      if (!active) return;
      if (projectsError) setError("Your projects could not be loaded just now.");
      else setProjects((data ?? []) as Project[]);
      setLoading(false);
    }
    loadPage();
    return () => { active = false; };
  }, [router]);

  const initials = useMemo(() => user?.fullName.split(" ").filter(Boolean).slice(0, 2).map((name) => name[0]?.toUpperCase()).join("") || "S", [user]);
  async function handleLogout() { setLoggingOut(true); const { error } = await supabase.auth.signOut(); if (error) { setLoggingOut(false); return; } router.replace("/login"); router.refresh(); }

  if (loading || !user) return <main className="grid min-h-screen place-items-center bg-[#050816]"><div className="text-center"><div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-500/20 border-t-blue-500" /><p className="mt-4 text-sm font-medium text-slate-500">Loading projects…</p></div></main>;

  return <AppShell fullName={user.fullName} email={user.email} initials={initials} onLogout={handleLogout} loggingOut={loggingOut}>
    <section className="mx-auto max-w-[1540px] px-4 py-6 pb-28 sm:px-7 sm:py-8 lg:px-10 lg:pb-10">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-400">Your portfolio</p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.05em] text-white sm:text-4xl">Show what you’re building.</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">Projects are the clearest way to find collaborators, mentors, and your next opportunity.</p>
        </div>
        <Link href="/projects/new" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/15 transition hover:-translate-y-0.5 hover:bg-blue-700">
          <Plus className="h-4 w-4" /> Add project
        </Link>
      </div>
      {error && <div className="mt-6 rounded-2xl border border-amber-900/50 bg-amber-950/20 px-4 py-3 text-sm text-amber-400">{error}</div>}
      
      {projects.length === 0 ? (
        <div className="mt-7 rounded-[30px] border border-slate-900 bg-slate-950/20 px-6 py-14 text-center shadow-xl backdrop-blur-md">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <FolderKanban className="h-6 w-6" />
          </span>
          <h2 className="mt-5 text-xl font-bold text-white">Your portfolio starts here.</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">Add a class project, startup idea, research prototype, or anything you’re proud to have built.</p>
          <Link href="/projects/new" className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-slate-100 text-slate-950 px-5 py-3.5 text-sm font-bold transition hover:bg-slate-200">
            Create your first project <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <article key={project.id} className="rounded-[28px] border border-slate-900 bg-slate-950/20 p-6 shadow-xl backdrop-blur-sm transition duration-300 hover:scale-[1.01] hover:border-slate-800">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Sparkles className="h-5 w-5" />
              </span>
              <h2 className="mt-5 text-lg font-bold text-white">{project.title}</h2>
              <p className="mt-2 min-h-12 text-sm leading-6 text-slate-450 text-slate-400">{project.description || "Add a project description to help peers understand what you built."}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {(project.tech_stack ?? []).slice(0, 4).map((skill) => (
                  <span key={skill} className="rounded-full bg-slate-900 border border-slate-800/80 px-2.5 py-1 text-[10px] font-bold text-slate-400">{skill}</span>
                ))}
              </div>
              <div className="mt-6 flex gap-3 border-t border-slate-900/60 pt-4">
                {project.github_url && (
                  <a href={project.github_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-400 transition">
                    <GitBranch className="h-3.5 w-3.5" /> Code
                  </a>
                )}
                {project.live_url && (
                  <a href={project.live_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-400 transition">
                    <ExternalLink className="h-3.5 w-3.5" /> Demo
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  </AppShell>;
}
