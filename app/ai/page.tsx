"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import AppShell from "../components/AppShell";
import AIGuide from "../components/AIGuide";

type User = { id: string; fullName: string; email: string };

export default function AIPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

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

  if (loading || !user) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7f8fc]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
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
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600">
            Campus Intelligence
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.05em] text-slate-950 sm:text-4xl">
            CampusLoop AI Guide
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
            Your personalized guide for study, project help, career pathing, opportunities, and next steps.
          </p>
        </div>

        <div className="w-full relative">
          <AIGuide userFullName={user.fullName} />
        </div>
      </section>
    </AppShell>
  );
}