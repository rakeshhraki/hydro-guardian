import { create } from "zustand";
import type { AlertEntry, SystemStatus, TransferRecommendation, UsagePoint, Zone, ZoneStatus } from "./types";

const INITIAL_ZONES: Zone[] = [
  { zone: "Zone A", normal_usage: 500, current_usage: 480, status: "Normal", latitude: 12.9716, longitude: 77.5946, tank_level: 78, last_update: new Date().toISOString(), valve_open: true },
  { zone: "Zone B", normal_usage: 600, current_usage: 590, status: "Normal", latitude: 12.9760, longitude: 77.6010, tank_level: 65, last_update: new Date().toISOString(), valve_open: true },
  { zone: "Zone C", normal_usage: 450, current_usage: 460, status: "Normal", latitude: 12.9665, longitude: 77.6005, tank_level: 82, last_update: new Date().toISOString(), valve_open: true },
  { zone: "Zone D", normal_usage: 550, current_usage: 540, status: "Normal", latitude: 12.9700, longitude: 77.5880, tank_level: 71, last_update: new Date().toISOString(), valve_open: true },
];

export const PIPELINES: Array<[string, string]> = [
  ["Zone A", "Zone B"],
  ["Zone B", "Zone C"],
  ["Zone A", "Zone D"],
  ["Zone D", "Zone C"],
];

interface State {
  zones: Zone[];
  alerts: AlertEntry[];
  recommendation: TransferRecommendation | null;
  usage: UsagePoint[];
  system: SystemStatus;
  apiBase: string;
  notifications: AlertEntry[];

  setApiBase: (s: string) => void;
  toggleSimulation: () => void;
  setSource: (s: "Simulation" | "Flask") => void;

  tick: () => void;
  triggerEvent: (kind: ZoneStatus, zoneName?: string) => void;
  acknowledge: (id?: string) => void;
  acknowledgeAll: () => void;
  confirmTransfer: () => void;
  cancelTransfer: () => void;
  setValve: (zone: string, open: boolean) => void;
  emergencyStop: () => void;
  dismissNotification: (id: string) => void;
  loadFromFlask: () => Promise<void>;
}

function nowISO() { return new Date().toISOString(); }
function rid() { return Math.random().toString(36).slice(2, 10); }

function pushAlert(list: AlertEntry[], a: Omit<AlertEntry, "id" | "time" | "acknowledged">): AlertEntry[] {
  const entry: AlertEntry = { id: rid(), time: nowISO(), acknowledged: false, ...a };
  return [entry, ...list].slice(0, 200);
}

function recomputeRecommendation(zones: Zone[]): TransferRecommendation | null {
  // Find zone with leak/over and a healthy donor.
  const needy = zones.find(z => z.status === "Leak Detected" || z.status === "Over Consumption" || z.status === "Unequal Distribution");
  if (!needy) return null;
  const donor = [...zones]
    .filter(z => z.zone !== needy.zone && z.status === "Normal")
    .sort((a, b) => b.tank_level - a.tank_level)[0];
  if (!donor) return null;
  const deficit = Math.max(120, Math.round(Math.abs(needy.current_usage - needy.normal_usage)));
  return { from: donor.zone, to: needy.zone, liters: Math.min(400, deficit) };
}

