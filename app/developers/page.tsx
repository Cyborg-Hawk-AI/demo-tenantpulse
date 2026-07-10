import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Bell,
  Bot,
  Calendar,
  Code2,
  Database,
  FileText,
  Mail,
  MessageSquare,
  Server,
  Users,
  Wrench,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Developer Documentation — TenantPulse",
  description:
    "Feature-by-feature guide to the TenantPulse interactive demo: what's mocked, what's real in production, and integration notes.",
};

const features = [
  {
    id: "directory",
    icon: Users,
    title: "Tenant Directory",
    location: "Demo → Tenant Directory tab",
    tryIt: [
      "Use the search box to filter by name, unit, or property",
      "Change status or property dropdown filters",
      "Click 'View' on any row to open the tenant detail modal",
      "Click 'Send Reminder' or 'Mark Paid' in the modal",
      "Click 'Export CSV' to trigger a mock download toast",
    ],
    mocked:
      "8 hardcoded tenants with lease dates, rent amounts, contact info, and payment statuses. All filtering is client-side React state.",
    production:
      "Supabase `tenants` table with RLS per landlord. Synced from lease upload or manual entry. Real-time updates via Supabase subscriptions. CSV export via edge function.",
    dataFlow:
      "Landlord CRUD → Supabase → Dashboard renders via server component + client hydration. Tenant portal links generated as `/r/{slug}` per landlord.",
  },
  {
    id: "reminders",
    icon: Bell,
    title: "Automated Rent Reminder Sequence",
    location: "Demo → Rent Reminders tab",
    tryIt: [
      "Toggle 'Auto-send enabled' switch to pause/resume",
      "Click any reminder card in Day -3, Day 0, or Day +3 columns",
      "In the preview modal, click 'Send Now' for scheduled reminders",
    ],
    mocked:
      "6 reminder events with SMS/email previews and sent/scheduled statuses. Toggle and send actions show toasts only.",
    production:
      "Daily cron (Vercel Cron or self-hosted) queries tenants where `rent_due_day` matches offset. Twilio sends SMS, SendGrid sends email. AI (self-hosted Mistral) personalizes message from tenant context.",
    dataFlow:
      "Cron → query due dates → AI draft → queue to Twilio/SendGrid → log to `reminder_events` table → push to activity feed.",
  },
  {
    id: "maintenance",
    icon: Wrench,
    title: "Maintenance Request Intake & AI Reply",
    location: "Demo → Maintenance tab + Tenant Intake Link tab",
    tryIt: [
      "Click 'Review AI Draft' on any open ticket",
      "Edit the AI draft text, then 'Approve & Send'",
      "Use status filter buttons (all, open, in_progress, etc.)",
      "Go to Tenant Intake Link tab → complete the 3-step wizard",
      "After submit, click 'Preview AI Draft Reply'",
      "Copy the tenant intake URL",
    ],
    mocked:
      "4 maintenance tickets with pre-written AI drafts. Intake wizard creates toasts and shows a preview modal. Ticket status updates locally on approve.",
    production:
      "Public form at `/r/{landlord-slug}` → Supabase edge function stores submission → triggers AI agent → drafts reply with vendor calendar lookup → landlord approves → SendGrid/Twilio delivers to tenant.",
    dataFlow:
      "Tenant form POST → `maintenance_tickets` table → webhook → AI agent (Mistral) → `ai_drafts` table → landlord notification → approve → outbound message.",
  },
  {
    id: "renewals",
    icon: Calendar,
    title: "Lease Renewal Alerts (90/60/30 days)",
    location: "Demo → Lease Renewals tab",
    tryIt: [
      "Review the 90/60/30-day alert summary cards",
      "Click 'Review Offer Letter' on any renewal",
      "Edit the AI-drafted letter and click 'Send Offer'",
    ],
    mocked:
      "3 lease renewals at different alert stages with AI-drafted offer letters. Send updates local status to 'sent'.",
    production:
      "Daily cron checks `lease_end` dates. At 90/60/30 days, AI drafts renewal letter with market-rate analysis (Rentometer API or manual comp data). DocuSign envelope sent on landlord approval.",
    dataFlow:
      "Cron → lease expiry check → AI draft with rent increase calc → landlord review → DocuSign API → tenant signs → update lease record.",
  },
  {
    id: "summary",
    icon: FileText,
    title: "Monthly Landlord Summary",
    location: "Demo → Monthly Summary tab",
    tryIt: [
      "Review collection stats and payment status per tenant",
      "Click any open maintenance ticket to jump to Maintenance tab",
      "Click 'Download PDF' or 'Email Summary'",
    ],
    mocked:
      "July 2026 summary with collection rate, per-tenant payment status, and open tickets. PDF/email buttons show toasts.",
    production:
      "Cron runs 1st of month: aggregates payments, late accounts, open tickets from Supabase. Generates PDF via Puppeteer edge function. Emails via SendGrid with in-app dashboard mirror.",
    dataFlow:
      "Monthly cron → aggregate queries → PDF generation → email to landlord → archive in `monthly_summaries` table.",
  },
  {
    id: "overview",
    icon: Activity,
    title: "Dashboard Overview & Activity Feed",
    location: "Demo → Overview tab",
    tryIt: [
      "Click 'Refresh' to simulate data reload",
      "Use the activity feed dropdown to filter event types",
      "Click any activity item for details toast",
      "View the 6-month rent collection chart",
    ],
    mocked:
      "4 stat cards, bar chart from hardcoded data, 8-item activity feed. All interactions are toasts or visual only.",
    production:
      "Real-time dashboard via Supabase subscriptions. Chart from aggregated payments query. Activity feed from event log table written by all agents.",
    dataFlow:
      "All system events → `activity_log` table → WebSocket push → dashboard components re-render.",
  },
];

