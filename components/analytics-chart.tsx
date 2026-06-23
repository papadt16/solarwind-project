"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { HistoryPoint } from "@/lib/telemetry";

type AnalyticsChartProps = {
  history: HistoryPoint[];
  tall?: boolean;
};

export function AnalyticsChart({ history, tall = false }: AnalyticsChartProps) {
  return (
    <section className="glass-panel rounded-lg p-5">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-sky-200">Analytics</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Generation vs Consumption</h2>
        </div>
        <div className="flex gap-2 text-xs">
          <span className="rounded-lg border border-teal-300/20 bg-teal-300/10 px-3 py-2 text-teal-100">Generation</span>
          <span className="rounded-lg border border-violet-300/20 bg-violet-300/10 px-3 py-2 text-violet-100">Consumption</span>
        </div>
      </div>

      <div className={tall ? "h-[430px]" : "h-[320px]"}>
        {history.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history} margin={{ left: -14, right: 10, top: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="generationGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.42} />
                  <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="consumptionGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.34} />
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
              <XAxis dataKey="time" minTickGap={32} stroke="#94a3b8" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} unit="W" />
              <Tooltip
                contentStyle={{
                  background: "rgba(2, 6, 23, 0.92)",
                  border: "1px solid rgba(148, 163, 184, 0.18)",
                  borderRadius: 8,
                  color: "#f8fafc"
                }}
                labelStyle={{ color: "#bae6fd" }}
              />
              <Area type="monotone" dataKey="generation" name="Generation" stroke="#2dd4bf" strokeWidth={3} fill="url(#generationGradient)" />
              <Area type="monotone" dataKey="consumption" name="Consumption" stroke="#a78bfa" strokeWidth={3} fill="url(#consumptionGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="grid h-full place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-center">
            <div>
              <p className="text-lg font-semibold text-white">Waiting for telemetry history</p>
              <p className="mt-2 text-sm text-slate-400">The chart fills as MQTT payloads arrive.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
