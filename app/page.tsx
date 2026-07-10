import Link from "next/link";
import {
  Activity,
  Bell,
  Bot,
  Calendar,
  CheckCircle2,
  MessageSquare,
  Shield,
  Sparkles,
  Wrench,
  Zap,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { calculatePricing } from "@/lib/mock-data";

const features = [
  {
    icon: MessageSquare,
    title: "Tenant Directory",
    description:
      "Every unit, lease date, rent amount, and contact in one place — no more spreadsheet chaos.",
  },
  {
    icon: Bell,
    title: "Automated Rent Reminders",
    description:
      "SMS and email on day -3, day 0, and day +3 of due date. Set it and forget it.",
  },
  {
    icon: Wrench,
    title: "Maintenance Intake",
    description:
      "Tenants submit requests via a shareable link. AI drafts your acknowledgment and timeline.",
  },
  {
    icon: Calendar,
    title: "Lease Renewal Alerts",
    description:
      "90/60/30-day expiry alerts with AI-drafted renewal offer letters ready for your review.",
  },
  {
    icon: Bot,
    title: "AI Message Drafting",
    description:
      "Every outbound message drafted by AI. You review and approve — never write from scratch.",
  },
  {
    icon: Sparkles,
    title: "Monthly Summary",
    description:
      "Who paid, who's late, open tickets — one dashboard view at month end.",
  },
];

const pricingTiers = [
  { units: 3, label: "3 units" },
  { units: 8, label: "8 units" },
  { units: 15, label: "15 units" },
  { units: 25, label: "25 units" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header active="home" />

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-24 pt-16 md:pt-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand/20 via-surface to-surface" />
        <div className="relative mx-auto max-w-6xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm text-accent">
            <Zap className="h-4 w-4" />
            Built for landlords with 2–15 units
          </div>
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl">
            Your AI agent for{" "}
            <span className="bg-gradient-to-r from-accent to-brand-light bg-clip-text text-transparent">
              tenant communications
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
            TenantPulse handles rent reminders, maintenance updates, and lease renewals —
            so self-managing landlords stop drowning in texts and emails. AI drafts every
            message. You just review and approve.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/demo" className="btn-primary px-8 py-3 text-base">
              Explore Live Demo
            </Link>
            <Link href="/research" className="btn-secondary px-8 py-3 text-base">
              How we found this idea
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap gap-8 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              No property manager needed
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              From $15/mo for 3 units
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              AI drafts, you approve
            </span>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="border-t border-white/10 bg-surface-raised/30 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="section-heading text-center">Everything a small landlord needs</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-slate-400">
            Enterprise tools like Buildium cost $250+/mo. TurboTenant is free but has no AI
            automation. TenantPulse fills the gap.
          </p>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="glass-card group p-6 transition hover:border-accent/30 hover:bg-surface-overlay/50"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-brand/20 text-brand-light transition group-hover:bg-accent/20 group-hover:text-accent">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="section-heading text-center">Simple per-unit pricing</h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-slate-400">
            $5/unit/month · $15 minimum · capped at $79/mo for 20+ units
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pricingTiers.map((tier) => {
              const { total } = calculatePricing(tier.units);
              return (
                <div
                  key={tier.units}
                  className={`glass-card p-6 text-center ${
                    tier.units === 8 ? "border-accent/40 ring-1 ring-accent/20" : ""
                  }`}
                >
                  {tier.units === 8 && (
                    <span className="mb-2 inline-block rounded-full bg-accent/20 px-3 py-0.5 text-xs font-medium text-accent">
                      Most common
                    </span>
                  )}
                  <p className="text-sm text-slate-400">{tier.label}</p>
                  <p className="mt-2 font-display text-3xl font-bold text-white">
                    ${total}
                    <span className="text-base font-normal text-slate-500">/mo</span>
                  </p>
                </div>
              );
            })}
          </div>
          <p className="mt-8 text-center text-sm text-slate-500">
            Compare: Buildium starts at $58/mo + $2/unit. AppFolio requires 50+ units.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-accent">
              <Activity className="h-7 w-7 text-white" />
            </div>
          </div>
          <h2 className="section-heading">See it in action</h2>
          <p className="mt-4 text-slate-400">
            Explore a fully interactive demo with realistic tenant data, automated reminders,
            maintenance workflows, and AI-drafted messages.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/demo" className="btn-primary px-8 py-3 text-base">
              Open Interactive Demo
            </Link>
            <Link href="/developers" className="btn-secondary px-8 py-3 text-base">
              Developer Docs
            </Link>
          </div>
          <p className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
            <Shield className="h-3 w-3" />
            Mock demo only — no real SMS, email, or payments
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
