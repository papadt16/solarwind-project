"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BatteryCharging, Loader2, LockKeyhole, ShieldCheck, SunMedium, Wind } from "lucide-react";

export function LoginCard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    window.setTimeout(() => {
      router.push("/dashboard");
    }, 700);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel relative z-10 w-full max-w-md rounded-lg p-6 sm:p-8"
    >
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-lg border border-amber-300/30 bg-amber-300/10 text-amber-200 shadow-lg shadow-amber-500/10">
            <SunMedium className="size-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white">SolarWind Command</h1>
            <p className="mt-1 text-sm text-slate-300">Hybrid power dashboard</p>
          </div>
        </div>
        <div className="flex gap-2 text-teal-200">
          <Wind className="size-5" />
          <BatteryCharging className="size-5" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">Admin ID</span>
          <input
            className="glass-input h-12 w-full rounded-lg px-4 text-white outline-none transition focus:border-teal-300/60 focus:ring-4 focus:ring-teal-300/10"
            name="adminId"
            placeholder="admin@solarwind"
            autoComplete="username"
            required
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">Password</span>
          <input
            className="glass-input h-12 w-full rounded-lg px-4 text-white outline-none transition focus:border-amber-300/60 focus:ring-4 focus:ring-amber-300/10"
            name="password"
            placeholder="Enter password"
            type="password"
            autoComplete="current-password"
            required
          />
        </label>

        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          disabled={isLoading}
          className="group relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-amber-300 via-teal-300 to-sky-400 px-4 font-semibold text-slate-950 shadow-xl shadow-teal-500/20 transition disabled:cursor-wait disabled:opacity-80"
        >
          <span className="absolute inset-0 translate-x-[-110%] bg-white/35 transition duration-700 group-hover:translate-x-[110%]" />
          {isLoading ? <Loader2 className="relative size-5 animate-spin" /> : <ShieldCheck className="relative size-5" />}
          <span className="relative">{isLoading ? "Authenticating" : "Enter Dashboard"}</span>
        </motion.button>
      </form>

      <div className="mt-7 flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3 text-sm text-slate-300">
        <LockKeyhole className="size-4 text-teal-200" />
        <span>ESP32 telemetry is received through MQTT over WebSockets.</span>
      </div>
    </motion.div>
  );
}
