'use client'

import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a1628] text-[#c8e6f0] p-4 font-mono">
            <div className="border border-red-500/50 p-8 bg-panel shadow-2xl max-w-2xl w-full">
                <h2 className="text-2xl font-bold text-red-500 mb-4 font-orbitron">SYSTEM ERROR OCCURRED</h2>
                <div className="bg-black/50 p-4 rounded mb-6 border border-white/5 overflow-auto max-h-60 text-sm">
                    {error.message || 'An unexpected error occurred in the TwinShield runtime.'}
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => reset()}
                        className="px-6 py-2 bg-red-500 text-black font-bold hover:bg-red-400 transition-colors"
                    >
                        RETRY SESSION
                    </button>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="px-6 py-2 border border-blue-400 text-blue-400 font-bold hover:bg-blue-400/10 transition-colors"
                    >
                        RETURN TO ROOT
                    </button>
                </div>
            </div>
        </div>
    )
}
