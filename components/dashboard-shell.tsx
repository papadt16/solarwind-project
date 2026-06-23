"use client";

import { useEffect, useState } from "react";
import { DashboardOverview } from "@/components/dashboard-overview";
import { AnalyticsPanel, BatteryPanel, ControlsPanel, SettingsPanel } from "@/components/detail-panels";
import { MobileNav } from "@/components/mobile-nav";
import { NatureBackdrop } from "@/components/nature-backdrop";
import { type DashboardView, Sidebar } from "@/components/sidebar";
import { StatusHeader } from "@/components/status-header";
import { useMQTTData } from "@/hooks/use-mqtt-data";

export function DashboardShell() {
  const [activeView, setActiveView] = useState<DashboardView>("dashboard");
  const [clock, setClock] = useState("");
  const telemetry = useMQTTData();

  useEffect(() => {
    function syncClock() {
      setClock(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        })
      );
    }

    syncClock();
    const timer = window.setInterval(syncClock, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="relative min-h-screen">
      <NatureBackdrop />
      <div className="relative z-10 flex min-h-screen">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        <div className="min-w-0 flex-1 px-4 pb-24 pt-5 sm:px-5 md:px-7 md:pb-8 xl:px-9">
          <StatusHeader
            clock={clock}
            error={telemetry.error}
            lastUpdated={telemetry.lastUpdated}
            snapshot={telemetry.snapshot}
            status={telemetry.status}
          />

          {activeView === "dashboard" && <DashboardOverview history={telemetry.history} snapshot={telemetry.snapshot} />}
          {activeView === "analytics" && <AnalyticsPanel history={telemetry.history} />}
          {activeView === "battery" && <BatteryPanel snapshot={telemetry.snapshot} />}
          {activeView === "controls" && (
            <ControlsPanel connected={telemetry.status === "connected"} publishCommand={telemetry.publishCommand} />
          )}
          {activeView === "settings" && (
            <SettingsPanel
              brokerUrl={telemetry.brokerUrl}
              commandTopic={telemetry.commandTopic}
              telemetryTopic={telemetry.telemetryTopic}
            />
          )}
        </div>
      </div>
      <MobileNav activeView={activeView} onViewChange={setActiveView} />
    </main>
  );
}