const stack = [
  { icon: Server, label: "Next.js 14 App Router", note: "Current demo — zero config Vercel deploy" },
  { icon: Database, label: "Supabase", note: "Postgres + RLS + real-time (production)" },
  { icon: MessageSquare, label: "Twilio", note: "SMS rent reminders (production)" },
  { icon: Mail, label: "SendGrid", note: "Email reminders & summaries (production)" },
  { icon: Bot, label: "Self-hosted Mistral", note: "AI message drafting (production)" },
  { icon: Code2, label: "Vercel Cron", note: "Daily agent triggers (production)" },
];

export default function DevelopersPage() {
  return (
    <div className="min-h-screen">
      <Header active="developers" />

      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-sm text-brand-light">
            <Code2 className="h-4 w-4" />
            Developer Documentation
          </div>
          <h1 className="font-display text-4xl font-bold text-white">
            TenantPulse Feature Guide
          </h1>
          <p className="mt-4 text-lg text-slate-400">
            Every feature in the{" "}
            <Link href="/demo" className="text-accent hover:underline">
              interactive demo
            </Link>
            , what&apos;s mocked vs. production-ready, and how to try each one.
          </p>
        </div>

        {/* Stack overview */}
        <section className="mb-16">
          <h2 className="mb-6 font-display text-2xl font-bold text-white">
            Intended Production Stack
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {stack.map((item) => (
              <div key={item.label} className="glass-card flex items-start gap-3 p-4">
                <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <div>
                  <p className="font-medium text-white">{item.label}</p>
                  <p className="text-sm text-slate-400">{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Feature docs */}
        <section className="space-y-8">
          <h2 className="font-display text-2xl font-bold text-white">Feature Breakdown</h2>
          {features.map((feature) => (
            <article
              key={feature.id}
              id={feature.id}
              className="glass-card overflow-hidden"
            >
              <div className="border-b border-white/10 bg-surface-overlay/30 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/20">
                    <feature.icon className="h-5 w-5 text-brand-light" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-accent">{feature.location}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-6 p-6">
                <div>
                  <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                    How to try it
                  </h4>
                  <ul className="space-y-1">
                    {feature.tryIt.map((step) => (
                      <li key={step} className="flex items-start gap-2 text-sm text-slate-300">
                        <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
                    <h4 className="mb-2 text-sm font-semibold text-amber-400">
                      Mocked in demo
                    </h4>
                    <p className="text-sm leading-relaxed text-slate-400">{feature.mocked}</p>
                  </div>
                  <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
                    <h4 className="mb-2 text-sm font-semibold text-emerald-400">
                      Production implementation
                    </h4>
                    <p className="text-sm leading-relaxed text-slate-400">
                      {feature.production}
                    </p>
                  </div>
                </div>
                <div className="rounded-lg bg-surface p-4">
                  <h4 className="mb-2 text-sm font-semibold text-slate-500">Data flow</h4>
                  <p className="font-mono text-sm text-slate-300">{feature.dataFlow}</p>
                </div>
              </div>
            </article>
          ))}
        </section>

        <div className="mt-12 text-center">
          <Link href="/demo" className="btn-primary px-8 py-3">
            Open Interactive Demo
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
