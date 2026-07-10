export interface Tenant {
  id: string;
  unit: string;
  property: string;
  name: string;
  email: string;
  phone: string;
  rentAmount: number;
  leaseStart: string;
  leaseEnd: string;
  rentDueDay: number;
  status: "paid" | "late" | "pending" | "partial";
  lastPayment: string;
}

export interface ReminderEvent {
  id: string;
  tenantId: string;
  tenantName: string;
  unit: string;
  type: "sms" | "email";
  dayOffset: -3 | 0 | 3;
  scheduledAt: string;
  status: "sent" | "scheduled" | "draft";
  preview: string;
}

export interface MaintenanceTicket {
  id: string;
  tenantId: string;
  tenantName: string;
  unit: string;
  property: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "scheduled" | "resolved";
  submittedAt: string;
  description: string;
  aiDraftReply: string;
  estimatedTimeline: string;
}

export interface LeaseRenewal {
  id: string;
  tenantId: string;
  tenantName: string;
  unit: string;
  property: string;
  leaseEnd: string;
  daysUntilExpiry: number;
  alertStage: 90 | 60 | 30;
  currentRent: number;
  proposedRent: number;
  aiDraftLetter: string;
  status: "pending_review" | "sent" | "negotiating" | "signed";
}

export interface ActivityItem {
  id: string;
  timestamp: string;
  type: "reminder" | "payment" | "maintenance" | "renewal" | "ai";
  message: string;
  tenantName?: string;
}

export const landlord = {
  name: "Marcus Chen",
  email: "marcus@chenproperties.com",
  properties: 3,
  units: 8,
};

export const tenants: Tenant[] = [
  {
    id: "t1",
    unit: "Unit 2A",
    property: "Oak Street Duplex",
    name: "Sarah Mitchell",
    email: "sarah.mitchell@gmail.com",
    phone: "(503) 555-0142",
    rentAmount: 1450,
    leaseStart: "2024-08-01",
    leaseEnd: "2026-07-31",
    rentDueDay: 1,
    status: "paid",
    lastPayment: "2026-07-01",
  },
  {
    id: "t2",
    unit: "Unit 2B",
    property: "Oak Street Duplex",
    name: "James & Lisa Park",
    email: "jpark.family@outlook.com",
    phone: "(503) 555-0198",
    rentAmount: 1525,
    leaseStart: "2025-01-15",
    leaseEnd: "2026-01-14",
    rentDueDay: 1,
    status: "late",
    lastPayment: "2026-06-01",
  },
  {
    id: "t3",
    unit: "Apt 4",
    property: "Riverside Fourplex",
    name: "David Okonkwo",
    email: "d.okonkwo@yahoo.com",
    phone: "(971) 555-0234",
    rentAmount: 1275,
    leaseStart: "2023-11-01",
    leaseEnd: "2025-10-31",
    rentDueDay: 1,
    status: "paid",
    lastPayment: "2026-07-01",
  },
  {
    id: "t4",
    unit: "Apt 1",
    property: "Riverside Fourplex",
    name: "Emily Rodriguez",
    email: "emily.r@icloud.com",
    phone: "(503) 555-0311",
    rentAmount: 1195,
    leaseStart: "2024-03-01",
    leaseEnd: "2026-02-28",
    rentDueDay: 1,
    status: "pending",
    lastPayment: "2026-06-01",
  },
  {
    id: "t5",
    unit: "Apt 2",
    property: "Riverside Fourplex",
    name: "Michael Torres",
    email: "mtorres.work@gmail.com",
    phone: "(503) 555-0456",
    rentAmount: 1225,
    leaseStart: "2024-06-01",
    leaseEnd: "2026-05-31",
    rentDueDay: 1,
    status: "paid",
    lastPayment: "2026-07-03",
  },
  {
    id: "t6",
    unit: "Apt 3",
    property: "Riverside Fourplex",
    name: "Priya Sharma",
    email: "priya.sharma@proton.me",
    phone: "(971) 555-0567",
    rentAmount: 1295,
    leaseStart: "2025-02-01",
    leaseEnd: "2026-01-31",
    rentDueDay: 1,
    status: "partial",
    lastPayment: "2026-07-05",
  },
  {
    id: "t7",
    unit: "Main Floor",
    property: "Maple Cottage ADU",
    name: "Robert & Karen Walsh",
    email: "walsh.home@gmail.com",
    phone: "(503) 555-0678",
    rentAmount: 1650,
    leaseStart: "2023-09-01",
    leaseEnd: "2025-08-31",
    rentDueDay: 1,
    status: "paid",
    lastPayment: "2026-07-01",
  },
  {
    id: "t8",
    unit: "Upper Unit",
    property: "Maple Cottage ADU",
    name: "Angela Foster",
    email: "angela.foster@me.com",
    phone: "(503) 555-0789",
    rentAmount: 1575,
    leaseStart: "2024-10-01",
    leaseEnd: "2026-09-30",
    rentDueDay: 1,
    status: "paid",
    lastPayment: "2026-07-02",
  },
];

