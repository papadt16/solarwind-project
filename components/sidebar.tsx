"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  BatteryCharging,
  Home,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  SlidersHorizontal,
  SunMedium,
  type LucideIcon
} from "lucide-react";

export type DashboardView = "dashboard" | "analytics" | "battery" | "controls" | "settings";

type SidebarProps = {
  activeView: DashboardView;
  onViewChange: (view: DashboardView) => void;
};

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "analytics", label: "Analytics", icon: Activity },
  { id: "battery", label: "Battery Health", icon: BatteryCharging },
  { id: "controls", label: "System Controls", icon: SlidersHorizontal },
  { id: "settings", label: "Settings", icon: Settings }
] satisfies Array<{ id: DashboardView; label: string; icon: LucideIcon }>;

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={{ x: -18, opacity: 0 }}
      animate={{ x: 0, opacity: 1, width: collapsed ? 84 : 264 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-20 hidden h-screen shrink-0 border-r border-white/10 bg-slate-950/45 p-4 backdrop-blur-2xl md:block"
    >
      <div className="flex h-full flex-col">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid size-11 shrink-0 place-items-center rounded-lg border border-amber-300/30 bg-amber-300/10 text-amber-200 shadow-lg shadow-amber-500/10">
              <SunMedium className="size-5" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-white">SolarWind</p>
                <p className="truncate text-xs text-slate-400">Power Generation</p>
              </div>
            )}
          </div>
          <button
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setCollapsed((value) => !value)}
            className="grid size-9 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-300 transition hover:border-teal-300/40 hover:text-teal-100"
          >
            {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
          </button>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.id === activeView;

            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`group flex h-12 w-full items-center gap-3 rounded-lg border px-3 text-left text-sm font-medium transition ${
                  active
                    ? "status-glow border-teal-300/40 bg-teal-300/10 text-teal-100"
                    : "border-transparent bg-transparent text-slate-400 hover:border-white/10 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                <Icon className={`size-5 shrink-0 ${active ? "text-teal-200" : "text-slate-500 group-hover:text-slate-200"}`} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto rounded-lg border border-white/10 bg-white/[0.04] p-3">
          <div className="h-2 rounded-lg bg-slate-800">
            <div className="h-full w-2/3 rounded-lg bg-gradient-to-r from-amber-300 to-teal-300" />
          </div>
          {!collapsed && (
            <div className="mt-3">
              <p className="text-xs font-medium text-slate-200">Hybrid Bus</p>
              <p className="mt-1 text-xs text-slate-400">Solar, wind, battery, load</p>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}



