"use client";

export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-[#0a1628] text-[#00d4ff] font-mono">
            <div className="flex flex-col items-center gap-6 animate-pulse">
                <div className="text-6xl text-blue-400">⬡</div>
                <div className="text-sm tracking-[0.4em] uppercase font-orbitron">Initializing Core...</div>
                <div className="w-48 h-1 bg-black/50 border border-white/5 relative overflow-hidden">
                    <div className="absolute inset-y-0 left-0 w-1/3 bg-blue-500 animate-loading-bar" />
                </div>
            </div>
            <style jsx>{`
        @keyframes loading-bar {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        .animate-loading-bar {
          animation: loading-bar 1.5s infinite linear;
        }
      `}</style>
        </div>
    )
}
