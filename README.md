# SolarWind Command

SolarWind Command is a Next.js App Router dashboard for an IoT smart solar-wind power generation prototype. It is built for Vercel deployment and receives ESP32 telemetry through MQTT over WebSockets.

## Stack

- Next.js App Router
- React
- Tailwind CSS
- Framer Motion
- Lucide React
- Recharts
- mqtt.js over WebSockets

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## MQTT Configuration

The dashboard defaults to HiveMQ's public WebSocket broker:

```txt
wss://broker.hivemq.com:8884/mqtt
```

Default telemetry topic:

```txt
solarwind/dashboard/metrics
```

Set these optional Vercel environment variables for a custom broker:

```txt
NEXT_PUBLIC_MQTT_BROKER_URL=wss://your-cluster-url/mqtt
NEXT_PUBLIC_MQTT_TELEMETRY_TOPIC=solarwind/dashboard/metrics
NEXT_PUBLIC_MQTT_COMMAND_TOPIC=solarwind/dashboard/commands
NEXT_PUBLIC_MQTT_USERNAME=
NEXT_PUBLIC_MQTT_PASSWORD=
```

## ESP32 Telemetry Payload

Publish JSON to the telemetry topic:

```json
{
  "solarVolts": 18.6,
  "windVolts": 11.4,
  "batteryVolts": 12.3,
  "loadCurrent": 1.25,
  "temp": 31.4,
  "humidity": 62,
  "windSpeed": 4.8
}
```

The UI also accepts optional direct fields such as `solarWatts`, `windWatts`, `loadWatts`, `batteryPercent`, and `loadOn` when your ESP32 firmware calculates them.

## Project Structure

- `app/page.tsx` - login page
- `app/dashboard/page.tsx` - dashboard route
- `components/` - sidebar, dashboard grid, gauges, charts, controls, settings
- `hooks/use-mqtt-data.ts` - MQTT client, subscription, command publishing, reconnect state
- `lib/telemetry.ts` - payload normalization, derived metrics, status mapping
