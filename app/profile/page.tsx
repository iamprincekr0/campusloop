"use client";

import Link from "next/link";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import AppShell from "../components/AppShell";

type ProfileForm = {
  full_name: string;
  email: string;
  college: string;
  course: string;
  branch: string;
  year: string;
  location: string;
  bio: string;
  skills: string;
  github_url: string;
  linkedin_url: string;
  portfolio_url: string;
  avatar_url: string;
  resume_url: string;
};

const emptyProfile: ProfileForm = {
  full_name: "",
  email: "",
  college: "",
  course: "",
  branch: "",
  year: "",
  location: "",
  bio: "",
  skills: "",
  github_url: "",
  linkedin_url: "",
  portfolio_url: "",
  avatar_url: "",
  resume_url: "",
};

export default function ProfilePage() {
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [form, setForm] = useState<ProfileForm>(emptyProfile);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.replace("/login");
        return;
      }

      setUserId(user.id);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        setIsError(true);
        setMessage(error.message);
        setLoading(false);
        return;
      }

      setForm({
        full_name:
          data.full_name ||
          user.user_metadata?.full_name ||
          "",
        email: data.email || user.email || "",
        college: data.college || "",
        course: data.course || "",
        branch: data.branch || "",
        year: data.year || "",
        location: data.location || "",
        bio: data.bio || "",
        skills: Array.isArray(data.skills)
          ? data.skills.join(", ")
          : "",
        github_url: data.github_url || "",
        linkedin_url: data.linkedin_url || "",
        portfolio_url: data.portfolio_url || "",
        avatar_url: data.avatar_url || "",
        resume_url: data.resume_url || "",
      });

      setLoading(false);
    }

    loadProfile();
  }, [router]);

  const initials = useMemo(
    () =>
      form.full_name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0]?.toUpperCase())
        .join("") || "S",
    [form.full_name]
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

  function updateField(
    field: keyof ProfileForm,
    value: string
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function showError(text: string) {
    setIsError(true);
    setMessage(text);
  }

  function showSuccess(text: string) {
    setIsError(false);
    setMessage(text);
  }

  async function uploadAvatar(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file || !userId) return;

    if (!file.type.startsWith("image/")) {
      showError("Please upload an image file only.");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      showError("Profile image must be under 3 MB.");
      return;
    }

    setUploadingAvatar(true);
    setMessage("");

    const extension =
      file.name.split(".").pop()?.toLowerCase() || "jpg";

    const filePath = `${userId}/avatar.${extension}`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        upsert: true,
        cacheControl: "3600",
        contentType: file.type,
      });

    if (error) {
      setUploadingAvatar(false);
      showError(error.message);
      return;
    }

    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    const avatarUrl = `${data.publicUrl}?v=${Date.now()}`;

    setForm((previous) => ({
      ...previous,
      avatar_url: avatarUrl,
    }));

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    setUploadingAvatar(false);

    if (updateError) {
      showError(updateError.message);
      return;
    }

    showSuccess("Profile photo uploaded successfully.");
  }

  async function uploadResume(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file || !userId) return;

    if (file.type !== "application/pdf") {
      showError("Resume must be in PDF format.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showError("Resume must be under 5 MB.");
      return;
    }

    setUploadingResume(true);
    setMessage("");

    const filePath = `${userId}/resume.pdf`;

    const { error } = await supabase.storage
      .from("resumes")
      .upload(filePath, file, {
        upsert: true,
        cacheControl: "3600",
        contentType: "application/pdf",
      });

    if (error) {
      setUploadingResume(false);
      showError(error.message);
      return;
    }

    const { data } = supabase.storage
      .from("resumes")
      .getPublicUrl(filePath);

    const resumeUrl = `${data.publicUrl}?v=${Date.now()}`;

    setForm((previous) => ({
      ...previous,
      resume_url: resumeUrl,
    }));

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        resume_url: resumeUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    setUploadingResume(false);

    if (updateError) {
      showError(updateError.message);
      return;
    }

    showSuccess("Resume uploaded successfully.");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!userId) return;

    setSaving(true);
    setMessage("");

    const skillsArray = form.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: form.full_name.trim(),
        college: form.college.trim(),
        course: form.course.trim(),
        branch: form.branch.trim(),
        year: form.year,
        location: form.location.trim(),
        bio: form.bio.trim(),
        skills: skillsArray,
        github_url: form.github_url.trim(),
        linkedin_url: form.linkedin_url.trim(),
        portfolio_url: form.portfolio_url.trim(),
        avatar_url: form.avatar_url,
        resume_url: form.resume_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    setSaving(false);

    if (error) {
      showError(error.message);
      return;
    }

    showSuccess("Profile successfully saved.");
  }

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#050816]">
        <div className="text-center">
          <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-blue-500/20 border-t-blue-500" />
          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading profile...
          </p>
        </div>
      </main>
    );
  }

  return (
    <AppShell
      fullName={form.full_name}
      email={form.email}
      initials={initials}
      onLogout={handleLogout}
      loggingOut={loggingOut}
    >
      <section className="mx-auto max-w-[1540px] px-4 py-6 pb-28 sm:px-7 sm:py-8 lg:px-10 lg:pb-10">
        <div className="mb-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-400">
            Account settings
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-[-0.05em] text-white sm:text-4xl">
            Build Your Profile
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
            Complete your details to receive better student,
            project and internship matches.
          </p>
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
          className="grid gap-6 lg:grid-cols-[340px_1fr]"
        >
          <aside className="h-fit rounded-3xl border border-slate-900/60 bg-slate-950/40 p-6 shadow-2xl backdrop-blur-xl">
            <div className="text-center">
              <div className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-slate-800/60 bg-gradient-to-br from-blue-500 to-purple-600 text-white text-4xl font-bold">
                {form.avatar_url ? (
                  <img
                    src={form.avatar_url}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  form.full_name.charAt(0).toUpperCase() ||
                  "S"
                )}
              </div>

              <h2 className="mt-5 text-xl font-bold text-white">
                {form.full_name || "Student"}
              </h2>

              <p className="mt-1 break-all text-sm text-slate-500">
                {form.email}
              </p>
            </div>

            <label className="mt-6 block cursor-pointer rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:scale-[1.02] shadow-md shadow-blue-600/10">
              {uploadingAvatar
                ? "Uploading Photo..."
                : "Upload Profile Photo"}

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={uploadAvatar}
                disabled={uploadingAvatar}
                className="hidden"
              />
            </label>

            <p className="mt-2 text-center text-xs text-slate-500">
              JPG, PNG or WEBP · Maximum 3 MB
            </p>

            <div className="mt-7 border-t border-slate-900/60 pt-6">
              <label className="block cursor-pointer rounded-xl border border-slate-800/65 bg-slate-900/40 px-4 py-3 text-center text-sm font-semibold text-slate-300 transition hover:bg-slate-900/60">
                {uploadingResume
                  ? "Uploading..."
                  : form.resume_url
                    ? "Replace Resume"
                    : "Upload Resume PDF"}

                <input
                  type="file"
                  accept="application/pdf"
                  onChange={uploadResume}
                  disabled={uploadingResume}
                  className="hidden"
                />
              </label>

              {form.resume_url && (
                <a
                  href={form.resume_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 block text-center text-sm font-semibold text-blue-400 hover:text-blue-300 transition"
                >
                  View uploaded resume
                </a>
              )}

              <p className="mt-2 text-center text-xs text-slate-500">
                PDF only · Maximum 5 MB
              </p>
            </div>
          </aside>

          <section className="rounded-3xl border border-slate-900/60 bg-slate-950/40 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
            <div className="grid gap-5 md:grid-cols-2">
              <InputField
                label="Full Name"
                value={form.full_name}
                placeholder="Prince Kumar"
                required
                onChange={(value) =>
                  updateField("full_name", value)
                }
              />

              <InputField
                label="Email"
                value={form.email}
                placeholder="student@example.com"
                disabled
                onChange={() => {}}
              />

              <InputField
                label="College / University"
                value={form.college}
                placeholder="Sandip University"
                onChange={(value) =>
                  updateField("college", value)
                }
              />

              <InputField
                label="Course"
                value={form.course}
                placeholder="Bachelor of Technology"
                onChange={(value) =>
                  updateField("course", value)
                }
              />

              <InputField
                label="Branch"
                value={form.branch}
                placeholder="Electrical Engineering"
                onChange={(value) =>
                  updateField("branch", value)
                }
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Current Year
                </label>

                <select
                  value={form.year}
                  onChange={(event) =>
                    updateField("year", event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-900 bg-slate-950 px-4 py-3 text-slate-200 outline-none focus:border-blue-500/50 text-sm focus:bg-slate-900"
                >
                  <option value="">Select year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Graduate">Graduate</option>
                </select>
              </div>

              <InputField
                label="Location"
                value={form.location}
                placeholder="Nashik, Maharashtra"
                onChange={(value) =>
                  updateField("location", value)
                }
              />

              <InputField
                label="Skills"
                value={form.skills}
                placeholder="MATLAB, BMS, ESP32, Next.js"
                onChange={(value) =>
                  updateField("skills", value)
                }
              />
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                About / Bio
              </label>

              <textarea
                value={form.bio}
                onChange={(event) =>
                  updateField("bio", event.target.value)
                }
                rows={5}
                maxLength={500}
                placeholder="Tell students and recruiters about your interests, projects and goals..."
                className="w-full resize-none rounded-xl border border-slate-900/60 bg-slate-900/20 px-4 py-3 text-slate-200 outline-none placeholder:text-slate-500 focus:border-blue-500/50 focus:bg-slate-950/20 text-sm transition"
              />

              <p className="mt-1 text-right text-xs text-slate-500">
                {form.bio.length}/500
              </p>
            </div>

            <div className="mt-8 border-t border-slate-900/60 pt-7">
              <h3 className="text-lg font-bold text-white">
                Professional Links
              </h3>

              <div className="mt-5 grid gap-5">
                <InputField
                  label="GitHub URL"
                  value={form.github_url}
                  placeholder="https://github.com/username"
                  type="url"
                  onChange={(value) =>
                    updateField("github_url", value)
                  }
                />

                <InputField
                  label="LinkedIn URL"
                  value={form.linkedin_url}
                  placeholder="https://linkedin.com/in/username"
                  type="url"
                  onChange={(value) =>
                    updateField("linkedin_url", value)
                  }
                />

                <InputField
                  label="Portfolio URL"
                  value={form.portfolio_url}
                  placeholder="https://yourportfolio.com"
                  type="url"
                  onChange={(value) =>
                    updateField("portfolio_url", value)
                  }
                />
              </div>
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
                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-3 font-semibold text-white transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 shadow-md shadow-blue-600/15"
              >
                {saving ? "Saving Profile..." : "Save Profile"}
              </button>
            </div>
          </section>
        </form>
      </section>
    </AppShell>
  );
}

function InputField({
  label,
  value,
  placeholder,
  onChange,
  type = "text",
  disabled = false,
  required = false,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  type?: string;
  disabled?: boolean;
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
        disabled={disabled}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-900/60 bg-slate-900/20 px-4 py-3 text-slate-200 outline-none placeholder:text-slate-500 focus:border-blue-500/50 focus:bg-slate-950/20 disabled:cursor-not-allowed disabled:opacity-60 text-sm transition"
      />
    </div>
  );
}