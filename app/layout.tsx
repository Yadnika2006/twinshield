import type { Metadata } from "next";
import "./globals.css";
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/xterm@5.3.0/css/xterm.css"
        />
      </head>
      <body>
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}
