"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  Bell,
  Calendar,
  Check,
  Copy,
  ExternalLink,
  FileText,
  Mail,
  MessageSquare,
  Phone,
  Search,
  Send,
  Users,
  Wrench,
  BarChart3,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { DevNote } from "@/components/DevNote";
import { Modal } from "@/components/Modal";
import { ToastContainer, ToastMessage } from "@/components/Toast";
import {
  tenants,
  reminderEvents,
  maintenanceTickets,
  leaseRenewals,
  activityFeed,
  monthlySummary,
  rentChartData,
  landlord,
  formatCurrency,
  formatDate,
  type Tenant,
  type MaintenanceTicket,
  type LeaseRenewal,
  type ReminderEvent,
} from "@/lib/mock-data";

type Tab = "overview" | "directory" | "reminders" | "maintenance" | "renewals" | "summary" | "intake";

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "directory", label: "Tenant Directory", icon: Users },
  { id: "reminders", label: "Rent Reminders", icon: Bell },
  { id: "maintenance", label: "Maintenance", icon: Wrench },
  { id: "renewals", label: "Lease Renewals", icon: Calendar },
  { id: "summary", label: "Monthly Summary", icon: FileText },
  { id: "intake", label: "Tenant Intake Link", icon: ExternalLink },
];

const statusColors: Record<string, string> = {
  paid: "bg-emerald-500/20 text-emerald-400",
  late: "bg-red-500/20 text-red-400",
  pending: "bg-amber-500/20 text-amber-400",
  partial: "bg-orange-500/20 text-orange-400",
  open: "bg-red-500/20 text-red-400",
  in_progress: "bg-amber-500/20 text-amber-400",
  scheduled: "bg-blue-500/20 text-blue-400",
  resolved: "bg-emerald-500/20 text-emerald-400",
  sent: "bg-emerald-500/20 text-emerald-400",
  scheduled_reminder: "bg-blue-500/20 text-blue-400",
  draft: "bg-slate-500/20 text-slate-400",
  pending_review: "bg-amber-500/20 text-amber-400",
  negotiating: "bg-purple-500/20 text-purple-400",
  signed: "bg-emerald-500/20 text-emerald-400",
};

