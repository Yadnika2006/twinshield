"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Target, Shield, Brain, Trophy, Printer } from "lucide-react";

export default function CertificatePage() {
    const router = useRouter();
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEligible, setIsEligible] = useState(false);

    useEffect(() => {
        fetch('/api/user/progress')
            .then(res => res.json())
            .then(data => {
                if (data && data.user) {
                    setUserData(data.user);
                    // Only allow access if the backend confirms they are eligible
                    setIsEligible(!!data.isEligibleForCertificate);
                }
            })
            .catch(err => console.error("Error fetching progress for cert:", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#0a1628] text-white">
                <div className="text-xl font-mono animate-pulse">VERIFYING CREDENTIALS...</div>
            </div>
        );
    }

    if (!isEligible) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#0a1628] text-white flex-col gap-4">
                <Shield size={64} className="text-red-500" />
                <h1 className="text-2xl font-orbitron text-red-500">ACCESS DENIED</h1>
                <p className="text-gray-400 font-mono">You have not met the requirements to view this certificate.</p>
                <button
                    onClick={() => router.push("/dashboard")}
                    className="px-6 py-2 mt-4 border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white transition-colors"
                >
                    RETURN TO DASHBOARD
                </button>
            </div>
        );
    }

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="cert-wrapper">
            <div className="cert-controls no-print">
                <button onClick={() => router.push("/dashboard")} className="btn-outline">← BACK</button>
                <button onClick={handlePrint} className="btn-solid"><Printer size={18} /> PRINT / SAVE PDF</button>
            </div>

            <div className="cert-container">
                <div className="cert-border">
                    <div className="cert-inner">
                        <div className="cert-header">
                            <Shield size={60} className="header-icon" />
                            <h1 className="orbitron">TWINSHIELD</h1>
                            <div className="subtitle mono">DIGITAL TWIN CYBERSECURITY PLATFORM</div>
                        </div>

                        <div className="cert-body">
                            <h2 className="title-serif">Certificate of Completion</h2>
                            <p className="presents mono">THIS IS PRESENTED TO</p>

                            <div className="name-box">
                                <h3 className="user-name orbitron">{userData?.name?.toUpperCase() || "OPERATOR"}</h3>
                                <div className="name-line"></div>
                            </div>

                            <p className="description mono">
                                For successfully completing all Advanced Lab Scenarios and Capture The Flag arenas within the TwinShield interactive simulation landscape.
                                <br /><br />
                                This validates that the aforementioned individual has demonstrated practical proficiency in offensive and defensive cybersecurity methodologies, including network analysis, vulnerability exploitation, social engineering defense, and advanced threat mitigation techniques.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                :global(body) { background: #0a1628; margin: 0; padding: 0; color: #fff; }
                .orbitron { font-family: 'Orbitron', sans-serif; }
                .mono { font-family: 'Share Tech Mono', monospace; }
                .title-serif { font-family: 'Times New Roman', serif; font-size: 3rem; margin: 20px 0; font-weight: normal; color: #fff; text-shadow: 0 0 10px rgba(255,255,255,0.3); }
                
                .cert-wrapper { min-height: 100vh; display: flex; flex-direction: column; align-items: center; padding: 40px; }
                .cert-controls { width: 100%; max-width: 1000px; display: flex; justify-content: space-between; margin-bottom: 20px; }
                
                .btn-outline { background: transparent; border: 1px solid #c8e6f0; color: #c8e6f0; padding: 8px 16px; cursor: pointer; border-radius: 4px; font-family: 'Share Tech Mono'; transition: 0.2s; }
                .btn-outline:hover { background: rgba(200,230,240,0.1); }
                .btn-solid { background: #00d4ff; color: #0a1628; border: none; padding: 8px 16px; cursor: pointer; border-radius: 4px; font-family: 'Orbitron'; font-weight: bold; display: flex; align-items: center; gap: 8px; transition: 0.2s; }
                .btn-solid:hover { background: #00ff88; }
                
                /* CERTIFICATE STYLES */
                .cert-container { 
                    width: 1000px; 
                    height: 700px; 
                    background: #0f172a; 
                    position: relative; 
                    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                    background-image: radial-gradient(circle at center, rgba(0,212,255,0.05) 0%, transparent 70%);
                }
                
                .cert-border {
                    position: absolute;
                    inset: 20px;
                    border: 2px solid #00d4ff;
                    padding: 10px;
                }
                
                .cert-inner {
                    position: absolute;
                    inset: 10px;
                    border: 1px solid rgba(0,212,255,0.3);
                    padding: 40px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    background: linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(5,15,30,0.95) 100%);
                }
                
                .cert-header { text-align: center; color: #00d4ff; }
                .header-icon { margin: 0 auto 10px; filter: drop-shadow(0 0 10px rgba(0,212,255,0.5)); }
                .cert-header h1 { margin: 0; font-size: 2.5rem; letter-spacing: 4px; text-shadow: 0 0 15px rgba(0,212,255,0.5); }
                .subtitle { font-size: 0.9rem; letter-spacing: 2px; color: #c8e6f0; margin-top: 5px; }
                
                .cert-body { text-align: center; flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; }
                .presents { color: #6b86a0; font-size: 1.1rem; letter-spacing: 3px; margin: 20px 0 10px; }
                
                .name-box { width: 80%; max-width: 600px; margin: 20px auto; position: relative; }
                .user-name { font-size: 2.5rem; color: #00ff88; margin: 0; text-shadow: 0 0 10px rgba(0,255,136,0.3); letter-spacing: 2px; }
                .name-line { height: 2px; background: linear-gradient(90deg, transparent, #00d4ff, transparent); margin-top: 10px; }
                
                .description { color: #c8e6f0; max-width: 600px; line-height: 1.6; margin: 30px auto; font-size: 1rem; }
                
                /* PRINT STYLES */
                @media print {
                    @page { size: landscape; margin: 0; }
                    body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; background: #0f172a !important; }
                    .no-print { display: none !important; }
                    .cert-wrapper { padding: 0; display: block; }
                    .cert-container { width: 100vw; height: 100vh; max-width: none; box-shadow: none; transform: scale(1.0); transform-origin: top left; page-break-inside: avoid; background-color: #0f172a !important; }
                    /* Force background colors for WebKit in print */
                    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    .cert-inner { background: #0a1120 !important; }
                }
            `}</style>
        </div>
    );
}