export const reminderEvents: ReminderEvent[] = [
  {
    id: "r1",
    tenantId: "t2",
    tenantName: "James & Lisa Park",
    unit: "Unit 2B",
    type: "email",
    dayOffset: -3,
    scheduledAt: "2026-06-28T09:00:00",
    status: "sent",
    preview:
      "Hi James & Lisa, friendly reminder that rent of $1,525 for Unit 2B is due July 1. Pay via your tenant portal or Zelle to marcus@chenproperties.com.",
  },
  {
    id: "r2",
    tenantId: "t2",
    tenantName: "James & Lisa Park",
    unit: "Unit 2B",
    type: "sms",
    dayOffset: 0,
    scheduledAt: "2026-07-01T08:00:00",
    status: "sent",
    preview:
      "TenantPulse: Rent $1,525 due today for Unit 2B. Reply PAID once sent. Questions? Text back.",
  },
  {
    id: "r3",
    tenantId: "t2",
    tenantName: "James & Lisa Park",
    unit: "Unit 2B",
    type: "sms",
    dayOffset: 3,
    scheduledAt: "2026-07-04T10:00:00",
    status: "sent",
    preview:
      "Hi James, rent for Unit 2B was due July 1 and we haven't received payment. Please send $1,525 today to avoid late fees.",
  },
  {
    id: "r4",
    tenantId: "t4",
    tenantName: "Emily Rodriguez",
    unit: "Apt 1",
    type: "email",
    dayOffset: -3,
    scheduledAt: "2026-07-08T09:00:00",
    status: "scheduled",
    preview:
      "Hi Emily, your rent of $1,195 for Apt 1 at Riverside Fourplex is due August 1. Let us know if you have questions.",
  },
  {
    id: "r5",
    tenantId: "t6",
    tenantName: "Priya Sharma",
    unit: "Apt 3",
    type: "email",
    dayOffset: 0,
    scheduledAt: "2026-08-01T08:00:00",
    status: "scheduled",
    preview:
      "Hi Priya, rent of $1,295 is due today. We received a partial payment of $600 — remaining balance is $695.",
  },
  {
    id: "r6",
    tenantId: "t1",
    tenantName: "Sarah Mitchell",
    unit: "Unit 2A",
    type: "sms",
    dayOffset: -3,
    scheduledAt: "2026-07-29T09:00:00",
    status: "scheduled",
    preview:
      "TenantPulse: Rent $1,450 due Aug 1 for Unit 2A. Thanks for being a great tenant!",
  },
];

