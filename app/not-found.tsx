import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a1628] text-[#c8e6f0] p-4 font-mono">
            <div className="border border-blue-500/50 p-12 bg-panel shadow-2xl text-center max-w-lg">
                <div className="text-6xl mb-6">⬡</div>
                <h2 className="text-3xl font-bold text-blue-400 mb-2 font-orbitron tracking-widest">404 NOT FOUND</h2>
                <p className="text-[#6b86a0] mb-8 font-share-tech uppercase tracking-widest">Requested resource is offline or classified.</p>
                <Link
                    href="/"
                    className="px-10 py-4 bg-blue-500 text-black font-bold uppercase tracking-widest hover:bg-green-500 transition-all clip-polygon-8"
                >
                    Return to HQ
                </Link>
            </div>
        </div>
    )
}
