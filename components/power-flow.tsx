"use client";

import { motion } from "framer-motion";
import { BatteryCharging, PlugZap, SunMedium, Wind, type LucideIcon } from "lucide-react";
import { formatNumber, type TelemetrySnapshot } from "@/lib/telemetry";

type PowerFlowProps = {
  snapshot: TelemetrySnapshot;
};

export function PowerFlow({ snapshot }: PowerFlowProps) {
  const duration = Math.max(0.75, 3 - Math.min(snapshot.generatedWatts, 55) / 24);

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.16, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel relative min-h-[360px] overflow-hidden rounded-lg p-5"
    >
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-teal-200">Live Power Flow</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Hybrid Energy Bus</h2>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-right">
          <p className="text-xs text-slate-400">Generation</p>
          <p className="text-lg font-semibold text-white">{formatNumber(snapshot.generatedWatts, 1)} W</p>
        </div>
      </div>

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 840 380" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="solarFlow" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.2" />
            <stop offset="60%" stopColor="#fbbf24" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="windFlow" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.2" />
            <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="loadFlow" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        <path d="M 155 128 C 290 120 330 160 412 190" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
        <path d="M 155 272 C 290 278 328 222 412 190" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
        <path d="M 488 190 C 580 190 634 190 720 190" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
        <motion.path
          className="energy-path"
          d="M 155 128 C 290 120 330 160 412 190"
          fill="none"
          stroke="url(#solarFlow)"
          strokeDasharray="18 26"
          strokeLinecap="round"
          strokeWidth="5"
          animate={{ strokeDashoffset: [90, 0] }}
          transition={{ duration, repeat: Infinity, ease: "linear" }}
        />
        <motion.path
          className="energy-path"
          d="M 155 272 C 290 278 328 222 412 190"
          fill="none"
          stroke="url(#windFlow)"
          strokeDasharray="18 26"
          strokeLinecap="round"
          strokeWidth="5"
          animate={{ strokeDashoffset: [90, 0] }}
          transition={{ duration: duration + 0.35, repeat: Infinity, ease: "linear" }}
        />
        <motion.path
          className="energy-path"
          d="M 488 190 C 580 190 634 190 720 190"
          fill="none"
          stroke="url(#loadFlow)"
          strokeDasharray="18 26"
          strokeLinecap="round"
          strokeWidth="5"
          animate={{ strokeDashoffset: [90, 0] }}
          transition={{ duration: snapshot.loadOn ? duration : 4, repeat: Infinity, ease: "linear" }}
        />
      </svg>

      <div className="relative z-10 mt-12 grid min-h-[230px] grid-cols-2 items-center gap-4 sm:grid-cols-[1fr_1.1fr_1fr]">
        <div className="grid gap-5">
          <EnergyNode icon={SunMedium} label="Solar" value={`${formatNumber(snapshot.solarWatts, 1)} W`} tone="text-amber-200" />
          <EnergyNode icon={Wind} label="Wind" value={`${formatNumber(snapshot.windWatts, 1)} W`} tone="text-sky-200" />
        </div>

        <div className="col-span-2 grid place-items-center sm:col-span-1">
          <div className="energy-node grid size-32 place-items-center rounded-lg border border-teal-300/25 bg-teal-300/10 text-teal-100 sm:size-40">
            <BatteryCharging className="size-11" />
            <div className="text-center">
              <p className="text-3xl font-semibold">{formatNumber(snapshot.batteryPercent, 0)}%</p>
              <p className="text-xs text-teal-100/70">{formatNumber(snapshot.batteryVolts, 1)} V</p>
            </div>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1">
          <EnergyNode
            icon={PlugZap}
            label="Load"
            value={snapshot.loadOn ? `${formatNumber(snapshot.consumedWatts, 1)} W` : "OFF"}
            tone="text-violet-200"
          />
        </div>
      </div>
    </motion.section>
  );
}

function EnergyNode({
  icon: Icon,
  label,
  value,
  tone
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="energy-node rounded-lg border border-white/10 bg-white/[0.06] p-4">
      <div className="flex items-center gap-3">
        <div className={`grid size-11 place-items-center rounded-lg border border-white/10 bg-white/[0.06] ${tone}`}>
          <Icon className="size-5" />
        </div>
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="text-lg font-semibold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}

