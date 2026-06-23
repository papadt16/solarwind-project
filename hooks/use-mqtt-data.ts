"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MqttClient } from "mqtt";
import {
  DEFAULT_SNAPSHOT,
  type BrokerStatus,
  type HistoryPoint,
  type TelemetrySnapshot,
  makeHistoryPoint,
  normalizeTelemetry,
  trimHistory
} from "@/lib/telemetry";

type UseMQTTConfig = {
  brokerUrl?: string;
  telemetryTopic?: string;
  commandTopic?: string;
  username?: string;
  password?: string;
};

const HISTORY_KEY = "solarwind.telemetry.history";
const DEFAULT_BROKER = "wss://broker.hivemq.com:8884/mqtt";
const DEFAULT_TELEMETRY_TOPIC = "solarwind/dashboard/metrics";
const DEFAULT_COMMAND_TOPIC = "solarwind/dashboard/commands";

export function useMQTTData(config: UseMQTTConfig = {}) {
  const brokerUrl = config.brokerUrl ?? process.env.NEXT_PUBLIC_MQTT_BROKER_URL ?? DEFAULT_BROKER;
  const telemetryTopic = config.telemetryTopic ?? process.env.NEXT_PUBLIC_MQTT_TELEMETRY_TOPIC ?? DEFAULT_TELEMETRY_TOPIC;
  const commandTopic = config.commandTopic ?? process.env.NEXT_PUBLIC_MQTT_COMMAND_TOPIC ?? DEFAULT_COMMAND_TOPIC;
  const username = config.username ?? process.env.NEXT_PUBLIC_MQTT_USERNAME;
  const password = config.password ?? process.env.NEXT_PUBLIC_MQTT_PASSWORD;

  const clientRef = useRef<MqttClient | null>(null);
  const [snapshot, setSnapshot] = useState<TelemetrySnapshot>(DEFAULT_SNAPSHOT);
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [status, setStatus] = useState<BrokerStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(HISTORY_KEY);

      if (stored) {
        setHistory(trimHistory(JSON.parse(stored)));
      }
    } catch {
      window.localStorage.removeItem(HISTORY_KEY);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    let closing = false;

    async function connectToBroker() {
      setStatus("connecting");
      setError(null);

      try {
        const mqtt = await import("mqtt");

        if (cancelled) {
          return;
        }

        const client = mqtt.connect(brokerUrl, {
          clean: true,
          clientId: `solarwind-web-${Math.random().toString(16).slice(2)}`,
          connectTimeout: 8000,
          keepalive: 30,
          password,
          reconnectPeriod: 3000,
          username
        }) as MqttClient;

        clientRef.current = client;

        client.on("connect", () => {
          if (cancelled) {
            return;
          }

          setStatus("connected");
          setError(null);
          client.subscribe(telemetryTopic, (subscribeError?: Error) => {
            if (subscribeError) {
              setStatus("error");
              setError(subscribeError.message);
            }
          });
        });

        client.on("reconnect", () => {
          if (!closing) {
            setStatus("reconnecting");
          }
        });

        client.on("offline", () => {
          if (!closing) {
            setStatus("offline");
          }
        });

        client.on("close", () => {
          if (!closing) {
            setStatus("reconnecting");
          }
        });

        client.on("error", (mqttError: Error) => {
          if (!closing) {
            setStatus("error");
            setError(mqttError.message);
          }
        });

        client.on("message", (_topic: string, payload: Uint8Array) => {
          try {
            const parsed = JSON.parse(new TextDecoder().decode(payload));
            const nextSnapshot = normalizeTelemetry(parsed);
            const nextPoint = makeHistoryPoint(nextSnapshot);

            setSnapshot(nextSnapshot);
            setLastUpdated(new Date());
            setError(null);
            setHistory((current) => {
              const nextHistory = trimHistory([...current, nextPoint]);
              window.localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
              return nextHistory;
            });
          } catch (parseError) {
            setError(parseError instanceof Error ? parseError.message : "Invalid telemetry payload");
          }
        });
      } catch (loadError) {
        setStatus("error");
        setError(loadError instanceof Error ? loadError.message : "Unable to load MQTT client");
      }
    }

    void connectToBroker();

    return () => {
      cancelled = true;
      closing = true;
      clientRef.current?.end(true);
      clientRef.current = null;
    };
  }, [brokerUrl, password, telemetryTopic, username]);

  const publishCommand = useCallback(
    (command: string, value: unknown) => {
      const client = clientRef.current;

      if (!client?.connected) {
        setError("MQTT broker is not connected");
        return false;
      }

      client.publish(
        commandTopic,
        JSON.stringify({
          command,
          value,
          timestamp: new Date().toISOString()
        }),
        { qos: 1 }
      );

      return true;
    },
    [commandTopic]
  );

  return useMemo(
    () => ({
      brokerUrl,
      commandTopic,
      error,
      history,
      lastUpdated,
      publishCommand,
      snapshot,
      status,
      telemetryTopic
    }),
    [brokerUrl, commandTopic, error, history, lastUpdated, publishCommand, snapshot, status, telemetryTopic]
  );
}


