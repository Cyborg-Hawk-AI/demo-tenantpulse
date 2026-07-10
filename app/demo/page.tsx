import type { Metadata } from "next";
import DemoApp from "@/components/DemoApp";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "TenantPulse Demo — Interactive Product Mock",
  description:
    "Fully interactive demo of TenantPulse: tenant directory, rent reminders, maintenance intake, lease renewals, and monthly summaries.",
};

export default function DemoPage() {
  return (
    <>
      <DemoApp />
      <Footer />
    </>
  );
}
