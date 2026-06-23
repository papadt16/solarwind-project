"use client";

import { Activity, BatteryCharging, Home, Settings, SlidersHorizontal, type LucideIcon } from "lucide-react";
import type { DashboardView } from "@/components/sidebar";

type MobileNavProps = {
  activeView: DashboardView;
  onViewChange: (view: DashboardView) => void;
};

const navItems = [
  { id: "dashboard", label: "Home", icon: Home },
  { id: "analytics", label: "Analytics", icon: Activity },
  { id: "battery", label: "Battery", icon: BatteryCharging },
  { id: "controls", label: "Controls", icon: SlidersHorizontal },
  { id: "settings", label: "Settings", icon: Settings }
] satisfies Array<{ id: DashboardView; label: string; icon: LucideIcon }>;

export function MobileNav({ activeView, onViewChange }: MobileNavProps) {
  return (
    <nav className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-5 rounded-lg border border-white/10 bg-slate-950/80 p-1.5 shadow-2xl shadow-black/40 backdrop-blur-2xl md:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = activeView === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            aria-label={item.label}
            className={`grid h-12 place-items-center rounded-lg transition ${
              active ? "bg-teal-300/15 text-teal-100" : "text-slate-500 hover:bg-white/[0.05] hover:text-slate-200"
            }`}
          >
            <Icon className="size-5" />
          </button>
        );
      })}
    </nav>
  );
}

