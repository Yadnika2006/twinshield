"use client";

export default function DashboardLoading() {
    return (
        <div className="layout">
            <div className="sidebar-skeleton" />
            <div className="main-content">
                <div className="dashboard-container p-40">
                    <div className="welcome-skeleton" />
                    <div className="grid-2 mt-30">
                        <div className="glass-skeleton" />
                        <div className="glass-skeleton" />
                    </div>
                    <div className="grid-3 mt-30">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="stat-skeleton" />
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
        .layout { display: flex; min-height: 100vh; background: #0a1628; }
        .sidebar-skeleton { width: 220px; height: 100vh; background: #091a2e; border-right: 1px solid rgba(0, 212, 255, 0.1); }
        .main-content { flex: 1; position: relative; }
        .dashboard-container { padding: 40px; }
        
        .welcome-skeleton { height: 80px; background: rgba(0, 212, 255, 0.05); border-left: 4px solid rgba(0, 212, 255, 0.2); margin-bottom: 30px; }
        
        .glass-skeleton { height: 150px; background: rgba(9, 26, 46, 0.8); border: 1px solid rgba(0, 212, 255, 0.1); }
        .stat-skeleton { height: 120px; background: rgba(9, 26, 46, 0.8); border: 1px solid rgba(0, 212, 255, 0.1); }

        .mt-30 { margin-top: 30px; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }

        .welcome-skeleton, .glass-skeleton, .stat-skeleton {
          animation: pulse 1.5s infinite ease-in-out;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
      `}</style>
        </div>
    )
}
