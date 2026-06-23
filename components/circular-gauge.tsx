"use client";

import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import { formatNumber } from "@/lib/telemetry";

type CircularGaugeProps = {
  label: string;
  value: number;
  max: number;
  unit: string;
  accent: string;
  delay?: number;
};

export function CircularGauge({ label, value, max, unit, accent, delay = 0 }: CircularGaugeProps) {
  const percent = Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel grid min-h-[260px] place-items-center rounded-lg p-5"
    >
      <div
        className="gauge-face"
        style={
          {
            "--gauge-angle": `${percent * 3.6}deg`,
            "--gauge-accent": accent
          } as CSSProperties
        }
      >
        <div className="relative z-10 text-center">
          <p className="text-3xl font-semibold text-white">{formatNumber(value, 1)}</p>
          <p className="text-xs font-medium uppercase text-slate-400">{unit}</p>
        </div>
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="mt-1 text-xs text-slate-400">0-{max} {unit}</p>
      </div>
    </motion.div>
  );
}


