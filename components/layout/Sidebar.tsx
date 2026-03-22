"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const role = status === "authenticated"
    ? ((session?.user as { role?: string } | undefined)?.role || "student")
    : null;
  const displayName = status === "authenticated" ? (session?.user?.name || "GUEST") : "";
  const displayRole = role ? role.toUpperCase() : "";
  const avatarText = status === "authenticated" && session?.user?.name
    ? session.user.name.substring(0, 2).toUpperCase()
    : "";

  const links = [
    { name: "Dashboard", path: "/dashboard", icon: "◈" },
    { name: "My Labs", path: "/dashboard/labs", icon: "◈" },
    { name: "CTF Arena", path: "/ctf", icon: "◈" },
    { name: "Agent Config", path: "/agent-config", icon: "◈" },
    { name: "Progress", path: "/dashboard/progress", icon: "◈" },
    { name: "Leaderboard", path: "/dashboard/leaderboard", icon: "◈" },
    { name: "Reports", path: "/report", icon: "◈" },
  ];

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <>
      <aside className="ts-sidebar">
        <div className="ts-sidebar-header">
          <Link href="/dashboard" className="ts-sidebar-logo">
            <span className="ts-sidebar-logo-icon">⬡</span>
            TWINSHIELD
          </Link>

          <div className="ts-operator-profile">
            <div className="ts-avatar-circle">
              {avatarText}
            </div>
            <div className="ts-operator-info">
              <span className="ts-op-name">{displayName}</span>
              {role && (
                <span className={`ts-role-pill ${role}`}>
                  {displayRole}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="ts-side-nav">
          {links.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link key={link.name} href={link.path} className={`ts-nav-item ${isActive ? "active" : ""}`}>
                <span className="ts-nav-icon">{link.icon}</span>
                {link.name}
              </Link>
            );
          })}

          {role === "instructor" && (
            <Link href="/instructor" className={`ts-nav-item ${pathname === "/instructor" ? "active" : ""}`}>
              <span className="ts-nav-icon">◈</span>
              Instructor Panel
            </Link>
          )}
        </div>

        <div className="ts-sidebar-footer">
          <button className="ts-sidebar-logout-btn" onClick={handleLogout}>
            ⏻ DISCONNECT SESSION
          </button>
        </div>
      </aside>

      <style jsx global>{`
        .ts-sidebar {
          position: fixed;
          left: 0;
          top: 0;
          width: 220px;
          height: 100vh;
          background: #091a2e;
          border-right: 1px solid rgba(0, 212, 255, 0.2);
          display: flex;
          flex-direction: column;
          z-index: 1001;
        }

        .ts-sidebar-header {
          padding: 24px 20px;
          border-bottom: 1px solid rgba(0, 212, 255, 0.1);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .ts-sidebar-logo {
          font-family: 'Orbitron', sans-serif;
          font-weight: 900;
          font-size: 1.1rem;
          color: #00d4ff;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 8px;
          letter-spacing: 1px;
        }

        .ts-operator-profile {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ts-avatar-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00d4ff, #00ff88);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Orbitron', sans-serif;
          font-weight: bold;
          font-size: 0.8rem;
          color: #050f1c;
          box-shadow: 0 0 10px rgba(0, 212, 255, 0.3);
        }

        .ts-operator-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .ts-op-name {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.85rem;
          color: #fff;
        }

        .ts-role-pill {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          padding: 2px 8px;
          border-radius: 10px;
          width: fit-content;
          font-weight: bold;
        }

        .ts-role-pill.student {
          background: rgba(0, 255, 136, 0.1);
          color: #00ff88;
          border: 1px solid rgba(0, 255, 136, 0.3);
        }

        .ts-role-pill.instructor {
          background: rgba(0, 212, 255, 0.1);
          color: #00d4ff;
          border: 1px solid rgba(0, 212, 255, 0.3);
        }

        .ts-side-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 20px 0;
          overflow-y: auto;
        }

        .ts-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          text-decoration: none;
          color: #6b86a0;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          border-left: 3px solid transparent;
        }

        .ts-nav-item:hover {
          color: #00ff88;
          background: rgba(0, 255, 136, 0.05);
          text-shadow: 0 0 8px rgba(0, 255, 136, 0.5);
        }

        .ts-nav-item.active {
          color: #00ff88;
          background: rgba(0, 255, 136, 0.1);
          border-left-color: #00ff88;
        }

        .ts-nav-icon {
          font-size: 0.9rem;
        }

        .ts-sidebar-footer {
          padding: 20px;
          border-top: 1px solid rgba(0, 212, 255, 0.1);
        }

        .ts-sidebar-logout-btn {
          width: 100%;
          background: transparent;
          border: 1px solid rgba(255, 68, 68, 0.3);
          color: #ff4444;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.8rem;
          padding: 10px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }

        .ts-sidebar-logout-btn:hover {
          background: rgba(255, 68, 68, 0.1);
          border-color: #ff4444;
        }
      `}</style>
    </>
  );
}
