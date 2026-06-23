"use client";

import { motion } from "framer-motion";
import { BatteryWarning, Fan, Gauge, Power, ShieldAlert, ThermometerSun, Waves, Zap, type LucideIcon } from "lucide-react";
import { AnalyticsChart } from "@/components/analytics-chart";
import { formatNumber, type HistoryPoint, type TelemetrySnapshot } from "@/lib/telemetry";

type AnalyticsPanelProps = {
  history: HistoryPoint[];
};

type BatteryPanelProps = {
  snapshot: TelemetrySnapshot;
};

type ControlsPanelProps = {
  connected: boolean;
  publishCommand: (command: string, value: unknown) => boolean;
};

type SettingsPanelProps = {
  brokerUrl: string;
  telemetryTopic: string;
  commandTopic: string;
};

export function AnalyticsPanel({ history }: AnalyticsPanelProps) {
  return (
    <div className="space-y-4">
      <AnalyticsChart history={history} tall />
      <div className="grid gap-4 md:grid-cols-3">
        <SmallPanel icon={Gauge} label="Samples" value={history.length.toString()} />
        <SmallPanel icon={Zap} label="Peak Generation" value={`${formatNumber(Math.max(0, ...history.map((item) => item.generation)), 1)} W`} />
        <SmallPanel icon={Power} label="Peak Consumption" value={`${formatNumber(Math.max(0, ...history.map((item) => item.consumption)), 1)} W`} />
      </div>
    </div>
  );
}

export function BatteryPanel({ snapshot }: BatteryPanelProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-lg p-5"
      >
        <p className="text-sm font-medium text-teal-200">Battery Health</p>
        <h2 className="mt-2 text-2xl font-semibold text-white">12V SLA Storage</h2>
        <div className="mt-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-5xl font-semibold text-white">{formatNumber(snapshot.batteryPercent, 0)}%</p>
              <p className="mt-2 text-sm text-slate-400">{formatNumber(snapshot.batteryVolts, 2)} V battery bus</p>
            </div>
            <BatteryWarning className="size-12 text-amber-200" />
          </div>
          <div className="mt-7 h-4 overflow-hidden rounded-lg bg-slate-900/80">
            <div
              className="h-full rounded-lg bg-gradient-to-r from-rose-400 via-amber-300 to-teal-300 transition-all duration-700"
              style={{ width: `${Math.max(0, Math.min(100, snapshot.batteryPercent))}%` }}
            />
          </div>
        </div>
      </motion.section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <SmallPanel icon={ThermometerSun} label="Ambient Temp" value={`${formatNumber(snapshot.temp, 1)} C`} />
        <SmallPanel icon={Waves} label="Humidity" value={`${formatNumber(snapshot.humidity, 0)}%`} />
        <SmallPanel icon={Fan} label="Wind Speed" value={`${formatNumber(snapshot.windSpeed, 1)} m/s`} />
      </div>
    </div>
  );
}

export function ControlsPanel({ connected, publishCommand }: ControlsPanelProps) {
  const controls = [
    { command: "loadRelay", value: true, label: "Enable Load", icon: Power, tone: "text-teal-100 border-teal-300/25 bg-teal-300/10" },
    { command: "loadRelay", value: false, label: "Disable Load", icon: Power, tone: "text-rose-100 border-rose-300/25 bg-rose-300/10" },
    { command: "mpptMode", value: "auto", label: "Auto MPPT", icon: Zap, tone: "text-amber-100 border-amber-300/25 bg-amber-300/10" },
    { command: "emergencyCutoff", value: true, label: "Cutoff", icon: ShieldAlert, tone: "text-violet-100 border-violet-300/25 bg-violet-300/10" }
  ];

  return (
    <section className="glass-panel rounded-lg p-5">
      <p className="text-sm font-medium text-teal-200">System Controls</p>
      <h2 className="mt-2 text-2xl font-semibold text-white">Relay and MPPT Commands</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {controls.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={`${item.command}-${String(item.value)}`}
              disabled={!connected}
              onClick={() => publishCommand(item.command, item.value)}
              className={`rounded-lg border p-5 text-left transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-45 ${item.tone}`}
            >
              <Icon className="size-6" />
              <p className="mt-5 text-lg font-semibold">{item.label}</p>
              <p className="mt-2 text-sm text-slate-400">MQTT command channel</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function SettingsPanel({ brokerUrl, telemetryTopic, commandTopic }: SettingsPanelProps) {
  const rows = [
    ["Broker", brokerUrl],
    ["Telemetry Topic", telemetryTopic],
    ["Command Topic", commandTopic],
    ["Payload", "{ solarVolts, windVolts, batteryVolts, loadCurrent, temp, humidity, windSpeed }"]
  ];

  return (
    <section className="glass-panel rounded-lg p-5">
      <p className="text-sm font-medium text-sky-200">Settings</p>
      <h2 className="mt-2 text-2xl font-semibold text-white">MQTT Configuration</h2>
      <div className="mt-6 divide-y divide-white/10 rounded-lg border border-white/10">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-2 p-4 md:grid-cols-[180px_1fr]">
            <p className="text-sm font-medium text-slate-300">{label}</p>
            <p className="break-words font-mono text-sm text-teal-100">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SmallPanel({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-lg p-5"
    >
      <div className="grid size-11 place-items-center rounded-lg border border-white/10 bg-white/[0.06] text-teal-200">
        <Icon className="size-5" />
      </div>
      <p className="mt-5 text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </motion.article>
  );
}

