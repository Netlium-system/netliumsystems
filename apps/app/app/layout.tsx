import React from "react";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import "./global.css";

export const metadata: Metadata = {
  title: "Neptlium | Institutional Capital Operating System",
  description: "Institutional capital operations platform"
};

export const dynamic = "force-dynamic";

const fontVariables: CSSProperties & Record<"--font-inter-sans" | "--font-ibm-plex-mono", string> = {
  // Use local font stacks so builds do not depend on external Google Fonts requests.
  "--font-inter-sans": "Inter, ui-sans-serif, system-ui, sans-serif",
  "--font-ibm-plex-mono": '"IBM Plex Mono", ui-monospace, "SFMono-Regular", monospace'
};

export default function RootLayout({
  children
}: {
  readonly children: React.ReactNode;
}): React.ReactElement {
  return (
    <html lang="en" style={fontVariables}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
