"use client";

import { Clock3, RadioTower, WifiOff } from "lucide-react";
import { type BrokerStatus, type TelemetrySnapshot, getSystemStatus } from "@/lib/telemetry";

type StatusHeaderProps = {
  clock: string;
  snapshot: TelemetrySnapshot;
  status: BrokerStatus;
  lastUpdated: Date | null;
  error: string | null;
};

export function StatusHeader({ clock, snapshot, status, lastUpdated, error }: StatusHeaderProps) {
  const system = getSystemStatus(snapshot, status);
  const syncing = status === "reconnecting" || status === "offline" || status === "connecting";

  return (
    <header className="mb-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-teal-200">IoT Smart Solar-Wind Power Generation</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Power Operations Dashboard</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-11 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.05] px-3 text-sm text-slate-200 backdrop-blur-xl">
            <Clock3 className="size-4 text-sky-200" />
            <span>{clock}</span>
          </div>
          <div className={`flex h-11 items-center gap-2 rounded-lg border px-3 text-sm font-medium ${system.tone}`}>
            {status === "connected" ? <RadioTower className="size-4" /> : <WifiOff className="size-4" />}
            <span>Status: {system.label}</span>
          </div>
        </div>
      </div>

      {syncing && (
        <div className="mt-4 rounded-lg border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
          Reconnecting to Broker...
        </div>
      )}

      {error && (
        <div className="mt-3 rounded-lg border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      )}

      {lastUpdated && (
        <p className="mt-3 text-xs text-slate-500">Last telemetry update: {lastUpdated.toLocaleString()}</p>
      )}
    </header>
  );
}
