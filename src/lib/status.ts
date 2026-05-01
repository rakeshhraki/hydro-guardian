import type { ZoneStatus } from "@/lib/types";

export const STATUS_META: Record<string, { label: string; bg: string; fg: string; ring: string; hex: string; dot: string }> = {
  "Normal": { label: "Normal", bg: "bg-[var(--normal)]/15", fg: "text-[var(--normal)]", ring: "ring-[var(--normal)]/40", hex: "#22c55e", dot: "bg-[var(--normal)]" },
  "Leak Detected": { label: "Leak", bg: "bg-[var(--leak)]/15", fg: "text-[var(--leak)]", ring: "ring-[var(--leak)]/40", hex: "#ef4444", dot: "bg-[var(--leak)]" },
  "Over Consumption": { label: "Over Use", bg: "bg-[var(--over)]/15", fg: "text-[var(--over)]", ring: "ring-[var(--over)]/40", hex: "#f59e0b", dot: "bg-[var(--over)]" },
  "Unequal Distribution": { label: "Unequal", bg: "bg-[var(--unequal)]/15", fg: "text-[var(--unequal)]", ring: "ring-[var(--unequal)]/40", hex: "#3b82f6", dot: "bg-[var(--unequal)]" },
  "Transfer": { label: "Transfer", bg: "bg-primary/15", fg: "text-primary", ring: "ring-primary/40", hex: "#22d3ee", dot: "bg-primary" },
  "Valve": { label: "Valve", bg: "bg-muted", fg: "text-muted-foreground", ring: "ring-muted", hex: "#94a3b8", dot: "bg-muted-foreground" },
  "System": { label: "System", bg: "bg-muted", fg: "text-muted-foreground", ring: "ring-muted", hex: "#94a3b8", dot: "bg-muted-foreground" },
};

export function statusMeta(s: string) {
  return STATUS_META[s] ?? STATUS_META["System"];
}

export function isAlertStatus(s: string): s is ZoneStatus {
  return s === "Leak Detected" || s === "Over Consumption" || s === "Unequal Distribution";
}
