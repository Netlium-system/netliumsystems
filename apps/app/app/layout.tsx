import React from "react";
import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./global.css";

const interSans = Inter({
  subsets: ["latin"],
  variable: "--font-inter-sans",
  display: "swap"
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Netlium Dashboard | Institutional Capital Operations",
  description: "Institutional capital operations dashboard"
};

export default function RootLayout({
  children
}: {
  readonly children: React.ReactNode;
}): React.ReactElement {
  return (
    <html lang="en" className={`${interSans.variable} ${ibmPlexMono.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
