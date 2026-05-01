import { createFileRoute } from "@tanstack/react-router";
import { useHydroStore } from "@/lib/store";
import { useState } from "react";
import { toast } from "sonner";
import { Server, Database, Radio, Wifi } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — HydroSense" }, { name: "description", content: "Configure backend connection and system preferences." }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const apiBase = useHydroStore(s => s.apiBase);
  const setApiBase = useHydroStore(s => s.setApiBase);
  const setSource = useHydroStore(s => s.setSource);
  const source = useHydroStore(s => s.system.source);
  const sys = useHydroStore(s => s.system);
  const loadFromFlask = useHydroStore(s => s.loadFromFlask);
  const [url, setUrl] = useState(apiBase);

  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-6 space-y-5">
      <div>
        <h1 className="font-display text-3xl font-bold">System <span className="text-aqua">Settings</span></h1>
        <p className="text-sm text-muted-foreground mt-1">Configure data source and backend integration.</p>
      </div>

      <div className="panel p-5 space-y-4">
        <h3 className="font-display text-lg font-semibold flex items-center gap-2"><Server className="h-4 w-4 text-aqua" /> Backend Connection</h3>
        <div>
          <label className="text-xs text-muted-foreground">Flask API base URL</label>
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            className="mt-1 w-full px-3 py-2 rounded-md bg-input border border-border font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="http://127.0.0.1:5000"
          />
          <p className="text-[11px] text-muted-foreground mt-1.5">
            Default: <code className="text-aqua">http://127.0.0.1:5000</code>. The published web app cannot reach localhost — run locally to test the live Flask backend.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setApiBase(url); setSource("Flask"); loadFromFlask().then(() => toast.success("Switched to Flask backend")); }}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium">
            Use Flask Backend
          </button>
          <button
            onClick={() => { setSource("Simulation"); toast("Switched to built-in simulation"); }}
            className="px-4 py-2 rounded-md glass text-sm font-medium">
            Use Built-in Simulation
          </button>
        </div>

        <div className="text-xs flex items-center gap-2">
          <span className="text-muted-foreground">Currently:</span>
          <span className={`px-2 py-0.5 rounded font-medium ${source === "Flask" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>{source}</span>
        </div>
      </div>

      <div className="panel p-5">
        <h3 className="font-display text-lg font-semibold mb-3">API Endpoints</h3>
        <ul className="space-y-1.5 font-mono text-xs">
          {["GET  /api/zones", "POST /api/transfer", "POST /api/valve", "POST /api/acknowledge", "GET  /api/history", "GET  /api/system-status"].map(ep => (
            <li key={ep} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-aqua" />{ep}</li>
          ))}
        </ul>
      </div>

      <div className="panel p-5">
        <h3 className="font-display text-lg font-semibold mb-3">System Health</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Row icon={Database} label="Database" value={sys.database} ok={sys.database === "Connected"} />
          <Row icon={Radio} label="Sensors" value={sys.sensors} ok={sys.sensors === "Active"} />
          <Row icon={Wifi} label="Network" value={sys.network} ok={sys.network === "Online"} />
          <Row icon={Server} label="Source" value={sys.source} ok />
        </div>
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, value, ok }: { icon: any; label: string; value: string; ok: boolean }) {
  return (
    <div className="flex items-center gap-2 glass rounded p-3">
      <Icon className={`h-4 w-4 ${ok ? "text-[var(--normal)]" : "text-[var(--leak)]"}`} />
      <span className="text-muted-foreground text-xs">{label}:</span>
      <span className="font-medium text-sm">{value}</span>
    </div>
  );
}
