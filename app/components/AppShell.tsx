"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  BookOpen,
  CalendarDays,
  ChevronRight,
  Compass,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { ReactNode, useState } from "react";
import PremiumBackground from "./PremiumBackground";

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
  { label: "My projects", href: "/projects", icon: BookOpen },
  { label: "Profile", href: "/profile", icon: UserRound },
];

export default function AppShell({
  children,
  fullName,
  email,
  initials,
  onLogout,
  loggingOut = false,
}: AppShellProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === href;
    return pathname.startsWith(href);
  }

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
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-slate-700/50 text-sm font-bold text-blue-300">
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
            
            <label className="hidden max-w-xl flex-1 items-center gap-3 rounded-2xl border border-slate-800/60 bg-slate-950/30 px-4 py-2.5 shadow-sm md:flex focus-within:border-blue-500/50 transition">
              <Search className="h-4 w-4 text-slate-500" />
              <input
                className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
                placeholder="Search projects, people, events, and resources"
                type="search"
              />
              <kbd className="rounded-md bg-slate-900 border border-slate-800 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
                ⌘ K
              </kbd>
            </label>

            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                aria-label="Search"
                className="grid h-10 w-10 place-items-center rounded-xl border border-slate-800/60 bg-slate-950/30 text-slate-400 shadow-sm md:hidden hover:bg-white/5"
              >
                <Search className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Notifications"
                className="relative grid h-10 w-10 place-items-center rounded-xl border border-slate-800/60 bg-slate-950/30 text-slate-400 shadow-sm transition hover:text-blue-400 hover:bg-white/5"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-slate-950" />
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
    </main>
  );
}
