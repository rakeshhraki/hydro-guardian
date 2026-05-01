import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import { useHydroStore, PIPELINES } from "@/lib/store";
import { statusMeta } from "@/lib/status";

function makeIcon(hex: string, pulse: boolean) {
  const html = `
    <div style="position:relative;width:28px;height:28px;display:grid;place-items:center;">
      ${pulse ? `<div style="position:absolute;inset:-6px;border-radius:9999px;background:${hex};opacity:0.25;animation:pulse-ring 1.6s infinite"></div>` : ""}
      <div style="width:18px;height:18px;border-radius:9999px;background:${hex};border:3px solid #0b1a2c;box-shadow:0 0 0 2px ${hex}55"></div>
    </div>`;
  return L.divIcon({ html, className: "", iconSize: [28, 28], iconAnchor: [14, 14] });
}

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    const b = L.latLngBounds(points);
    map.fitBounds(b, { padding: [40, 40] });
  }, [map, points]);
  return null;
}

export function PipelineMap({ height = 460 }: { height?: number }) {
  const zones = useHydroStore(s => s.zones);
  const ref = useRef<L.Map | null>(null);
  const points = zones.map(z => [z.latitude, z.longitude] as [number, number]);

  return (
    <div className="rounded-[var(--radius-lg)] overflow-hidden border border-border" style={{ height }}>
      <MapContainer
        ref={(m) => { ref.current = m; }}
        center={[12.9716, 77.5946]}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
          opacity={0.7}
        />
        <FitBounds points={points} />

        {PIPELINES.map(([a, b], i) => {
          const za = zones.find(z => z.zone === a);
          const zb = zones.find(z => z.zone === b);
          if (!za || !zb) return null;
          const flowing = (za.valve_open ?? true) && (zb.valve_open ?? true);
          const color = !flowing ? "#94a3b8" : (zb.status !== "Normal" ? statusMeta(zb.status).hex : "#22d3ee");
          return (
            <Polyline
              key={i}
              positions={[[za.latitude, za.longitude], [zb.latitude, zb.longitude]]}
              pathOptions={{ color, weight: 4, opacity: 0.9, dashArray: flowing ? "8 8" : "2 6", className: flowing ? "flow-line" : "" }}
            />
          );
        })}

        {zones.map(z => {
          const m = statusMeta(z.status);
          return (
            <Marker key={z.zone} position={[z.latitude, z.longitude]} icon={makeIcon(m.hex, z.status !== "Normal")}>
              <Popup>
                <div className="text-xs">
                  <div className="font-display font-semibold text-sm mb-1">{z.zone}</div>
                  <div>Status: <span style={{ color: m.hex, fontWeight: 600 }}>{z.status}</span></div>
                  <div>Current: {z.current_usage}L / {z.normal_usage}L</div>
                  <div>Tank: {z.tank_level}%</div>
                  <div>Valve: {z.valve_open ? "Open" : "Closed"}</div>
                  <div>Lat/Lng: {z.latitude.toFixed(4)}, {z.longitude.toFixed(4)}</div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      <style>{`
        .flow-line { animation: flow-dash 1.2s linear infinite; stroke-dashoffset: 0; }
      `}</style>
    </div>
  );
}
