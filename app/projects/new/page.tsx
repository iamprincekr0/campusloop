"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function NewProjectPage() {
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.replace("/login");
        return;
      }

      setUserId(user.id);
      setLoading(false);
    }

    loadUser();
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!userId) return;

    setSaving(true);
    setMessage("");

    const skills = techStack
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const { error } = await supabase.from("projects").insert({
      user_id: userId,
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

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050816] text-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-blue-500" />
          <p className="mt-4 text-sm text-slate-400">
            Loading project form...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050816] px-5 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
              Project Portfolio
            </p>

            <h1 className="mt-3 text-4xl font-bold">
              Add New Project
            </h1>

            <p className="mt-2 text-slate-400">
              Showcase your technical work to students and recruiters.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="rounded-xl border border-white/10 px-4 py-2 text-sm transition hover:bg-white/5"
          >
            Dashboard
          </Link>
        </div>

        {message && (
          <div
            className={`mb-6 rounded-2xl border px-5 py-4 text-sm ${
              isError
                ? "border-red-500/30 bg-red-500/10 text-red-300"
                : "border-green-500/30 bg-green-500/10 text-green-300"
            }`}
          >
            {message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8"
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
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-blue-500"
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
              onChange={setGithubUrl}
            />

            <Field
              label="Live Demo URL"
              value={liveUrl}
              type="url"
              placeholder="https://project-demo.vercel.app"
              onChange={setLiveUrl}
            />
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
            <Link
              href="/dashboard"
              className="rounded-xl border border-white/10 px-6 py-3 text-center font-semibold transition hover:bg-white/5"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-7 py-3 font-semibold transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving Project..." : "Add Project"}
            </button>
          </div>
        </form>
      </div>
    </main>
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
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-blue-500"
      />
    </div>
  );
}