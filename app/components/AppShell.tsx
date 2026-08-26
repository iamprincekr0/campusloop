"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  BookOpen,
  Briefcase,
  CalendarDays,
  ChevronRight,
  Compass,
  FileCode,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { ReactNode, useEffect, useState, useMemo, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PremiumBackground from "./PremiumBackground";
import { supabase } from "../../lib/supabase";
import { OPPORTUNITIES } from "../lib/campus-intelligence";

type AppShellProps = {
  children: ReactNode;
  fullName: string;
  email: string;
  initials: string;
  onLogout: () => void;
  loggingOut?: boolean;
};

const primaryNavigation = [
  { label: "Home", href: "/dashboard", icon: LayoutDashboard },
  { label: "Explore", href: "/events/extension-board-2026", icon: Compass },
  { label: "Opportunities", href: "/opportunities", icon: Briefcase },
  { label: "My projects", href: "/projects", icon: BookOpen },
  { label: "Profile", href: "/profile", icon: UserRound },
];

type SearchResultItem = {
  id: string;
  type: "Event" | "Project" | "Opportunity";
  title: string;
  description: string;
  href: string;
};

export default function AppShell({
  children,
  fullName,
  email,
  initials,
  onLogout,
  loggingOut = false,
}: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  /* ── Search State ── */
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dbEvents, setDbEvents] = useState<{ slug: string; title: string }[]>([]);
  const [dbProjects, setDbProjects] = useState<{ id: string; title: string; description: string | null }[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === href;
    return pathname.startsWith(href);
  }

  // Load search index data
  useEffect(() => {
    let active = true;
    async function loadIndexData() {
      // 1. Fetch events
      const { data: eventsData } = await supabase
        .from("events")
        .select("slug, title")
        .eq("is_published", true);

      if (active && eventsData) setDbEvents(eventsData);

      // 2. Fetch user's own projects
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: projectsData } = await supabase
          .from("projects")
          .select("id, title, description")
          .eq("user_id", user.id);

        if (active && projectsData) setDbProjects(projectsData);
      }
    }
    void loadIndexData();
    return () => {
      active = false;
    };
  }, []);

  // Hotkey listener for Ctrl/Cmd + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape" && searchOpen) {
        e.preventDefault();
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen]);

  // Focus search input when modal opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery("");
    }
  }, [searchOpen]);

  // Client-side search filters
  const searchResults = useMemo<SearchResultItem[]>(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();

    const results: SearchResultItem[] = [];

    // Search Opportunities
    OPPORTUNITIES.forEach((opp) => {
      if (
        opp.title.toLowerCase().includes(query) ||
        opp.description.toLowerCase().includes(query) ||
        opp.category.toLowerCase().includes(query)
      ) {
        results.push({
          id: opp.id,
          type: "Opportunity",
          title: opp.title,
          description: `${opp.category} · Apply by ${opp.deadline}`,
          href: `/opportunities#${opp.id}`,
        });
      }
    });

    // Search Events
    dbEvents.forEach((evt) => {
      if (evt.title.toLowerCase().includes(query)) {
        results.push({
          id: evt.slug,
          type: "Event",
          title: evt.title,
          description: "Campus workshop / activity details",
          href: `/events/${evt.slug}`,
        });
      }
    });

    // Search Projects
    dbProjects.forEach((proj) => {
      if (
        proj.title.toLowerCase().includes(query) ||
        (proj.description && proj.description.toLowerCase().includes(query))
      ) {
        results.push({
          id: proj.id,
          type: "Project",
          title: proj.title,
          description: proj.description || "Student engineering portfolio project",
          href: "/projects",
        });
      }
    });

    return results;
  }, [searchQuery, dbEvents, dbProjects]);

  return (
    <main className="min-h-screen text-slate-100 relative">
      {/* Cinematic animated background */}
      <PremiumBackground />

      {/* Drawer backdrop */}
      {menuOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[284px] flex-col border-r border-slate-800/40 bg-slate-950/40 backdrop-blur-xl px-5 py-6 transition-transform duration-300 ease-out lg:translate-x-0 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-3"
            onClick={() => setMenuOpen(false)}
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-lg font-bold tracking-[-0.04em] text-white">
                Campus<span className="text-blue-400">Loop</span>
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Student workspace
              </span>
            </span>
          </Link>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMenuOpen(false)}
            className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 hover:bg-white/5 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-10 space-y-1.5" aria-label="Primary navigation">
          {primaryNavigation.map(({ label, href, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                  active
                    ? "bg-blue-600/10 text-blue-400 shadow-[inset_0_0_12px_rgba(59,130,246,0.15)] border-l-2 border-blue-500"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon
                  className={`h-[18px] w-[18px] ${
                    active
                      ? "text-blue-400"
                      : "text-slate-500 group-hover:text-slate-300"
                  }`}
                />
                {label}
                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Promo card */}
        <div className="mt-8 rounded-3xl bg-slate-900/50 border border-slate-800/40 p-5 text-white shadow-xl">
          <span className="inline-flex rounded-xl bg-white/5 p-2 text-blue-300">
            <CalendarDays className="h-4 w-4" />
          </span>
          <p className="mt-4 text-sm font-semibold">Build your campus week</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            Save events, share projects, and keep every opportunity in one place.
          </p>
          <Link
            href="/events/extension-board-2026"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-blue-300 hover:text-white transition"
          >
            Explore events <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* User profile section */}
        <div className="mt-auto border-t border-slate-900/60 pt-5">
          <Link
            href="/profile"
            className="flex items-center gap-3 rounded-2xl p-2 transition hover:bg-white/5"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-slate-700/50 text-sm font-bold text-blue-300">
              {initials}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-slate-200">
                {fullName}
              </span>
              <span className="block truncate text-xs text-slate-500">
                {email}
              </span>
            </span>
          </Link>
          <button
            type="button"
            onClick={onLogout}
            disabled={loggingOut}
            className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-400 transition hover:bg-rose-950/30 hover:text-rose-400 disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" />
            {loggingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </aside>

      {/* Main workspace layout */}
      <div className="lg:pl-[284px] min-h-screen flex flex-col">
        <header className="sticky top-0 z-30 border-b border-slate-900/40 bg-[#050816]/75 backdrop-blur-xl">
          <div className="flex h-[76px] items-center gap-3 px-4 sm:px-7 lg:px-10">
            <button
              type="button"
              aria-label="Open navigation"
              onClick={() => setMenuOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-slate-800/60 bg-slate-950/40 text-slate-300 shadow-sm lg:hidden hover:bg-white/5 transition"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden max-w-xl flex-1 items-center gap-3 rounded-2xl border border-slate-800/60 bg-slate-950/30 px-4 py-2.5 shadow-sm md:flex hover:border-slate-700/50 transition text-left cursor-pointer"
            >
              <Search className="h-4 w-4 text-slate-500" />
              <span className="text-sm text-slate-500 flex-1">Search campus...</span>
              <kbd className="rounded-md bg-slate-900 border border-slate-800 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
                Ctrl K
              </kbd>
            </button>

            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className="grid h-10 w-10 place-items-center rounded-xl border border-slate-800/60 bg-slate-950/30 text-slate-400 shadow-sm md:hidden hover:bg-white/5 cursor-pointer"
              >
                <Search className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Notifications"
                className="relative grid h-10 w-10 place-items-center rounded-xl border border-slate-800/60 bg-slate-950/30 text-slate-400 shadow-sm transition hover:text-blue-400 hover:bg-white/5"
              >
                <Bell className="h-4 w-4" />
              </button>
              <Link
                href="/profile"
                className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-slate-700/50 text-sm font-bold text-blue-300 sm:hidden"
              >
                {initials}
              </Link>
            </div>
          </div>
        </header>

        <div className="flex-1 relative z-10">{children}</div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav
        className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-around rounded-2xl border border-slate-800/50 bg-slate-950/80 px-2 py-2 shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl lg:hidden"
        aria-label="Mobile navigation"
      >
        {primaryNavigation.map(({ label, href, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex min-w-[60px] flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[10px] font-bold transition-all ${
                active ? "text-blue-400" : "text-slate-500"
              }`}
            >
              <Icon className={`h-[19px] w-[19px] ${active ? "stroke-[2.7] text-blue-400" : "text-slate-500"}`} />
              {label === "My projects" ? "Projects" : label}
            </Link>
          );
        })}
      </nav>

      {/* Global Search Modal Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
            {/* Backdrop */}
            <motion.button
              type="button"
              aria-label="Close search"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-md cursor-default outline-none"
            />

            {/* Search Box Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -10 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-2xl backdrop-blur-xl z-10 flex flex-col max-h-[70vh]"
            >
              {/* Header Input */}
              <div className="flex items-center gap-3 border-b border-slate-900 pb-4 mb-4">
                <Search className="h-5 w-5 text-slate-500 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type to search events, projects, and opportunities..."
                  className="w-full bg-transparent text-slate-200 outline-none text-base placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="grid h-8 w-8 place-items-center rounded-xl hover:bg-white/5 text-slate-500 hover:text-slate-350 transition shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Search Results Display */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
                {searchQuery.trim() === "" ? (
                  <div className="py-8 text-center text-slate-500">
                    <p className="text-sm font-semibold">Search CampusLoop workspace</p>
                    <p className="text-xs mt-1">Start typing to filter matching opportunities, workshops, and projects.</p>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="py-8 text-center text-slate-500">
                    <p className="text-sm font-semibold">No results match your query</p>
                    <p className="text-xs mt-1">Try a different search term or check spelling.</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {(["Event", "Project", "Opportunity"] as const).map((group) => {
                      const groupResults = searchResults.filter((r) => r.type === group);
                      if (groupResults.length === 0) return null;
                      return (
                        <div key={group}>
                          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 mb-2 px-1">
                            {group}s
                          </p>
                          <div className="space-y-2">
                            {groupResults.map((result) => (
                              <button
                                key={`${result.type}-${result.id}`}
                                onClick={() => {
                                  setSearchOpen(false);
                                  router.push(result.href);
                                }}
                                className="w-full text-left flex items-start gap-3 rounded-2xl bg-slate-900/20 hover:bg-slate-900/60 border border-slate-900 hover:border-slate-800/80 p-3.5 transition duration-200"
                              >
                                <span className={`grid h-9 w-9 place-items-center rounded-xl shrink-0 ${
                                  result.type === "Opportunity"
                                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                    : result.type === "Event"
                                      ? "bg-violet-500/10 text-violet-400 border border-violet-500/20"
                                      : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                }`}>
                                  {result.type === "Opportunity" ? (
                                    <Briefcase className="h-4 w-4" />
                                  ) : result.type === "Event" ? (
                                    <CalendarDays className="h-4 w-4" />
                                  ) : (
                                    <FileCode className="h-4 w-4" />
                                  )}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-bold text-slate-200 leading-snug">
                                    {result.title}
                                  </p>
                                  <p className="text-xs text-slate-500 mt-1 leading-normal">
                                    {result.description}
                                  </p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