export const maintenanceTickets: MaintenanceTicket[] = [
  {
    id: "m1",
    tenantId: "t3",
    tenantName: "David Okonkwo",
    unit: "Apt 4",
    property: "Riverside Fourplex",
    category: "Plumbing",
    priority: "high",
    status: "in_progress",
    submittedAt: "2026-07-08T14:22:00",
    description:
      "Kitchen sink is draining very slowly and there's a faint odor. Tried baking soda and vinegar but no improvement.",
    aiDraftReply:
      "Hi David, thank you for reporting the slow drain in Apt 4. I've scheduled a plumber for Thursday, July 11 between 10am–2pm. Please ensure someone 18+ is home. Estimated repair time: 1–2 hours. We'll follow up once complete.",
    estimatedTimeline: "Plumber scheduled Jul 11, 10am–2pm",
  },
  {
    id: "m2",
    tenantId: "t5",
    tenantName: "Michael Torres",
    unit: "Apt 2",
    property: "Riverside Fourplex",
    category: "HVAC",
    priority: "urgent",
    status: "open",
    submittedAt: "2026-07-09T07:45:00",
    description:
      "AC stopped blowing cold air last night. Thermostat shows it's running but air is warm. It's 94°F outside.",
    aiDraftReply:
      "Hi Michael, I'm sorry about the AC issue — I know how uncomfortable that is in this heat. I've contacted our HVAC vendor Priority Climate Services for same-day service. Expect a call within 2 hours. Temporary window units can be provided if repair takes longer.",
    estimatedTimeline: "Same-day HVAC dispatch (within 4 hours)",
  },
  {
    id: "m3",
    tenantId: "t7",
    tenantName: "Robert & Karen Walsh",
    unit: "Main Floor",
    property: "Maple Cottage ADU",
    category: "Appliance",
    priority: "medium",
    status: "scheduled",
    submittedAt: "2026-07-05T16:30:00",
    description:
      "Dishwasher making loud grinding noise during wash cycle. Still works but worried it might break completely.",
    aiDraftReply:
      "Hi Robert & Karen, thanks for the heads up on the dishwasher. I've ordered a replacement pump assembly and scheduled a technician for Monday, July 14 at 9am. Please don't run the dishwasher until then to prevent further damage.",
    estimatedTimeline: "Repair scheduled Jul 14, 9am",
  },
  {
    id: "m4",
    tenantId: "t1",
    tenantName: "Sarah Mitchell",
    unit: "Unit 2A",
    property: "Oak Street Duplex",
    category: "Electrical",
    priority: "low",
    status: "resolved",
    submittedAt: "2026-06-28T11:00:00",
    description: "Bedroom ceiling light flickers intermittently, especially when the dryer runs.",
    aiDraftReply:
      "Hi Sarah, the flickering is likely a shared circuit issue. Our electrician inspected on July 2 and replaced a loose connection in the junction box. Please let us know if it recurs.",
    estimatedTimeline: "Resolved Jul 2",
  },
];

export const leaseRenewals: LeaseRenewal[] = [
  {
    id: "lr1",
    tenantId: "t3",
    tenantName: "David Okonkwo",
    unit: "Apt 4",
    property: "Riverside Fourplex",
    leaseEnd: "2025-10-31",
    daysUntilExpiry: 113,
    alertStage: 90,
    currentRent: 1275,
    proposedRent: 1340,
    status: "pending_review",
    aiDraftLetter:
      "Dear David,\n\nYour lease for Apt 4 at Riverside Fourplex expires October 31, 2025. We'd love to have you stay another year. We're offering a renewal at $1,340/month (5.1% increase, below market average of 7.2%).\n\nThe renewal includes refreshed interior paint and new smoke/CO detectors at no cost. Please sign by August 15 to lock in this rate.\n\nBest,\nMarcus Chen",
  },
  {
    id: "lr2",
    tenantId: "t7",
    tenantName: "Robert & Karen Walsh",
    unit: "Main Floor",
    property: "Maple Cottage ADU",
    leaseEnd: "2025-08-31",
    daysUntilExpiry: 52,
    alertStage: 60,
    currentRent: 1650,
    proposedRent: 1725,
    status: "sent",
    aiDraftLetter:
      "Dear Robert & Karen,\n\nAs your lease at Maple Cottage ADU approaches its August 31 expiration, we'd like to offer a 12-month renewal at $1,725/month. This reflects updated property tax and insurance costs while keeping the increase modest.\n\nYour on-time payment history qualifies you for our 'preferred tenant' rate — $50 below our standard renewal offer.\n\nPlease review and sign by July 25.",
  },
  {
    id: "lr3",
    tenantId: "t2",
    tenantName: "James & Lisa Park",
    unit: "Unit 2B",
    property: "Oak Street Duplex",
    leaseEnd: "2026-01-14",
    daysUntilExpiry: 188,
    alertStage: 90,
    currentRent: 1525,
    proposedRent: 1595,
    status: "negotiating",
    aiDraftLetter:
      "Dear James & Lisa,\n\nWe value you as tenants at Unit 2B. Your lease expires January 14, 2026. We're proposing $1,595/month for a 12-month renewal.\n\nNote: Given recent payment timing, renewal is contingent on account being current. We're happy to discuss a payment plan if needed.",
  },
];

