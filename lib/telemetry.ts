export type BrokerStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "offline"
  | "error";

export type RawTelemetry = Record<string, unknown>;

export type TelemetrySnapshot = {
  solarVolts: number;
  windVolts: number;
  batteryVolts: number;
  loadCurrent: number;
  temp: number;
  humidity: number;
  windSpeed: number;
  solarWatts: number;
  windWatts: number;
  batteryPercent: number;
  loadWatts: number;
  generatedWatts: number;
  consumedWatts: number;
  loadOn: boolean;
};

export type HistoryPoint = {
  timestamp: number;
  time: string;
  generation: number;
  consumption: number;
  batteryPercent: number;
  solarWatts: number;
  windWatts: number;
};

export const DEFAULT_SNAPSHOT: TelemetrySnapshot = {
  solarVolts: 0,
  windVolts: 0,
  batteryVolts: 0,
  loadCurrent: 0,
  temp: 0,
  humidity: 0,
  windSpeed: 0,
  solarWatts: 0,
  windWatts: 0,
  batteryPercent: 0,
  loadWatts: 0,
  generatedWatts: 0,
  consumedWatts: 0,
  loadOn: false
};

const DAY_MS = 24 * 60 * 60 * 1000;

export function normalizeTelemetry(input: RawTelemetry): TelemetrySnapshot {
  const solarVolts = readNumber(input, ["solarVolts", "solarVoltage", "solar_v", "solar_voltage"]);
  const windVolts = readNumber(input, ["windVolts", "windVoltage", "wind_v", "wind_voltage"]);
  const batteryVolts = readNumber(input, ["batteryVolts", "batteryVoltage", "battery_v", "battery_voltage"]);
  const loadCurrent = readNumber(input, ["loadCurrent", "loadAmps", "load_current", "current"]);
  const temp = readNumber(input, ["temp", "temperature", "temperatureC"]);
  const humidity = readNumber(input, ["humidity", "humidityPercent"]);
  const windSpeed = readNumber(input, ["windSpeed", "wind_speed", "anemometerMps"]);

  const batteryPercent = clamp(
    readNumber(input, ["batteryPercent", "batteryPercentage", "soc"], leadAcidPercent(batteryVolts)),
    0,
    100
  );

  const solarWatts = clamp(
    readNumber(input, ["solarWatts", "solarPower", "solar_watts"], solarVolts > 0 ? solarVolts * 1.18 : 0),
    0,
    80
  );

  const windWatts = clamp(
    readNumber(input, ["windWatts", "windPower", "wind_watts"], windVolts > 0 ? windVolts * Math.max(windSpeed, 1) * 0.18 : 0),
    0,
    80
  );

  const loadWatts = clamp(
    readNumber(input, ["loadWatts", "loadPower", "consumption"], batteryVolts * loadCurrent),
    0,
    180
  );

  const loadOn = readBoolean(input, ["loadOn", "loadStatus", "relayOn"], loadCurrent > 0.08);

  return {
    solarVolts,
    windVolts,
    batteryVolts,
    loadCurrent,
    temp,
    humidity,
    windSpeed,
    solarWatts,
    windWatts,
    batteryPercent,
    loadWatts,
    generatedWatts: solarWatts + windWatts,
    consumedWatts: loadWatts,
    loadOn
  };
}

export function makeHistoryPoint(snapshot: TelemetrySnapshot, date = new Date()): HistoryPoint {
  return {
    timestamp: date.getTime(),
    time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    generation: round(snapshot.generatedWatts, 1),
    consumption: round(snapshot.consumedWatts, 1),
    batteryPercent: round(snapshot.batteryPercent, 1),
    solarWatts: round(snapshot.solarWatts, 1),
    windWatts: round(snapshot.windWatts, 1)
  };
}

export function trimHistory(history: HistoryPoint[], now = Date.now()) {
  return history
    .filter((point) => Number.isFinite(point.timestamp) && point.timestamp >= now - DAY_MS)
    .slice(-720);
}

export function getSystemStatus(snapshot: TelemetrySnapshot, status: BrokerStatus) {
  if (status === "reconnecting" || status === "offline") {
    return { label: "Reconnecting", tone: "text-amber-200 border-amber-300/30 bg-amber-400/10" };
  }

  if (status === "error") {
    return { label: "Broker Error", tone: "text-rose-200 border-rose-300/30 bg-rose-400/10" };
  }

  if (snapshot.batteryPercent > 0 && snapshot.batteryPercent < 22) {
    return { label: "Low Battery", tone: "text-rose-200 border-rose-300/30 bg-rose-400/10" };
  }

  if (snapshot.loadCurrent > 4) {
    return { label: "High Load", tone: "text-amber-200 border-amber-300/30 bg-amber-400/10" };
  }

  if (status === "connected") {
    return { label: "Optimal", tone: "text-teal-100 border-teal-300/30 bg-teal-400/10" };
  }

  return { label: "Waiting", tone: "text-slate-200 border-slate-300/20 bg-slate-400/10" };
}

export function formatNumber(value: number, digits = 1) {
  if (!Number.isFinite(value)) {
    return "0";
  }

  return value.toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: value % 1 === 0 ? 0 : digits
  });
}

function readNumber(input: RawTelemetry, keys: string[], fallback = 0) {
  for (const key of keys) {
    const value = input[key];

    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string" && value.trim() !== "") {
      const parsed = Number(value);

      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  return fallback;
}

function readBoolean(input: RawTelemetry, keys: string[], fallback = false) {
  for (const key of keys) {
    const value = input[key];

    if (typeof value === "boolean") {
      return value;
    }

    if (typeof value === "string") {
      return ["true", "on", "1", "enabled"].includes(value.toLowerCase());
    }

    if (typeof value === "number") {
      return value > 0;
    }
  }

  return fallback;
}

function leadAcidPercent(volts: number) {
  if (!Number.isFinite(volts) || volts <= 0) {
    return 0;
  }

  return ((volts - 10.8) / (12.8 - 10.8)) * 100;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
}

function round(value: number, digits = 1) {
  const scale = 10 ** digits;
  return Math.round(value * scale) / scale;
}
