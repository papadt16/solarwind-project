"use client";

import { BatteryCharging, PlugZap, SunMedium, Wind } from "lucide-react";
import { AnalyticsChart } from "@/components/analytics-chart";
import { CircularGauge } from "@/components/circular-gauge";
import { MetricCard } from "@/components/metric-card";
import { PowerFlow } from "@/components/power-flow";
import { formatNumber, type HistoryPoint, type TelemetrySnapshot } from "@/lib/telemetry";

type DashboardOverviewProps = {
  snapshot: TelemetrySnapshot;
  history: HistoryPoint[];
};

export function DashboardOverview({ snapshot, history }: DashboardOverviewProps) {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={SunMedium} label="Solar Power" value={formatNumber(snapshot.solarWatts, 1)} unit="W" tone="solar" />
        <MetricCard icon={Wind} label="Wind Power" value={formatNumber(snapshot.windWatts, 1)} unit="W" tone="wind" delay={0.05} />
        <MetricCard icon={BatteryCharging} label="Battery Percentage" value={formatNumber(snapshot.batteryPercent, 0)} unit="%" tone="battery" delay={0.1} />
        <MetricCard icon={PlugZap} label="Load Status" value={snapshot.loadOn ? "ON" : "OFF"} tone="load" delay={0.15} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.8fr)]">
        <PowerFlow snapshot={snapshot} />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <CircularGauge label="Solar Voltage" value={snapshot.solarVolts} max={25} unit="V" accent="#fbbf24" delay={0.2} />
          <CircularGauge label="Wind Voltage" value={snapshot.windVolts} max={25} unit="V" accent="#38bdf8" delay={0.25} />
        </div>
      </section>

      <AnalyticsChart history={history} />
    </div>
  );
}
