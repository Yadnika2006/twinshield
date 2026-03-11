"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const role = (session?.user as any)?.role || "student";

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
      <aside className="sidebar">
        <div className="sidebar-header">
          <Link href="/dashboard" className="sidebar-logo">
            <span className="logo-icon">⬡</span>
            TWINSHIELD
          </Link>

          <div className="operator-profile">
            <div className="avatar-circle">
              {session?.user?.name ? session.user.name.substring(0, 2).toUpperCase() : "OP"}
            </div>
            <div className="operator-info">
              <span className="op-name">{session?.user?.name || "GUEST"}</span>
              <span className={`role-pill ${role}`}>
                {role.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="side-nav">
          {links.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link key={link.name} href={link.path} className={`nav-item ${isActive ? "active" : ""}`}>
                <span className="nav-icon">{link.icon}</span>
                {link.name}
              </Link>
            );
          })}

          {role === "instructor" && (
            <Link href="/instructor" className={`nav-item ${pathname === "/instructor" ? "active" : ""}`}>
              <span className="nav-icon">◈</span>
              Instructor Panel
            </Link>
          )}
        </div>

        <div className="sidebar-footer">
          <button className="btn-logout" onClick={handleLogout}>
            ⏻ DISCONNECT SESSION
          </button>
        </div>
      </aside>

      <style jsx global>{`
        .sidebar {
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

        .sidebar-header {
          padding: 24px 20px;
          border-bottom: 1px solid rgba(0, 212, 255, 0.1);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .sidebar-logo {
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

        .operator-profile {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .avatar-circle {
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

        .operator-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .op-name {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.85rem;
          color: #fff;
        }

        .role-pill {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          padding: 2px 8px;
          border-radius: 10px;
          width: fit-content;
          font-weight: bold;
        }

        .role-pill.student {
          background: rgba(0, 255, 136, 0.1);
          color: #00ff88;
          border: 1px solid rgba(0, 255, 136, 0.3);
        }

        .role-pill.instructor {
          background: rgba(0, 212, 255, 0.1);
          color: #00d4ff;
          border: 1px solid rgba(0, 212, 255, 0.3);
        }

        .side-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 20px 0;
          overflow-y: auto;
        }

        .nav-item {
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

        .nav-item:hover {
          color: #00ff88;
          background: rgba(0, 255, 136, 0.05);
          text-shadow: 0 0 8px rgba(0, 255, 136, 0.5);
        }

        .nav-item.active {
          color: #00ff88;
          background: rgba(0, 255, 136, 0.1);
          border-left-color: #00ff88;
        }

        .nav-icon {
          font-size: 0.9rem;
        }

        .sidebar-footer {
          padding: 20px;
          border-top: 1px solid rgba(0, 212, 255, 0.1);
        }

        .btn-logout {
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

        .btn-logout:hover {
          background: rgba(255, 68, 68, 0.1);
          border-color: #ff4444;
        }
      `}</style>
    </>
  );
}
