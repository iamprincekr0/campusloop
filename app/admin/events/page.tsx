"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Award,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Download,
  GraduationCap,
  LayoutDashboard,
  LoaderCircle,
  LockKeyhole,
  RefreshCw,
  Search,
  ShieldAlert,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import { supabase } from "../../../lib/supabase";

const EVENT_SLUG = "extension-board-2026";
const PAGE_SIZE = 25;

type EventRecord = {
  id: string;
  title: string;
  slug: string;
  event_date: string;
  venue: string;
  capacity: number | null;
  registration_open: boolean;
};

type AdminAccess = {
  role: "owner" | "manager" | "viewer";
};

type Registration = {
  id: string;
  registration_code: string;
  full_name: string;
  email: string;
  phone: string;
  institution: string;
  course: string;
  branch: string;
  year_of_study: string;
  roll_number: string | null;
  registration_status: "registered" | "cancelled";
  attendance_status: "pending" | "present" | "absent";
  certificate_status: "not_eligible" | "eligible" | "issued";
  created_at: string;
  updated_at: string;
};

type WorkflowField = "attendance_status" | "certificate_status";

export default function EventAdminPage() {
  const [event, setEvent] = useState<EventRecord | null>(null);
  const [access, setAccess] = useState<AdminAccess | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState("");
  const [error, setError] = useState("");
  const [authRequired, setAuthRequired] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);

  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [attendanceFilter, setAttendanceFilter] = useState("all");
  const [certificateFilter, setCertificateFilter] = useState("all");
  const [page, setPage] = useState(1);

  const loadDashboard = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);
    else setLoading(true);

    setError("");
    setAuthRequired(false);
    setUnauthorized(false);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setAuthRequired(true);
        return;
      }

      const { data: eventData, error: eventError } = await supabase
        .from("events")
        .select("id,title,slug,event_date,venue,capacity,registration_open")
        .eq("slug", EVENT_SLUG)
        .single();

      if (eventError || !eventData) {
        setError(eventError?.message || "Event record nahi mila.");
        return;
      }

      const selectedEvent = eventData as EventRecord;
      setEvent(selectedEvent);

      const { data: adminData, error: adminError } = await supabase
        .from("event_admins")
        .select("role")
        .eq("event_id", selectedEvent.id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (adminError || !adminData) {
        setUnauthorized(true);
        return;
      }

      setAccess(adminData as AdminAccess);

      const { data, error: registrationError } = await supabase
        .from("event_registrations")
        .select(
          "id,registration_code,full_name,email,phone,institution,course,branch,year_of_study,roll_number,registration_status,attendance_status,certificate_status,created_at,updated_at"
        )
        .eq("event_id", selectedEvent.id)
        .order("created_at", { ascending: false })
        .range(0, 999);

      if (registrationError) {
        setError(registrationError.message);
        return;
      }

      setRegistrations((data || []) as Registration[]);
    } catch {
      setError("Dashboard load nahi ho paya.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    setPage(1);
  }, [
    search,
    branchFilter,
    yearFilter,
    attendanceFilter,
    certificateFilter,
  ]);

  const branches = useMemo(
    () =>
      Array.from(
        new Set(registrations.map((row) => row.branch).filter(Boolean))
      ).sort((a, b) => a.localeCompare(b)),
    [registrations]
  );

  const years = useMemo(
    () =>
      Array.from(
        new Set(registrations.map((row) => row.year_of_study).filter(Boolean))
      ).sort((a, b) => a.localeCompare(b)),
    [registrations]
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return registrations.filter((row) => {
      const matchesSearch =
        !query ||
        [
          row.full_name,
          row.email,
          row.phone,
          row.registration_code,
          row.roll_number || "",
          row.course,
          row.branch,
        ].some((value) => value.toLowerCase().includes(query));

      return (
        matchesSearch &&
        (branchFilter === "all" || row.branch === branchFilter) &&
        (yearFilter === "all" || row.year_of_study === yearFilter) &&
        (attendanceFilter === "all" ||
          row.attendance_status === attendanceFilter) &&
        (certificateFilter === "all" ||
          row.certificate_status === certificateFilter)
      );
    });
  }, [
    registrations,
    search,
    branchFilter,
    yearFilter,
    attendanceFilter,
    certificateFilter,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleRows = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const todayCount = useMemo(() => {
    const today = new Date().toDateString();
    return registrations.filter(
      (row) => new Date(row.created_at).toDateString() === today
    ).length;
  }, [registrations]);

  const presentCount = useMemo(
    () =>
      registrations.filter((row) => row.attendance_status === "present").length,
    [registrations]
  );

  const eligibleCount = useMemo(
    () =>
      registrations.filter((row) =>
        ["eligible", "issued"].includes(row.certificate_status)
      ).length,
    [registrations]
  );

  async function updateWorkflow(
    id: string,
    field: WorkflowField,
    value: string
  ) {
    if (!access || access.role === "viewer") return;

    setUpdatingId(id);
    setError("");

    const { error: updateError } = await supabase
      .from("event_registrations")
      .update({ [field]: value, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (updateError) {
      setError(updateError.message);
      setUpdatingId("");
      return;
    }

    setRegistrations((current) =>
      current.map((row) =>
        row.id === id ? ({ ...row, [field]: value } as Registration) : row
      )
    );
    setUpdatingId("");
  }

  function exportCsv() {
    const headers = [
      "Registration ID",
      "Full Name",
      "Email",
      "Phone",
      "Institution",
      "Course",
      "Branch",
      "Year",
      "Roll Number",
      "Attendance",
      "Certificate",
      "Registered At",
    ];

    const safe = (value: string) =>
      `"${value.replaceAll('"', '""').replace(/^[=+\-@]/, "'$&")}"`;

    const rows = filtered.map((row) =>
      [
        row.registration_code,
        row.full_name,
        row.email,
        row.phone,
        row.institution,
        row.course,
        row.branch,
        row.year_of_study,
        row.roll_number || "",
        row.attendance_status,
        row.certificate_status,
        new Date(row.created_at).toLocaleString("en-IN"),
      ]
        .map((value) => safe(String(value)))
        .join(",")
    );

    const blob = new Blob([[headers.join(","), ...rows].join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `extension-board-registrations-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <MessageScreen
        icon={<LoaderCircle className="h-8 w-8 animate-spin text-cyan-300" />}
        title="Loading admin dashboard"
        text="Secure access verify ho raha hai."
      />
    );
  }

  if (authRequired) {
    return (
      <MessageScreen
        icon={<LockKeyhole className="h-8 w-8 text-cyan-300" />}
        title="Admin login required"
        text="Approved CampusLoop admin account se login karo."
        action={
          <Link
            href="/login"
            className="rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 px-5 py-3 font-semibold"
          >
            Open login
          </Link>
        }
      />
    );
  }

  if (unauthorized) {
    return (
      <MessageScreen
        icon={<ShieldAlert className="h-8 w-8 text-amber-300" />}
        title="Access not approved"
        text="Ye account is event ka admin/faculty account nahi hai."
        action={
          <Link
            href="/dashboard"
            className="rounded-2xl border border-white/10 bg-white/[.06] px-5 py-3 font-medium"
          >
            Back to dashboard
          </Link>
        }
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-cyan-500/15 blur-[160px]" />
        <div className="absolute right-[-180px] top-20 h-[520px] w-[520px] rounded-full bg-violet-600/15 blur-[170px]" />
      </div>

      <div className="relative mx-auto grid max-w-[1600px] lg:grid-cols-[250px_1fr]">
        <aside className="hidden min-h-screen border-r border-white/10 bg-[#070b18]/80 p-6 backdrop-blur-xl lg:block">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="text-lg font-semibold">
              Campus<span className="text-cyan-300">Loop</span>
            </span>
          </Link>

          <nav className="mt-12 space-y-2">
            <SideLink href="#overview" icon={<LayoutDashboard />} label="Overview" />
            <SideLink href="#registrations" icon={<Users />} label="Registrations" />
            <SideLink href="#registrations" icon={<ClipboardCheck />} label="Attendance" />
            <SideLink href="#registrations" icon={<Award />} label="Certificates" />
          </nav>

          <div className="mt-10 rounded-3xl border border-emerald-300/15 bg-emerald-300/[.06] p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-200">
              <CheckCircle2 className="h-4 w-4" /> Secure access
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Role: {access?.role}. Registration data is protected by RLS.
            </p>
          </div>
        </aside>

        <section className="min-w-0 px-4 py-5 sm:px-6 lg:px-10 lg:py-8">
          <header className="flex flex-col gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.2em] text-cyan-300">
                <CalendarDays className="h-4 w-4" /> Faculty event console
              </div>
              <h1 className="mt-3 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">
                {event?.title || "Event registrations"}
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                {event?.venue} · 08 August 2026
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void loadDashboard(true)}
                disabled={refreshing}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[.05] px-4 py-3 text-sm font-medium text-slate-200 hover:bg-white/[.09] disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
              <button
                type="button"
                onClick={exportCsv}
                disabled={filtered.length === 0}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 px-4 py-3 text-sm font-semibold shadow-lg shadow-blue-600/20 disabled:opacity-50"
              >
                <Download className="h-4 w-4" /> Export CSV
              </button>
            </div>
          </header>

          {error && (
            <div className="mt-6 rounded-2xl border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <section id="overview" className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Metric
              title="Total registrations"
              value={registrations.length}
              detail={
                event?.capacity
                  ? `${Math.max(event.capacity - registrations.length, 0)} seats remaining`
                  : "No capacity limit"
              }
              icon={<Users />}
            />
            <Metric
              title="Registered today"
              value={todayCount}
              detail="Real-time submissions"
              icon={<CalendarDays />}
            />
            <Metric
              title="Attendance present"
              value={presentCount}
              detail={`${registrations.length - presentCount} pending/absent`}
              icon={<ClipboardCheck />}
            />
            <Metric
              title="Certificate eligible"
              value={eligibleCount}
              detail="Eligible or issued"
              icon={<Award />}
            />
          </section>

          <section
            id="registrations"
            className="mt-7 overflow-hidden rounded-[28px] border border-white/10 bg-white/[.045] shadow-[0_24px_80px_rgba(0,0,0,.3)] backdrop-blur-xl"
          >
            <div className="border-b border-white/10 p-5 sm:p-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Student registrations</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Showing {filtered.length} of {registrations.length}
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <div className="relative min-w-[240px] flex-1">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      type="search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search name, email, ID..."
                      className="w-full rounded-2xl border border-white/10 bg-[#080d1c]/90 py-3 pl-11 pr-4 text-sm outline-none placeholder:text-slate-600 focus:border-cyan-300/40"
                    />
                  </div>
                  <Filter value={branchFilter} setValue={setBranchFilter} label="All branches" options={branches} />
                  <Filter value={yearFilter} setValue={setYearFilter} label="All years" options={years} />
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <SlidersHorizontal className="h-4 w-4 text-slate-500" />
                <Filter
                  value={attendanceFilter}
                  setValue={setAttendanceFilter}
                  label="Any attendance"
                  options={["pending", "present", "absent"]}
                />
                <Filter
                  value={certificateFilter}
                  setValue={setCertificateFilter}
                  label="Any certificate"
                  options={["not_eligible", "eligible", "issued"]}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1180px] text-left text-sm">
                <thead className="border-b border-white/10 bg-white/[.025] text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">Student</th>
                    <th className="px-4 py-4 font-medium">Registration</th>
                    <th className="px-4 py-4 font-medium">Academic</th>
                    <th className="px-4 py-4 font-medium">Contact</th>
                    <th className="px-4 py-4 font-medium">Attendance</th>
                    <th className="px-4 py-4 font-medium">Certificate</th>
                    <th className="px-6 py-4 font-medium">Created</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/[.07]">
                  {visibleRows.map((row) => (
                    <tr key={row.id} className="hover:bg-white/[.035]">
                      <td className="px-6 py-4">
                        <p className="font-medium">{row.full_name}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          Roll: {row.roll_number || "—"}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <span className="rounded-xl border border-cyan-300/15 bg-cyan-300/[.06] px-2.5 py-1.5 font-mono text-xs text-cyan-200">
                          {row.registration_code}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-slate-300">{row.branch}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {row.course} · {row.year_of_study}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-slate-300">{row.email}</p>
                        <p className="mt-1 text-xs text-slate-500">{row.phone}</p>
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={row.attendance_status}
                          onChange={(e) =>
                            void updateWorkflow(
                              row.id,
                              "attendance_status",
                              e.target.value
                            )
                          }
                          disabled={access?.role === "viewer" || updatingId === row.id}
                          className="rounded-xl border border-white/10 bg-[#080d1c] px-3 py-2 text-xs outline-none disabled:opacity-50"
                        >
                          <option value="pending">Pending</option>
                          <option value="present">Present</option>
                          <option value="absent">Absent</option>
                        </select>
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={row.certificate_status}
                          onChange={(e) =>
                            void updateWorkflow(
                              row.id,
                              "certificate_status",
                              e.target.value
                            )
                          }
                          disabled={access?.role === "viewer" || updatingId === row.id}
                          className="rounded-xl border border-white/10 bg-[#080d1c] px-3 py-2 text-xs outline-none disabled:opacity-50"
                        >
                          <option value="not_eligible">Not eligible</option>
                          <option value="eligible">Eligible</option>
                          <option value="issued">Issued</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {new Date(row.created_at).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                    </tr>
                  ))}

                  {visibleRows.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-16 text-center text-slate-500">
                        No matching registrations found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 px-5 py-4">
              <p className="text-xs text-slate-500">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                  disabled={currentPage === 1}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[.04] disabled:opacity-30"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setPage((value) => Math.min(totalPages, value + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[.04] disabled:opacity-30"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

function Metric({
  title,
  value,
  detail,
  icon,
}: {
  title: string;
  value: number;
  detail: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[.045] p-5 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{title}</p>
        <div className="grid h-10 w-10 place-items-center rounded-2xl border border-cyan-300/15 bg-cyan-300/[.06] text-cyan-300 [&>svg]:h-5 [&>svg]:w-5">
          {icon}
        </div>
      </div>
      <p className="mt-5 text-3xl font-semibold tracking-[-.04em]">{value}</p>
      <p className="mt-2 text-xs text-slate-600">{detail}</p>
    </div>
  );
}

function SideLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-400 hover:bg-white/[.06] hover:text-white"
    >
      <span className="[&>svg]:h-4 [&>svg]:w-4">{icon}</span>
      {label}
    </a>
  );
}

function Filter({
  value,
  setValue,
  label,
  options,
}: {
  value: string;
  setValue: (value: string) => void;
  label: string;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="rounded-2xl border border-white/10 bg-[#080d1c] px-4 py-3 text-sm text-slate-300 outline-none focus:border-cyan-300/40"
    >
      <option value="all">{label}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option.replaceAll("_", " ")}
        </option>
      ))}
    </select>
  );
}

function MessageScreen({
  icon,
  title,
  text,
  action,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  action?: ReactNode;
}) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] px-5 py-10 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/3 top-1/4 h-96 w-96 rounded-full bg-cyan-500/15 blur-[150px]" />
      </div>
      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-xl items-center">
        <div className="w-full rounded-[30px] border border-white/10 bg-white/[.05] p-8 text-center backdrop-blur-2xl">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl border border-white/10 bg-white/[.05]">
            {icon}
          </div>
          <h1 className="mt-6 text-2xl font-semibold">{title}</h1>
          <p className="mt-3 leading-7 text-slate-400">{text}</p>
          {action && <div className="mt-7">{action}</div>}
        </div>
      </div>
    </main>
  );
}
