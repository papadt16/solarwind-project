import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SolarWind Command",
  description: "IoT smart solar-wind power generation dashboard for ESP32 telemetry over MQTT."
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#03130f"
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}


