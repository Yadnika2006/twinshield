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