export const activityFeed: ActivityItem[] = [
  {
    id: "a1",
    timestamp: "2026-07-10T08:15:00",
    type: "ai",
    message: "AI drafted acknowledgment for Michael Torres HVAC request (urgent)",
    tenantName: "Michael Torres",
  },
  {
    id: "a2",
    timestamp: "2026-07-10T07:30:00",
    type: "maintenance",
    message: "New maintenance request submitted: AC not cooling",
    tenantName: "Michael Torres",
  },
  {
    id: "a3",
    timestamp: "2026-07-09T16:00:00",
    type: "reminder",
    message: "Day +3 late rent SMS sent to James & Lisa Park",
    tenantName: "James & Lisa Park",
  },
  {
    id: "a4",
    timestamp: "2026-07-09T10:22:00",
    type: "payment",
    message: "Partial payment received: $600 from Priya Sharma",
    tenantName: "Priya Sharma",
  },
  {
    id: "a5",
    timestamp: "2026-07-08T14:25:00",
    type: "ai",
    message: "AI drafted plumber scheduling reply for David Okonkwo",
    tenantName: "David Okonkwo",
  },
  {
    id: "a6",
    timestamp: "2026-07-08T09:00:00",
    type: "renewal",
    message: "90-day renewal alert triggered for David Okonkwo (Apt 4)",
    tenantName: "David Okonkwo",
  },
  {
    id: "a7",
    timestamp: "2026-07-07T08:00:00",
    type: "reminder",
    message: "Day 0 rent reminder sent to 6 tenants",
  },
  {
    id: "a8",
    timestamp: "2026-07-05T11:00:00",
    type: "payment",
    message: "Rent payment confirmed: Angela Foster ($1,575)",
    tenantName: "Angela Foster",
  },
];

export const monthlySummary = {
  month: "July 2026",
  totalExpected: 11190,
  totalCollected: 8940,
  collectionRate: 79.9,
  paidCount: 5,
  lateCount: 1,
  pendingCount: 1,
  partialCount: 1,
  openMaintenance: 2,
  avgResponseTime: "2.4 hrs",
};

export const rentChartData = [
  { month: "Feb", collected: 10850, expected: 10950 },
  { month: "Mar", collected: 11190, expected: 11190 },
  { month: "Apr", collected: 11015, expected: 11190 },
  { month: "May", collected: 11190, expected: 11190 },
  { month: "Jun", collected: 10965, expected: 11190 },
  { month: "Jul", collected: 8940, expected: 11190 },
];

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr + (dateStr.includes("T") ? "" : "T12:00:00")).toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric", year: "numeric" }
  );
}

export function calculatePricing(units: number): { total: number; perUnit: number } {
  const perUnit = 5;
  const min = 15;
  const cap = 79;
  const raw = units * perUnit;
  const total = Math.min(Math.max(raw, min), cap);
  return { total, perUnit };
}
