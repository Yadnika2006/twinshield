"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Format pathname as title, e.g., /dashboard -> DASHBOARD
  const title = pathname === "/" ? "HOME" : pathname.split("/")[1].toUpperCase();

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <>
      <header className="navbar">
        <div className="nav-left">
          <Link href="/dashboard" className="nav-logo">
            <span className="logo-icon">⬡</span>
            TWINSHIELD
          </Link>
        </div>

        <div className="nav-center">
          <span className="page-title">// {title}</span>
        </div>

        <div className="nav-right">
          <span className="operator-name">{session?.user?.name || "GUEST"}</span>
          <span className={`role-badge ${(session?.user as any)?.role || "student"}`}>
            {((session?.user as any)?.role || "student").toUpperCase()}
          </span>
          <button className="btn-logout" onClick={handleLogout}>
            ⏻ ESC
          </button>
        </div>
      </header>

      <style jsx global>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 60px;
          background: rgba(9, 26, 46, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0, 212, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          z-index: 1000;
        }
        .nav-logo {
          font-family: 'Orbitron', sans-serif;
          font-weight: 900;
          font-size: 1.2rem;
          color: #00d4ff;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 8px;
          letter-spacing: 2px;
        }
        .logo-icon {
          font-size: 1.4rem;
        }
        .page-title {
          font-family: 'Share Tech Mono', monospace;
          color: #6b86a0;
          font-size: 1rem;
          letter-spacing: 1px;
        }
        .nav-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .operator-name {
          font-family: 'Exo 2', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          color: #c8e6f0;
        }
        .role-badge {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          padding: 4px 8px;
          border-radius: 12px;
          font-weight: bold;
          letter-spacing: 1px;
        }
        .role-badge.student {
          background: rgba(0, 255, 136, 0.15);
          color: #00ff88;
          border: 1px solid rgba(0, 255, 136, 0.3);
        }
        .role-badge.instructor {
          background: rgba(0, 212, 255, 0.15);
          color: #00d4ff;
          border: 1px solid rgba(0, 212, 255, 0.3);
        }
        .btn-logout {
          background: none;
          border: 1px solid rgba(255, 68, 68, 0.3);
          color: #ff4444;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.8rem;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-logout:hover {
          background: rgba(255, 68, 68, 0.1);
          border-color: #ff4444;
        }
      `}</style>
    </>
  );
}
