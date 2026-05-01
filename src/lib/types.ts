export type ZoneStatus = "Normal" | "Leak Detected" | "Over Consumption" | "Unequal Distribution";

export interface Zone {
  zone: string;
  normal_usage: number;
  current_usage: number;
  status: ZoneStatus;
  latitude: number;
  longitude: number;
  tank_level: number; // 0-100
  last_update: string;
  acknowledged?: boolean;
  valve_open?: boolean;
}

export interface AlertEntry {
  id: string;
  time: string;
  zone: string;
  status: ZoneStatus | "Transfer" | "Valve" | "System";
  message: string;
  acknowledged: boolean;
}

export interface TransferRecommendation {
  from: string;
  to: string;
  liters: number;
}

export interface SystemStatus {
  database: "Connected" | "Error";
  sensors: "Active" | "Error";
  network: "Online" | "Error";
  simulation: boolean;
  source: "Simulation" | "Flask";
}

export interface UsagePoint {
  t: number; // ms
  total: number;
  [zone: string]: number;
}
