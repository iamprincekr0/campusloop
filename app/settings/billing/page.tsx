import Link from "next/link";
import { ArrowLeft, Check, CreditCard, ShieldAlert } from "lucide-react";

const benefits = [
  "Advanced CampusLoop AI guidance",
  "Richer opportunity and project planning",
  "Enhanced personalized recommendations",
  "No automatic charge after the trial",
];

export default function BillingPage() {
  return (
    <main className="min-h-screen bg-[#050816] px-5 py-10 text-slate-100 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to workspace
        </Link>
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="premium-surface rounded-[30px] border border-white/10 bg-white/[0.035] p-7 sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">Account billing</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-white">Your plan, clearly.</h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400">
              Subscription status is not connected in this environment. CampusLoop will never display a successful payment or premium entitlement until a verified payment and server-side subscription record exist.
            </p>
            <div className="mt-8 rounded-2xl border border-amber-300/20 bg-amber-300/[0.06] p-5">
              <div className="flex items-start gap-3">
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
                <div>
                  <p className="font-semibold text-amber-100">Billing setup required</p>
                  <p className="mt-1 text-sm leading-6 text-amber-100/70">Trial activation, checkout, cancellation, and payment verification are intentionally unavailable until the payment provider and subscription backend are configured.</p>
                </div>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/pricing" className="inline-flex items-center gap-2 rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-white">
                View plans
              </Link>
              <button type="button" disabled className="inline-flex cursor-not-allowed items-center gap-2 rounded-2xl border border-white/10 px-5 py-3 text-sm font-bold text-slate-500" aria-disabled="true">
                <CreditCard className="h-4 w-4" /> Manage payment
              </button>
            </div>
          </section>
          <aside className="premium-surface rounded-[30px] border border-white/10 bg-white/[0.035] p-7 sm:p-8">
            <p className="text-sm font-semibold text-white">What Premium includes</p>
            <ul className="mt-6 space-y-4">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex gap-3 text-sm leading-6 text-slate-300">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-cyan-300" />
                  {benefit}
                </li>
              ))}
            </ul>
            <p className="mt-8 border-t border-white/10 pt-6 text-xs leading-5 text-slate-500">Current status: Free workspace · No active trial · No payment method on file</p>
          </aside>
        </div>
      </div>
    </main>
  );
}
