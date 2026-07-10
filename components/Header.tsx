import Link from "next/link";
import { Activity } from "lucide-react";

interface HeaderProps {
  active?: "home" | "demo" | "developers" | "research";
}

export function Header({ active }: HeaderProps) {
  const links = [
    { href: "/demo", label: "Demo", key: "demo" as const },
    { href: "/developers", label: "Developers", key: "developers" as const },
    { href: "/research", label: "Research", key: "research" as const },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand">
            <Activity className="h-4 w-4 text-white" />
          </div>
          <span className="font-display text-lg font-bold text-white">TenantPulse</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className={`text-sm transition ${
                active === link.key ? "font-medium text-accent" : "text-slate-400 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link href="/demo" className="btn-primary text-sm">
          Try Demo
        </Link>
      </div>
    </header>
  );
}
