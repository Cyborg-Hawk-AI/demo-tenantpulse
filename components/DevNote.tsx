"use client";

import { Info } from "lucide-react";
import { useState } from "react";

interface DevNoteProps {
  note: string;
}

export function DevNote({ note }: DevNoteProps) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-accent/20 text-accent transition hover:bg-accent/30"
        aria-label="Developer note"
      >
        <Info className="h-3 w-3" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-6 z-50 w-72 rounded-lg border border-accent/30 bg-surface-overlay p-3 text-xs leading-relaxed text-slate-300 shadow-xl">
            <span className="mb-1 block font-semibold uppercase tracking-wide text-accent">
              Dev Note
            </span>
            {note}
          </div>
        </>
      )}
    </span>
  );
}
