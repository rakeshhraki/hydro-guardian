import { lazy, Suspense } from "react";
const PipelineMap = lazy(() => import("./PipelineMap").then(m => ({ default: m.PipelineMap })));

export function PipelineMapClient({ height = 460 }: { height?: number }) {
  if (typeof window === "undefined") {
    return <div className="rounded-[var(--radius-lg)] border border-border bg-muted/20" style={{ height }} />;
  }
  return (
    <Suspense fallback={<div className="rounded-[var(--radius-lg)] border border-border bg-muted/20 grid place-items-center text-xs text-muted-foreground" style={{ height }}>Loading satellite map…</div>}>
      <PipelineMap height={height} />
    </Suspense>
  );
}
