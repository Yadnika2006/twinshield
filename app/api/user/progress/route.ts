import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getUserById, getUserBadges, getUserCTFStats } from "@/lib/db";

// Scenario metadata for mapping
const SCENARIO_META: Record<string, { name: string; type: string; diff: string; category: string }> = {
    "phish-01":   { name: "PhishNet",     type: "Phishing",             diff: "Beginner",     category: "recon" },
    "weakpass-01":{ name: "WeakPass",     type: "Weak Password Attack", diff: "Beginner",     category: "exploit" },
    "social-01":  { name: "SocialEng",    type: "Social Engineering",   diff: "Beginner",     category: "recon" },
    "malware-01": { name: "MalwareDrop",  type: "Malware Download",     diff: "Beginner",     category: "exploit" },
    "brute-01":   { name: "BruteX",       type: "Brute Force",          diff: "Intermediate", category: "exploit" },
    "xss-01":     { name: "XSSploit",     type: "Cross Site Scripting", diff: "Intermediate", category: "exploit" },
    "klog-01":    { name: "KeyLogger",    type: "Keylogger Attack",     diff: "Intermediate", category: "exfil" },
    "fakeap-01":  { name: "FakeAP",       type: "Fake WiFi Hotspot",    diff: "Intermediate", category: "recon" },
    "sess-01":    { name: "SessHijack",   type: "Session Hijacking",    diff: "Intermediate", category: "exfil" },
    "sqli-01":    { name: "SQLStorm",     type: "SQL Injection",        diff: "Advanced",     category: "exploit" },
    "mitm-01":    { name: "MitM Café",    type: "Man in the Middle",    diff: "Advanced",     category: "exfil" },
    "rnsw-01":    { name: "RansomDrop",   type: "Ransomware",           diff: "Advanced",     category: "exploit" },
    "spy-01":     { name: "SpyAgent",     type: "Spyware",              diff: "Advanced",     category: "stealth" },
    "usb-01":     { name: "USBdrop",      type: "USB Malware",          diff: "Advanced",     category: "exploit" },
    "dos-01":     { name: "NetFlood",     type: "Denial of Service",    diff: "Advanced",     category: "exploit" },
};

export async function GET() {
    const session = await getServerSession();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id?: string }).id;
    if (!userId) {
        return NextResponse.json({ error: "User ID not found" }, { status: 401 });
    }

    // Fetch user info
    const user = await getUserById(userId);

    // Fetch ALL sessions for this user (not just recent 5)
    const { data: allSessions } = await supabaseAdmin
        .from("lab_sessions")
        .select("id, scenario_id, attacker_score, defender_score, quiz_score, tasks_completed, grade, started_at, ended_at, duration_seconds")
        .eq("user_id", userId)
        .not("ended_at", "is", null)
        .order("started_at", { ascending: false });

    const sessions = allSessions || [];

    // Fetch badges
    const badges = await getUserBadges(userId);

    // ── Compute skill radar values ──
    const categoryScores: Record<string, number[]> = {
        recon: [], exploit: [], exfil: [], defence: [], stealth: [],
    };

    for (const s of sessions) {
        const meta = SCENARIO_META[s.scenario_id];
        if (meta && s.attacker_score != null) {
            categoryScores[meta.category].push(s.attacker_score);
        }
        if (s.defender_score != null) {
            categoryScores.defence.push(s.defender_score);
        }
        // Stealth = inverse detection: high attacker score + low defender score = good stealth
        if (s.attacker_score != null && s.defender_score != null) {
            const stealthVal = Math.max(0, s.attacker_score - s.defender_score + 50);
            categoryScores.stealth.push(Math.min(100, stealthVal));
        }
    }

    const avg = (arr: number[]) => arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
    const radar = {
        recon: avg(categoryScores.recon),
        exploit: avg(categoryScores.exploit),
        exfil: avg(categoryScores.exfil),
        defence: avg(categoryScores.defence),
        stealth: avg(categoryScores.stealth),
    };

    // ── Lab completion map ──
    const labMap = Object.entries(SCENARIO_META).map(([id, meta]) => {
        const labSessions = sessions.filter(s => s.scenario_id === id);
        const bestSession = labSessions.sort((a, b) => (b.attacker_score || 0) - (a.attacker_score || 0))[0];
        return {
            id,
            ...meta,
            attempts: labSessions.length,
            bestScore: bestSession?.attacker_score ?? null,
            bestGrade: bestSession?.grade ?? null,
            status: labSessions.length > 0 ? "completed" : "not_started",
        };
    });

    // ── Activity heatmap (last 90 days) ──
    const now = new Date();
    const heatmap: Record<string, number> = {};
    for (let i = 0; i < 90; i++) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        heatmap[d.toISOString().split("T")[0]] = 0;
    }
    for (const s of sessions) {
        const day = new Date(s.started_at).toISOString().split("T")[0];
        if (heatmap[day] !== undefined) {
            heatmap[day]++;
        }
    }

    // ── XP timeline (aggregate by day) ──
    const xpByDay: { date: string; score: number }[] = [];
    let runningScore = 0;
    const sortedByDate = [...sessions].sort((a, b) => new Date(a.started_at).getTime() - new Date(b.started_at).getTime());
    for (const s of sortedByDate) {
        runningScore += (s.attacker_score || 0);
        const day = new Date(s.started_at).toISOString().split("T")[0];
        xpByDay.push({ date: day, score: runningScore });
    }

    // ── Strengths & weaknesses ──
    const scenarioAvgs = Object.entries(SCENARIO_META).map(([id, meta]) => {
        const labSessions = sessions.filter(s => s.scenario_id === id);
        const avgScore = avg(labSessions.map(s => s.attacker_score || 0));
        return { id, name: meta.name, type: meta.type, avgScore, attempts: labSessions.length };
    }).filter(s => s.attempts > 0).sort((a, b) => b.avgScore - a.avgScore);

    const strengths = scenarioAvgs.slice(0, 3);
    const weaknesses = scenarioAvgs.slice(-3).reverse();

    const ctfStats = await getUserCTFStats(userId);
    const isEligibleForCertificate = labMap.every(l => l.status === "completed") && ctfStats.totalSolved >= 5;

    return NextResponse.json({
        user: {
            level: user?.level || 1,
            xp: user?.xp || 0,
            score: user?.score || 0,
            name: user?.name || "Operator",
        },
        isEligibleForCertificate,
        radar,
        labMap,
        sessions,
        badges: badges || [],
        heatmap,
        xpTimeline: xpByDay,
        strengths,
        weaknesses,
        totalSessions: sessions.length,
        avgAttackerScore: avg(sessions.map(s => s.attacker_score || 0)),
        avgDefenderScore: avg(sessions.map(s => s.defender_score || 0)),
    });
}
