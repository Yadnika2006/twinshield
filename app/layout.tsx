import type { Metadata } from "next";
import "./globals.css";
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
      <body className="ts-loading">
        {/* Loading overlay — visible until JS hydrates */}
        <div id="ts-loader">
          <div className="loader-icon">⬡</div>
          <div className="loader-text">Initializing Core...</div>
          <div className="loader-bar"></div>
        </div>
        <NextAuthProvider>{children}</NextAuthProvider>
        {/* Remove loading class after styled-jsx hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `setTimeout(function(){document.body.classList.remove('ts-loading');setTimeout(function(){var l=document.getElementById('ts-loader');if(l)l.remove()},500)},300);`,
          }}
        />
      </body>
    </html>
  );
}
