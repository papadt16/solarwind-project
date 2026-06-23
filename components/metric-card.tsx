"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

type MetricCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  unit?: string;
  tone: "solar" | "wind" | "battery" | "load";
  delay?: number;
};

const toneMap = {
  solar: "from-amber-300/20 to-amber-500/5 text-amber-200 shadow-amber-500/10",
  wind: "from-sky-300/20 to-sky-500/5 text-sky-200 shadow-sky-500/10",
  battery: "from-teal-300/20 to-emerald-500/5 text-teal-200 shadow-teal-500/10",
  load: "from-violet-300/20 to-fuchsia-500/5 text-violet-200 shadow-violet-500/10"
};

export function MetricCard({ icon: Icon, label, value, unit, tone, delay = 0 }: MetricCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`metric-depth rounded-lg border border-white/10 bg-gradient-to-br ${toneMap[tone]} p-4`}
    >
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-300">{label}</p>
          <div className="mt-4 flex items-end gap-2">
            <span className="text-3xl font-semibold leading-none text-white sm:text-4xl">{value}</span>
            {unit && <span className="pb-1 text-sm font-medium text-slate-300">{unit}</span>}
          </div>
        </div>
        <div className="grid size-11 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.07]">
          <Icon className="size-5" />
        </div>
      </div>
    </motion.article>
  );
}