export const useHydroStore = create<State>((set, get) => ({
  zones: INITIAL_ZONES,
  alerts: [
    { id: rid(), time: nowISO(), zone: "System", status: "System", message: "HydroSense online — monitoring 4 zones", acknowledged: true },
  ],
  recommendation: null,
  usage: [],
  notifications: [],
  apiBase: "http://127.0.0.1:5000",
  system: { database: "Connected", sensors: "Active", network: "Online", simulation: true, source: "Simulation" },

  setApiBase: (s) => set({ apiBase: s }),
  setSource: (s) => set(state => ({ system: { ...state.system, source: s } })),
  toggleSimulation: () => set(state => ({ system: { ...state.system, simulation: !state.system.simulation } })),

  tick: () => {
    const state = get();
    if (!state.system.simulation) return;

    const zones = state.zones.map(z => {
      // small natural drift
      const drift = (Math.random() - 0.5) * 30;
      let current = z.current_usage + drift;
      let status: ZoneStatus = z.status;
      let tank = z.tank_level + (Math.random() - 0.55) * 1.2;

      // auto-recover if acknowledged
      if (z.acknowledged && z.status !== "Normal") {
        current = z.normal_usage + (Math.random() - 0.5) * 20;
        status = "Normal";
      } else {
        const ratio = current / z.normal_usage;
        if (ratio > 1.6) status = "Leak Detected";
        else if (ratio > 1.25) status = "Over Consumption";
        else if (ratio < 0.55) status = "Unequal Distribution";
        else if (!z.acknowledged) status = "Normal";
      }

      tank = Math.max(15, Math.min(100, tank));
      if (!z.valve_open) current = Math.max(0, current * 0.3);

      return {
        ...z,
        current_usage: Math.max(0, Math.round(current)),
        status,
        tank_level: Math.round(tank),
        last_update: nowISO(),
        acknowledged: status === "Normal" ? false : z.acknowledged,
      };
    });

    // Random spontaneous event
    let alerts = state.alerts;
    let notifications = state.notifications;
    zones.forEach((z, i) => {
      const prev = state.zones[i];
      if (z.status !== "Normal" && prev.status !== z.status) {
        const msg = `${z.status} in ${z.zone} — current ${z.current_usage}L vs normal ${z.normal_usage}L`;
        alerts = pushAlert(alerts, { zone: z.zone, status: z.status, message: msg });
        notifications = [{ id: rid(), time: nowISO(), zone: z.zone, status: z.status, message: msg, acknowledged: false }, ...notifications].slice(0, 5);
      }
    });

    // Usage history point
    const point: UsagePoint = { t: Date.now(), total: 0 };
    zones.forEach(z => { point[z.zone] = z.current_usage; point.total += z.current_usage; });
    const usage = [...state.usage, point].slice(-60);

    set({ zones, alerts, notifications, usage, recommendation: recomputeRecommendation(zones) });
  },

  triggerEvent: (kind, zoneName) => {
    const state = get();
    const zones = [...state.zones];
    const idx = zoneName ? zones.findIndex(z => z.zone === zoneName) : Math.floor(Math.random() * zones.length);
    if (idx < 0) return;
    const z = { ...zones[idx] };
    if (kind === "Leak Detected") z.current_usage = Math.round(z.normal_usage * 1.9);
    else if (kind === "Over Consumption") z.current_usage = Math.round(z.normal_usage * 1.4);
    else if (kind === "Unequal Distribution") z.current_usage = Math.round(z.normal_usage * 0.4);
    z.status = kind;
    z.acknowledged = false;
    z.last_update = nowISO();
    zones[idx] = z;

    const msg = `${kind} in ${z.zone} — current ${z.current_usage}L vs normal ${z.normal_usage}L`;
    const alerts = pushAlert(state.alerts, { zone: z.zone, status: kind, message: msg });
    const notifications = [{ id: rid(), time: nowISO(), zone: z.zone, status: kind, message: msg, acknowledged: false }, ...state.notifications].slice(0, 5);
    set({ zones, alerts, notifications, recommendation: recomputeRecommendation(zones) });
  },

  acknowledge: (id) => {
    const state = get();
    if (!id) {
      // Acknowledge most recent unacknowledged
      const target = state.alerts.find(a => !a.acknowledged);
      if (!target) return;
      id = target.id;
    }
    const alerts = state.alerts.map(a => a.id === id ? { ...a, acknowledged: true } : a);
    const target = state.alerts.find(a => a.id === id);
    let zones = state.zones;
    if (target && target.zone !== "System") {
      zones = state.zones.map(z => z.zone === target.zone ? { ...z, acknowledged: true } : z);
    }
    const notifications = state.notifications.filter(n => n.id !== id);
    set({ alerts, zones, notifications });
  },

  acknowledgeAll: () => {
    set(state => ({
      alerts: state.alerts.map(a => ({ ...a, acknowledged: true })),
      zones: state.zones.map(z => ({ ...z, acknowledged: true })),
      notifications: [],
    }));
  },

  confirmTransfer: () => {
    const state = get();
    const r = state.recommendation;
    if (!r) return;
    const zones = state.zones.map(z => {
      if (z.zone === r.from) return { ...z, tank_level: Math.max(20, z.tank_level - 8), current_usage: Math.round(z.normal_usage) };
      if (z.zone === r.to) return { ...z, tank_level: Math.min(100, z.tank_level + 8), current_usage: Math.round(z.normal_usage), status: "Normal" as ZoneStatus, acknowledged: false };
      return z;
    });
    const msg = `Transferred ${r.liters}L from ${r.from} to ${r.to}`;
    const alerts = pushAlert(state.alerts, { zone: r.to, status: "Transfer", message: msg });
    set({ zones, alerts, recommendation: null });
  },

  cancelTransfer: () => set({ recommendation: null }),

  setValve: (zone, open) => {
    const state = get();
    const zones = state.zones.map(z => z.zone === zone ? { ...z, valve_open: open } : z);
    const msg = `${open ? "Opened" : "Closed"} valve at ${zone}`;
    const alerts = pushAlert(state.alerts, { zone, status: "Valve", message: msg });
    set({ zones, alerts });
  },

  emergencyStop: () => {
    const state = get();
    const zones = state.zones.map(z => ({ ...z, valve_open: false }));
    const alerts = pushAlert(state.alerts, { zone: "System", status: "System", message: "EMERGENCY STOP — all valves closed" });
    set({ zones, alerts, system: { ...state.system, simulation: false } });
  },

  dismissNotification: (id) => set(state => ({ notifications: state.notifications.filter(n => n.id !== id) })),

  loadFromFlask: async () => {
    const state = get();
    try {
      const res = await fetch(`${state.apiBase}/api/zones`, { method: "GET" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: Zone[] = await res.json();
      const zones = data.map(z => ({
        ...z,
        tank_level: z.tank_level ?? 70,
        last_update: z.last_update ?? nowISO(),
        valve_open: z.valve_open ?? true,
      }));
      set({ zones, system: { ...state.system, database: "Connected", network: "Online", source: "Flask" } });
    } catch {
      set({ system: { ...state.system, network: "Error", source: "Simulation" } });
    }
  },
}));
