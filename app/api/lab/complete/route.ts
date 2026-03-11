import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { updateLabSession, updateUserXP, checkAndAwardBadges } from "@/lib/db";

function calculateGrade(score: number): string {
    if (score >= 90) return "S+";
    if (score >= 80) return "A";
    if (score >= 70) return "B+";
    if (score >= 60) return "B";
    if (score >= 50) return "C";
    return "D";
}

export async function POST(req: NextRequest) {
    const session = await getServerSession();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id?: string }).id;
    if (!userId) {
        return NextResponse.json({ error: "User ID not found in session" }, { status: 401 });
    }

    const { sessionId, duration, attackerScore, defenderScore, quizScore, tasksCompleted } =
        await req.json();

    if (!sessionId) {
        return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
    }

    const grade = calculateGrade(attackerScore ?? 0);

    // Update session record
    const updated = await updateLabSession(sessionId, {
        ended_at: new Date().toISOString(),
        duration_seconds: duration ?? 0,
        attacker_score: attackerScore ?? 0,
        defender_score: defenderScore ?? 0,
        quiz_score: quizScore ?? 0,
        tasks_completed: tasksCompleted ?? 0,
        grade,
    });

    if (!updated) {
        return NextResponse.json({ error: "Failed to update session" }, { status: 500 });
    }

    // Award XP based on attacker score
    const updatedUser = await updateUserXP(userId, attackerScore ?? 0);
    const newLevel = updatedUser?.level ?? null;

    // Check and award badges
    const newBadges = await checkAndAwardBadges(userId, sessionId);

    return NextResponse.json({ grade, newBadges, newLevel });
}
