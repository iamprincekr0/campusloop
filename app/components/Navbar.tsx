import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-bold text-white">
          CampusLoop
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-slate-300 transition hover:text-white"
          >
            Home
          </Link>

          <Link
            href="/events/extension-board-2026"
            className="text-slate-300 transition hover:text-white"
          >
            Events
          </Link>

          <Link
            href="/projects/new"
            className="text-slate-300 transition hover:text-white"
          >
            Projects
          </Link>

          <Link
            href="/dashboard"
            className="text-slate-300 transition hover:text-white"
          >
            Dashboard
          </Link>

          <Link
            href="/profile"
            className="text-slate-300 transition hover:text-white"
          >
            Profile
          </Link>
        </div>

        <Link
          href="/login"
          className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Login
        </Link>
      </div>
    </nav>
  );
}