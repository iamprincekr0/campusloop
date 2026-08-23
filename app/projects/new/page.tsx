"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import AppShell from "../../components/AppShell";

type User = { id: string; fullName: string; email: string };

export default function NewProjectPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user: authUser },
        error,
      } = await supabase.auth.getUser();

      if (error || !authUser) {
        router.replace("/login");
        return;
      }

      setUser({
        id: authUser.id,
        fullName: authUser.user_metadata?.full_name ?? "Student",
        email: authUser.email ?? "",
      });
      setLoading(false);
    }

    loadUser();
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) return;

    setSaving(true);
    setMessage("");

    const skills = techStack
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const { error } = await supabase.from("projects").insert({
      user_id: user.id,
      title: title.trim(),
      description: description.trim(),
      tech_stack: skills,
      github_url: githubUrl.trim() || null,
      live_url: liveUrl.trim() || null,
      updated_at: new Date().toISOString(),
    });

    setSaving(false);

    if (error) {
      setIsError(true);
      setMessage(error.message);
      return;
    }

    setIsError(false);
    setMessage("Project added successfully.");

    setTimeout(() => {
      router.push("/projects");
      router.refresh();
    }, 700);
  }

  if (loading || !user) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#050816]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-500/20 border-t-blue-500" />
          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading project form...
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-400">
              Project Portfolio
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-[-0.05em] text-white sm:text-4xl">
              Add New Project
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
              Showcase your technical work to students and recruiters.
            </p>
          </div>
        </div>

        {message && (
          <div
            className={`mb-6 rounded-2xl border px-5 py-4 text-sm ${
              isError
                ? "border-red-900/50 bg-red-950/20 text-red-400"
                : "border-green-900/50 bg-green-950/20 text-green-400"
            }`}
          >
            {message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-900/60 bg-slate-950/40 p-6 md:p-8 shadow-2xl backdrop-blur-xl max-w-4xl"
        >
          <div className="space-y-5">
            <Field
              label="Project Title"
              value={title}
              placeholder="Smart EV Battery Monitoring System"
              required
              onChange={setTitle}
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Project Description
              </label>

              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={6}
                maxLength={1000}
                placeholder="Explain the project problem, your solution and key results..."
                className="w-full resize-none rounded-xl border border-slate-900/60 bg-slate-900/20 px-4 py-3 text-slate-200 outline-none placeholder:text-slate-500 focus:border-blue-500/50 focus:bg-slate-950/20 text-sm transition"
              />

              <p className="mt-1 text-right text-xs text-slate-500">
                {description.length}/1000
              </p>
            </div>

            <Field
              label="Tech Stack"
              value={techStack}
              placeholder="ESP32, C++, Supabase, Next.js"
              onChange={setTechStack}
            />

            <Field
              label="GitHub URL"
              value={githubUrl}
              type="url"
              placeholder="https://github.com/username/project"
              onChange={githubUrl => setGithubUrl(githubUrl)}
            />

            <Field
              label="Live Demo URL"
              value={liveUrl}
              type="url"
              placeholder="https://project-demo.vercel.app"
              onChange={liveUrl => setLiveUrl(liveUrl)}
            />
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-900/60 pt-6 sm:flex-row sm:justify-end">
            <Link
              href="/dashboard"
              className="rounded-xl border border-slate-800/40 px-6 py-3 text-center font-semibold text-slate-300 hover:bg-white/5 transition"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-650 px-7 py-3 font-semibold text-white transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 shadow-md shadow-blue-600/15"
            >
              {saving ? "Saving Project..." : "Add Project"}
            </button>
          </div>
        </form>
      </section>
    </AppShell>
  );
}

function Field({
  label,
  value,
  placeholder,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-900/60 bg-slate-900/20 px-4 py-3 text-slate-200 outline-none placeholder:text-slate-500 focus:border-blue-500/50 focus:bg-slate-950/20 text-sm transition"
      />
    </div>
  );
}