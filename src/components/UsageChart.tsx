import { useHydroStore } from "@/lib/store";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { format } from "date-fns";

const COLORS = ["#22d3ee", "#5cbdb9", "#a78bfa", "#f59e0b"];

export function UsageChart() {
  const usage = useHydroStore(s => s.usage);
  const zones = useHydroStore(s => s.zones);
  const data = usage.map(p => ({ ...p, time: format(new Date(p.t), "HH:mm:ss") }));

  return (
    <div className="panel p-5">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="font-display text-lg font-semibold">Usage Trend</h3>
        <span className="text-xs text-muted-foreground">Last {data.length * 5}s</span>
      </div>
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
            <defs>
              {zones.map((z, i) => (
                <linearGradient key={z.zone} id={`g-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="time" stroke="#64748b" fontSize={10} interval="preserveEnd" minTickGap={40} />
            <YAxis stroke="#64748b" fontSize={10} />
            <Tooltip
              contentStyle={{ background: "rgba(15,30,50,0.95)", border: "1px solid rgba(94,189,185,0.3)", borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: "#94a3b8" }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {zones.map((z, i) => (
              <Area key={z.zone} type="monotone" dataKey={z.zone} stroke={COLORS[i % COLORS.length]} strokeWidth={2} fill={`url(#g-${i})`} />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