export default function DemoApp() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [propertyFilter, setPropertyFilter] = useState<string>("all");
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<MaintenanceTicket | null>(null);
  const [selectedRenewal, setSelectedRenewal] = useState<LeaseRenewal | null>(null);
  const [selectedReminder, setSelectedReminder] = useState<ReminderEvent | null>(null);
  const [editedDraft, setEditedDraft] = useState("");
  const [reminderToggle, setReminderToggle] = useState(true);
  const [maintenanceFilter, setMaintenanceFilter] = useState<string>("all");
  const [activityFilter, setActivityFilter] = useState<string>("all");
  const [tickets, setTickets] = useState(maintenanceTickets);
  const [renewals, setRenewals] = useState(leaseRenewals);
  const [intakeForm, setIntakeForm] = useState({
    name: "",
    unit: "",
    category: "Plumbing",
    priority: "medium",
    description: "",
  });
  const [intakeStep, setIntakeStep] = useState(0);
  const [showIntakePreview, setShowIntakePreview] = useState(false);

  const addToast = useCallback((message: string, type: ToastMessage["type"] = "success") => {
    setToasts((prev) => [...prev, { id: Date.now().toString(), message, type }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const properties = useMemo(
    () => Array.from(new Set(tenants.map((t) => t.property))),
    []
  );

  const filteredTenants = useMemo(() => {
    return tenants.filter((t) => {
      const matchesSearch =
        searchQuery === "" ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.property.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || t.status === statusFilter;
      const matchesProperty = propertyFilter === "all" || t.property === propertyFilter;
      return matchesSearch && matchesStatus && matchesProperty;
    });
  }, [searchQuery, statusFilter, propertyFilter]);

  const maxChartValue = Math.max(...rentChartData.map((d) => d.expected));

  const filteredActivity = useMemo(() => {
    if (activityFilter === "all") return activityFeed;
    return activityFeed.filter((a) => a.type === activityFilter);
  }, [activityFilter]);

  const filteredTickets = useMemo(() => {
    if (maintenanceFilter === "all") return tickets;
    return tickets.filter((t) => t.status === maintenanceFilter);
  }, [tickets, maintenanceFilter]);

  const handleApproveDraft = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: "scheduled" as const } : t))
    );
    setSelectedTicket(null);
    addToast("AI draft approved and sent to tenant");
  };

  const handleSendRenewal = (renewalId: string) => {
    setRenewals((prev) =>
      prev.map((r) => (r.id === renewalId ? { ...r, status: "sent" as const } : r))
    );
    setSelectedRenewal(null);
    addToast("Renewal offer letter sent to tenant");
  };

  const handleSendReminderNow = (reminderId: string) => {
    addToast("Reminder sent immediately (mock)");
    setSelectedReminder(null);
  };

  const handleIntakeSubmit = () => {
    setIntakeStep(2);
    addToast("Maintenance request submitted — AI drafting reply");
  };

  const handleCopyIntakeLink = () => {
    navigator.clipboard.writeText("https://tenantpulse.app/r/marcus-chen-8units");
    addToast("Tenant intake link copied to clipboard", "info");
  };

  const openTicketModal = (ticket: MaintenanceTicket) => {
    setSelectedTicket(ticket);
    setEditedDraft(ticket.aiDraftReply);
  };

  const openRenewalModal = (renewal: LeaseRenewal) => {
    setSelectedRenewal(renewal);
    setEditedDraft(renewal.aiDraftLetter);
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Demo top bar */}
      <div className="border-b border-white/10 bg-surface-raised">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand">
                <Activity className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-display font-bold text-white">TenantPulse</span>
            </Link>
            <span className="rounded bg-accent/20 px-2 py-0.5 text-xs font-medium text-accent">
              DEMO
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-slate-400 md:inline">
              {landlord.name} · {landlord.units} units
            </span>
            <Link href="/developers" className="text-sm text-slate-400 hover:text-accent">
              Dev Docs
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Tab navigation */}
        <div className="mb-6 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                activeTab === tab.id
                  ? "bg-brand text-white"
                  : "bg-surface-raised text-slate-400 hover:bg-surface-overlay hover:text-white"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="animate-fade-in space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-white">
                Dashboard Overview
                <DevNote note="Production: Cron agent aggregates daily metrics from Supabase — rent status, open tickets, pending renewals. Pushed to dashboard via real-time subscription." />
              </h2>
              <button
                type="button"
                onClick={() => addToast("Dashboard refreshed", "info")}
                className="btn-secondary text-sm"
              >
                Refresh
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  label: "Collection Rate",
                  value: `${monthlySummary.collectionRate}%`,
                  sub: formatCurrency(monthlySummary.totalCollected) + " collected",
                  icon: BarChart3,
                  color: "text-accent",
                },
                {
                  label: "Late Payments",
                  value: monthlySummary.lateCount.toString(),
                  sub: "James & Lisa Park",
                  icon: AlertTriangle,
                  color: "text-red-400",
                },
                {
                  label: "Open Maintenance",
                  value: monthlySummary.openMaintenance.toString(),
                  sub: "1 urgent (HVAC)",
                  icon: Wrench,
                  color: "text-amber-400",
                },
                {
                  label: "Renewals Due",
                  value: renewals.filter((r) => r.daysUntilExpiry <= 90).length.toString(),
                  sub: "Within 90 days",
                  icon: Calendar,
                  color: "text-brand-light",
                },
              ].map((stat) => (
                <div key={stat.label} className="glass-card p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">{stat.label}</span>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <p className="mt-2 font-display text-3xl font-bold text-white">{stat.value}</p>
                  <p className="mt-1 text-xs text-slate-500">{stat.sub}</p>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="glass-card p-6">
              <h3 className="mb-4 font-display text-lg font-semibold text-white">
                Rent Collection — Last 6 Months
                <DevNote note="Production: Query payments table grouped by month. Chart rendered server-side or via Recharts with data from Supabase RPC." />
              </h3>
              <div className="flex h-48 items-end gap-3">
                {rentChartData.map((d) => (
                  <div key={d.month} className="flex flex-1 flex-col items-center gap-1">
                    <div className="relative flex w-full flex-col items-center gap-0.5" style={{ height: "160px" }}>
                      <div
                        className="w-full max-w-[40px] rounded-t bg-white/10"
                        style={{ height: `${(d.expected / maxChartValue) * 140}px` }}
                      />
                      <div
                        className="absolute bottom-0 w-full max-w-[40px] rounded-t bg-accent/70"
                        style={{ height: `${(d.collected / maxChartValue) * 140}px` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500">{d.month}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded bg-accent/70" /> Collected
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded bg-white/10" /> Expected
                </span>
              </div>
            </div>

            {/* Activity feed */}
            <div className="glass-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold text-white">
                  Activity Feed
                  <DevNote note="Production: Event log table written by cron agent on every action — reminder sent, payment received, AI draft created. WebSocket push to dashboard." />
                </h3>
                <select
                  className="rounded-lg border border-white/10 bg-surface px-3 py-1.5 text-sm text-slate-300"
                  value={activityFilter}
                  onChange={(e) => setActivityFilter(e.target.value)}
                >
                  <option value="all">All activity</option>
                  <option value="reminder">Reminders</option>
                  <option value="payment">Payments</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="ai">AI actions</option>
                </select>
              </div>
              <div className="space-y-3">
                {filteredActivity.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      addToast(
                        `Activity: ${item.message}`,
                        "info"
                      )
                    }
                    className="flex w-full items-start gap-3 rounded-lg p-3 text-left transition hover:bg-white/5"
                  >
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-overlay">
                      {item.type === "ai" && <Sparkles className="h-4 w-4 text-accent" />}
                      {item.type === "reminder" && <Bell className="h-4 w-4 text-brand-light" />}
                      {item.type === "payment" && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                      {item.type === "maintenance" && <Wrench className="h-4 w-4 text-amber-400" />}
                      {item.type === "renewal" && <Calendar className="h-4 w-4 text-purple-400" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-300">{item.message}</p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {new Date(item.timestamp).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TENANT DIRECTORY TAB */}
        {activeTab === "directory" && (
          <div className="animate-fade-in space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="font-display text-2xl font-bold text-white">
                Tenant Directory
                <DevNote note="Production: Supabase tenants table synced with lease docs. CRUD via landlord dashboard. Tenant portal links generated per unit." />
              </h2>
              <button
                type="button"
                onClick={() => addToast("Export downloaded: tenants-july-2026.csv", "info")}
                className="btn-secondary text-sm"
              >
                Export CSV
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search tenants, units, properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-surface-raised py-2 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-accent/50 focus:outline-none"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-white/10 bg-surface-raised px-3 py-2 text-sm text-slate-300"
              >
                <option value="all">All statuses</option>
                <option value="paid">Paid</option>
                <option value="late">Late</option>
                <option value="pending">Pending</option>
                <option value="partial">Partial</option>
              </select>
              <select
                value={propertyFilter}
                onChange={(e) => setPropertyFilter(e.target.value)}
                className="rounded-lg border border-white/10 bg-surface-raised px-3 py-2 text-sm text-slate-300"
              >
                <option value="all">All properties</option>
                {properties.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="glass-card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-slate-400">
                    <th className="px-4 py-3 font-medium">Tenant</th>
                    <th className="hidden px-4 py-3 font-medium md:table-cell">Unit / Property</th>
                    <th className="px-4 py-3 font-medium">Rent</th>
                    <th className="hidden px-4 py-3 font-medium lg:table-cell">Lease End</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTenants.map((tenant) => (
                    <tr
                      key={tenant.id}
                      className="border-b border-white/5 transition hover:bg-white/5"
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-white">{tenant.name}</p>
                        <p className="text-xs text-slate-500">{tenant.email}</p>
                      </td>
                      <td className="hidden px-4 py-3 md:table-cell">
                        <p className="text-slate-300">{tenant.unit}</p>
                        <p className="text-xs text-slate-500">{tenant.property}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        {formatCurrency(tenant.rentAmount)}
                      </td>
                      <td className="hidden px-4 py-3 text-slate-400 lg:table-cell">
                        {formatDate(tenant.leaseEnd)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusColors[tenant.status]}`}
                        >
                          {tenant.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setSelectedTenant(tenant)}
                          className="text-accent hover:underline"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredTenants.length === 0 && (
                <p className="p-8 text-center text-slate-500">No tenants match your filters.</p>
              )}
            </div>
          </div>
        )}

        {/* RENT REMINDERS TAB */}
        {activeTab === "reminders" && (
          <div className="animate-fade-in space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="font-display text-2xl font-bold text-white">
                Rent Reminder Sequence
                <DevNote note="Production: Daily cron checks rent_due_date per tenant. Sends via Twilio (SMS) and SendGrid (email) at day -3, 0, +3. AI personalizes message from tenant context." />
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-400">Auto-send enabled</span>
                <button
                  type="button"
                  onClick={() => {
                    setReminderToggle(!reminderToggle);
                    addToast(
                      reminderToggle
                        ? "Auto-send reminders paused"
                        : "Auto-send reminders enabled",
                      "info"
                    );
                  }}
                  className={`relative h-6 w-11 rounded-full transition ${
                    reminderToggle ? "bg-brand" : "bg-surface-overlay"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
                      reminderToggle ? "left-5" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {([-3, 0, 3] as const).map((offset) => (
                <div key={offset} className="glass-card p-5">
                  <h3 className="mb-3 flex items-center gap-2 font-display font-semibold text-white">
                    {offset === -3 && <Clock className="h-4 w-4 text-blue-400" />}
                    {offset === 0 && <Bell className="h-4 w-4 text-amber-400" />}
                    {offset === 3 && <AlertTriangle className="h-4 w-4 text-red-400" />}
                    Day {offset > 0 ? "+" : ""}
                    {offset}
                  </h3>
                  <p className="mb-4 text-xs text-slate-500">
                    {offset === -3 && "Friendly heads-up before due date"}
                    {offset === 0 && "Due date reminder"}
                    {offset === 3 && "Late payment follow-up"}
                  </p>
                  <div className="space-y-2">
                    {reminderEvents
                      .filter((r) => r.dayOffset === offset)
                      .map((reminder) => (
                        <button
                          key={reminder.id}
                          type="button"
                          onClick={() => setSelectedReminder(reminder)}
                          className="w-full rounded-lg border border-white/10 p-3 text-left transition hover:border-accent/30 hover:bg-white/5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-white">
                              {reminder.tenantName}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-slate-500">
                              {reminder.type === "sms" ? (
                                <MessageSquare className="h-3 w-3" />
                              ) : (
                                <Mail className="h-3 w-3" />
                              )}
                              {reminder.type}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-slate-400">{reminder.unit}</p>
                          <span
                            className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs ${statusColors[reminder.status]}`}
                          >
                            {reminder.status}
                          </span>
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MAINTENANCE TAB */}
        {activeTab === "maintenance" && (
          <div className="animate-fade-in space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="font-display text-2xl font-bold text-white">
                Maintenance Requests
                <DevNote note="Production: Tenant submits via public intake form → webhook triggers AI agent → drafts reply with estimated timeline from vendor calendar API → landlord approves in dashboard." />
              </h2>
              <button
                type="button"
                onClick={() => setActiveTab("intake")}
                className="btn-primary text-sm"
              >
                View Tenant Intake Form
              </button>
            </div>

            <div className="flex gap-2">
              {["all", "open", "in_progress", "scheduled", "resolved"].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setMaintenanceFilter(status)}
                  className={`rounded-lg border px-3 py-1.5 text-xs capitalize transition ${
                    maintenanceFilter === status
                      ? "border-accent bg-accent/20 text-accent"
                      : "border-white/10 text-slate-400 hover:border-accent/30 hover:text-white"
                  }`}
                >
                  {status.replace("_", " ")}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="glass-card flex flex-wrap items-center justify-between gap-4 p-4"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-white">{ticket.tenantName}</span>
                      <span className="text-slate-500">·</span>
                      <span className="text-sm text-slate-400">
                        {ticket.unit}, {ticket.property}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusColors[ticket.priority]}`}
                      >
                        {ticket.priority}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusColors[ticket.status]}`}
                      >
                        {ticket.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-400">
                      {ticket.category}: {ticket.description.slice(0, 80)}...
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Submitted {formatDate(ticket.submittedAt.split("T")[0])}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {ticket.status !== "resolved" && (
                      <button
                        type="button"
                        onClick={() => openTicketModal(ticket)}
                        className="btn-primary text-sm"
                      >
                        <Sparkles className="h-4 w-4" />
                        Review AI Draft
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        addToast(`Ticket ${ticket.id} marked as viewed`, "info")
                      }
                      className="btn-secondary text-sm"
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LEASE RENEWALS TAB */}
        {activeTab === "renewals" && (
          <div className="animate-fade-in space-y-4">
            <h2 className="font-display text-2xl font-bold text-white">
              Lease Renewal Alerts
              <DevNote note="Production: Cron checks lease_end dates daily. At 90/60/30 days, AI drafts renewal letter with market-rate analysis. Landlord reviews → DocuSign envelope sent." />
            </h2>

            <div className="grid gap-4 md:grid-cols-3">
              {([90, 60, 30] as const).map((stage) => (
                <div key={stage} className="glass-card p-4">
                  <h3 className="mb-2 font-display font-semibold text-white">
                    {stage}-Day Alert
                  </h3>
                  <p className="text-xs text-slate-500">
                    {renewals.filter((r) => r.alertStage === stage).length} active
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {renewals.map((renewal) => (
                <div
                  key={renewal.id}
                  className="glass-card flex flex-wrap items-center justify-between gap-4 p-4"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-white">{renewal.tenantName}</span>
                      <span className="text-sm text-slate-400">
                        {renewal.unit} · {renewal.property}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${statusColors[renewal.status]}`}
                      >
                        {renewal.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-400">
                      Expires {formatDate(renewal.leaseEnd)} · {renewal.daysUntilExpiry} days
                      remaining
                    </p>
                    <p className="mt-1 text-sm text-slate-300">
                      {formatCurrency(renewal.currentRent)} →{" "}
                      <span className="text-accent">
                        {formatCurrency(renewal.proposedRent)}
                      </span>{" "}
                      proposed
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openRenewalModal(renewal)}
                    className="btn-primary text-sm"
                  >
                    <FileText className="h-4 w-4" />
                    Review Offer Letter
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MONTHLY SUMMARY TAB */}
        {activeTab === "summary" && (
          <div className="animate-fade-in space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="font-display text-2xl font-bold text-white">
                Monthly Summary — {monthlySummary.month}
                <DevNote note="Production: Generated 1st of each month by cron agent. Aggregates payments, late accounts, open tickets. Emailed to landlord as PDF + in-app view." />
              </h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => addToast("Summary PDF downloaded", "info")}
                  className="btn-secondary text-sm"
                >
                  Download PDF
                </button>
                <button
                  type="button"
                  onClick={() => addToast("Summary emailed to marcus@chenproperties.com")}
                  className="btn-primary text-sm"
                >
                  <Send className="h-4 w-4" />
                  Email Summary
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="glass-card p-5">
                <p className="text-sm text-slate-400">Expected Rent</p>
                <p className="mt-1 font-display text-2xl font-bold text-white">
                  {formatCurrency(monthlySummary.totalExpected)}
                </p>
              </div>
              <div className="glass-card p-5">
                <p className="text-sm text-slate-400">Collected</p>
                <p className="mt-1 font-display text-2xl font-bold text-emerald-400">
                  {formatCurrency(monthlySummary.totalCollected)}
                </p>
              </div>
              <div className="glass-card p-5">
                <p className="text-sm text-slate-400">Paid on Time</p>
                <p className="mt-1 font-display text-2xl font-bold text-white">
                  {monthlySummary.paidCount} / {landlord.units}
                </p>
              </div>
              <div className="glass-card p-5">
                <p className="text-sm text-slate-400">Avg Response Time</p>
                <p className="mt-1 font-display text-2xl font-bold text-accent">
                  {monthlySummary.avgResponseTime}
                </p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="glass-card p-6">
                <h3 className="mb-4 font-display font-semibold text-white">Payment Status</h3>
                <div className="space-y-3">
                  {tenants.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between rounded-lg bg-surface/50 p-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-white">{t.name}</p>
                        <p className="text-xs text-slate-500">{t.unit}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-300">{formatCurrency(t.rentAmount)}</p>
                        <span
                          className={`text-xs capitalize ${statusColors[t.status]?.split(" ")[1] || "text-slate-400"}`}
                        >
                          {t.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="mb-4 font-display font-semibold text-white">
                  Open Maintenance Tickets
                </h3>
                <div className="space-y-3">
                  {tickets
                    .filter((t) => t.status !== "resolved")
                    .map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          setActiveTab("maintenance");
                          openTicketModal(t);
                        }}
                        className="flex w-full items-center justify-between rounded-lg bg-surface/50 p-3 text-left transition hover:bg-white/5"
                      >
                        <div>
                          <p className="text-sm font-medium text-white">{t.tenantName}</p>
                          <p className="text-xs text-slate-500">
                            {t.category} · {t.unit}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs capitalize ${statusColors[t.status]}`}
                        >
                          {t.status.replace("_", " ")}
                        </span>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TENANT INTAKE TAB */}
        {activeTab === "intake" && (
          <div className="animate-fade-in mx-auto max-w-2xl space-y-6">
            <div className="text-center">
              <h2 className="font-display text-2xl font-bold text-white">
                Tenant Maintenance Intake
                <DevNote note="Production: Public route /r/{landlord-slug} — no auth required. Form submission → Supabase edge function → AI agent drafts reply → notifies landlord via push + email." />
              </h2>
              <p className="mt-2 text-slate-400">
                This is what your tenants see when they click your intake link
              </p>
            </div>

            <div className="flex items-center justify-center gap-2">
              <code className="rounded-lg bg-surface-raised px-4 py-2 text-sm text-accent">
                https://tenantpulse.app/r/marcus-chen-8units
              </code>
              <button
                type="button"
                onClick={handleCopyIntakeLink}
                className="btn-secondary text-sm"
              >
                <Copy className="h-4 w-4" />
                Copy
              </button>
            </div>

            {/* Wizard steps */}
            <div className="flex justify-center gap-2">
              {["Details", "Description", "Submitted"].map((step, i) => (
                <div
                  key={step}
                  className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs ${
                    intakeStep >= i
                      ? "bg-brand/20 text-brand-light"
                      : "bg-surface-raised text-slate-500"
                  }`}
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-surface text-xs">
                    {i + 1}
                  </span>
                  {step}
                </div>
              ))}
            </div>

            <div className="glass-card p-6">
              {intakeStep === 0 && (
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm text-slate-400">Your Name</label>
                    <input
                      type="text"
                      value={intakeForm.name}
                      onChange={(e) =>
                        setIntakeForm({ ...intakeForm, name: e.target.value })
                      }
                      placeholder="e.g. Michael Torres"
                      className="w-full rounded-lg border border-white/10 bg-surface px-4 py-2 text-white placeholder:text-slate-600 focus:border-accent/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-slate-400">Unit</label>
                    <select
                      value={intakeForm.unit}
                      onChange={(e) =>
                        setIntakeForm({ ...intakeForm, unit: e.target.value })
                      }
                      className="w-full rounded-lg border border-white/10 bg-surface px-4 py-2 text-white focus:border-accent/50 focus:outline-none"
                    >
                      <option value="">Select your unit</option>
                      {tenants.map((t) => (
                        <option key={t.id} value={t.unit}>
                          {t.unit} — {t.property}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm text-slate-400">Category</label>
                      <select
                        value={intakeForm.category}
                        onChange={(e) =>
                          setIntakeForm({ ...intakeForm, category: e.target.value })
                        }
                        className="w-full rounded-lg border border-white/10 bg-surface px-4 py-2 text-white focus:border-accent/50 focus:outline-none"
                      >
                        {["Plumbing", "HVAC", "Electrical", "Appliance", "Other"].map(
                          (c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm text-slate-400">Priority</label>
                      <select
                        value={intakeForm.priority}
                        onChange={(e) =>
                          setIntakeForm({ ...intakeForm, priority: e.target.value })
                        }
                        className="w-full rounded-lg border border-white/10 bg-surface px-4 py-2 text-white focus:border-accent/50 focus:outline-none"
                      >
                        {["low", "medium", "high", "urgent"].map((p) => (
                          <option key={p} value={p}>
                            {p.charAt(0).toUpperCase() + p.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIntakeStep(1)}
                    disabled={!intakeForm.name || !intakeForm.unit}
                    className="btn-primary w-full disabled:opacity-50"
                  >
                    Continue
                  </button>
                </div>
              )}

              {intakeStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm text-slate-400">
                      Describe the issue
                    </label>
                    <textarea
                      value={intakeForm.description}
                      onChange={(e) =>
                        setIntakeForm({ ...intakeForm, description: e.target.value })
                      }
                      rows={5}
                      placeholder="Please describe what's happening..."
                      className="w-full rounded-lg border border-white/10 bg-surface px-4 py-2 text-white placeholder:text-slate-600 focus:border-accent/50 focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIntakeStep(0)}
                      className="btn-secondary flex-1"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleIntakeSubmit}
                      disabled={!intakeForm.description}
                      className="btn-primary flex-1 disabled:opacity-50"
                    >
                      Submit Request
                    </button>
                  </div>
                </div>
              )}

              {intakeStep === 2 && (
                <div className="space-y-4 text-center">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" />
                  <h3 className="font-display text-xl font-semibold text-white">
                    Request Submitted!
                  </h3>
                  <p className="text-slate-400">
                    Your landlord has been notified. You&apos;ll receive a response within 24
                    hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowIntakePreview(true)}
                    className="btn-primary"
                  >
                    <Sparkles className="h-4 w-4" />
                    Preview AI Draft Reply
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIntakeStep(0);
                      setIntakeForm({
                        name: "",
                        unit: "",
                        category: "Plumbing",
                        priority: "medium",
                        description: "",
                      });
                    }}
                    className="btn-secondary ml-2"
                  >
                    Submit Another
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tenant detail modal */}
      <Modal
        open={!!selectedTenant}
        onClose={() => setSelectedTenant(null)}
        title={selectedTenant?.name || ""}
        wide
      >
        {selectedTenant && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-slate-500">Unit</p>
                <p className="text-white">{selectedTenant.unit}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Property</p>
                <p className="text-white">{selectedTenant.property}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Email</p>
                <p className="flex items-center gap-1 text-white">
                  <Mail className="h-3 w-3 text-slate-500" />
                  {selectedTenant.email}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Phone</p>
                <p className="flex items-center gap-1 text-white">
                  <Phone className="h-3 w-3 text-slate-500" />
                  {selectedTenant.phone}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Rent</p>
                <p className="text-white">{formatCurrency(selectedTenant.rentAmount)}/mo</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Status</p>
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-xs capitalize ${statusColors[selectedTenant.status]}`}
                >
                  {selectedTenant.status}
                </span>
              </div>
              <div>
                <p className="text-xs text-slate-500">Lease Start</p>
                <p className="text-white">{formatDate(selectedTenant.leaseStart)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Lease End</p>
                <p className="text-white">{formatDate(selectedTenant.leaseEnd)}</p>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  addToast(`Reminder sent to ${selectedTenant.name}`);
                  setSelectedTenant(null);
                }}
                className="btn-primary text-sm"
              >
                <Bell className="h-4 w-4" />
                Send Reminder
              </button>
              <button
                type="button"
                onClick={() => {
                  addToast("Payment marked as received", "info");
                  setSelectedTenant(null);
                }}
                className="btn-secondary text-sm"
              >
                Mark Paid
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Maintenance AI draft modal */}
      <Modal
        open={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        title="Review AI Draft Reply"
        wide
      >
        {selectedTicket && (
          <div className="space-y-4">
            <div className="rounded-lg bg-surface p-4">
              <p className="text-xs font-medium uppercase text-slate-500">Tenant Request</p>
              <p className="mt-1 text-sm text-slate-300">{selectedTicket.description}</p>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium uppercase text-accent">
                AI Draft (editable)
              </p>
              <textarea
                value={editedDraft}
                onChange={(e) => setEditedDraft(e.target.value)}
                rows={6}
                className="w-full rounded-lg border border-white/10 bg-surface px-4 py-3 text-sm text-white focus:border-accent/50 focus:outline-none"
              />
            </div>
            <p className="text-sm text-slate-400">
              <Clock className="mr-1 inline h-4 w-4" />
              {selectedTicket.estimatedTimeline}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleApproveDraft(selectedTicket.id)}
                className="btn-primary text-sm"
              >
                <Check className="h-4 w-4" />
                Approve & Send
              </button>
              <button
                type="button"
                onClick={() => addToast("Draft saved for later", "info")}
                className="btn-secondary text-sm"
              >
                Save Draft
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Renewal modal */}
      <Modal
        open={!!selectedRenewal}
        onClose={() => setSelectedRenewal(null)}
        title="Review Renewal Offer Letter"
        wide
      >
        {selectedRenewal && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="text-slate-400">
                Current: {formatCurrency(selectedRenewal.currentRent)}
              </span>
              <span className="text-accent">
                Proposed: {formatCurrency(selectedRenewal.proposedRent)}
              </span>
              <span className="text-slate-400">
                Expires: {formatDate(selectedRenewal.leaseEnd)}
              </span>
            </div>
            <textarea
              value={editedDraft}
              onChange={(e) => setEditedDraft(e.target.value)}
              rows={10}
              className="w-full rounded-lg border border-white/10 bg-surface px-4 py-3 text-sm text-white focus:border-accent/50 focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleSendRenewal(selectedRenewal.id)}
                className="btn-primary text-sm"
              >
                <Send className="h-4 w-4" />
                Send Offer
              </button>
              <button
                type="button"
                onClick={() => addToast("Offer saved as draft", "info")}
                className="btn-secondary text-sm"
              >
                Save Draft
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Reminder preview modal */}
      <Modal
        open={!!selectedReminder}
        onClose={() => setSelectedReminder(null)}
        title="Reminder Preview"
      >
        {selectedReminder && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              {selectedReminder.type === "sms" ? (
                <MessageSquare className="h-4 w-4" />
              ) : (
                <Mail className="h-4 w-4" />
              )}
              {selectedReminder.type.toUpperCase()} · Day {selectedReminder.dayOffset > 0 ? "+" : ""}
              {selectedReminder.dayOffset}
            </div>
            <p className="rounded-lg bg-surface p-4 text-sm text-slate-300">
              {selectedReminder.preview}
            </p>
            <p className="text-xs text-slate-500">
              Scheduled: {new Date(selectedReminder.scheduledAt).toLocaleString()}
            </p>
            {selectedReminder.status === "scheduled" && (
              <button
                type="button"
                onClick={() => handleSendReminderNow(selectedReminder.id)}
                className="btn-primary w-full text-sm"
              >
                Send Now
              </button>
            )}
          </div>
        )}
      </Modal>

      {/* Intake AI preview modal */}
      <Modal
        open={showIntakePreview}
        onClose={() => setShowIntakePreview(false)}
        title="AI Draft Reply (Landlord View)"
        wide
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-400">
            This is what the AI would draft for landlord approval:
          </p>
          <div className="rounded-lg bg-surface p-4 text-sm text-slate-300">
            Hi {intakeForm.name || "Tenant"}, thank you for reporting the{" "}
            {intakeForm.category.toLowerCase()} issue in {intakeForm.unit || "your unit"}. I&apos;ve
            reviewed your request and will schedule a technician within 24–48 hours. For urgent
            issues like this ({intakeForm.priority} priority), we prioritize same-day response.
            I&apos;ll follow up with a specific appointment time shortly.
          </div>
          <button
            type="button"
            onClick={() => {
              setShowIntakePreview(false);
              setActiveTab("maintenance");
              addToast("Switched to Maintenance tab to review draft");
            }}
            className="btn-primary text-sm"
          >
            Go to Maintenance Dashboard
          </button>
        </div>
      </Modal>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
