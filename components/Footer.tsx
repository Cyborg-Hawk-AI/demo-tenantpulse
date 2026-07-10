import Link from "next/link";
import { Activity } from "lucide-react";

interface FooterProps {
  className?: string;
}

export function Footer({ className = "" }: FooterProps) {
  return (
    <footer className={`border-t border-white/10 bg-surface-raised/50 ${className}`}>
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
        <div className="flex items-center gap-2 text-slate-400">
          <Activity className="h-5 w-5 text-accent" />
          <span className="font-display font-semibold text-white">TenantPulse</span>
          <span className="text-sm">· AI tenant communications</span>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
          <Link href="/demo" className="text-slate-400 transition hover:text-accent">
            Live Demo
          </Link>
          <Link href="/developers" className="text-slate-400 transition hover:text-accent">
            Developers
          </Link>
          <Link href="/research" className="text-slate-400 transition hover:text-accent">
            How we found this idea
          </Link>
        </nav>
        <p className="text-xs text-slate-500">Mock demo · No real data or messaging</p>
      </div>
    </footer>
  );
}
