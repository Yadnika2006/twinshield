import type { Metadata } from "next";
import "./globals.css";
import "./dashboard-critical.css";
import "xterm/css/xterm.css";
import NextAuthProvider from "@/components/providers/NextAuthProvider";

export const metadata: Metadata = {
  title: "TwinShield — Digital Twin Cybersecurity Lab",
  description:
    "A live dual-view cybersecurity lab where you see the victim's world and the attacker's terminal simultaneously. Real attacks. Real defences. Real skills.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: "#0a1628", color: "#c8e6f0" }}>
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}
