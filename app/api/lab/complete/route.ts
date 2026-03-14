import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { checkAndAwardBadges, getLabSessionForUser, updateLabSessionForUser, updateUserXP } from "@/lib/db";
import { applyRateLimit, buildRateLimitHeaders } from "@/lib/rate-limit";
import { InvalidJsonBodyError, parseJsonBodyWithLimit, RequestBodyTooLargeError } from "@/lib/request-body";
import { labCompleteRequestSchema } from "@/lib/validation/schemas";
import { getValidationDetails } from "@/lib/validation/http";
import { ZodError } from "zod";

const LAB_COMPLETE_BODY_MAX_BYTES = 8 * 1024;

function getSessionUserId(session: Awaited<ReturnType<typeof getServerSession>>): string | null {
    const user = session?.user as { id?: unknown } | undefined;
    return typeof user?.id === "string" ? user.id : null;
}

function calculateGrade(score: number): string {
    if (score >= 90) return "S+";
    if (score >= 80) return "A";
    if (score >= 70) return "B+";
    if (score >= 60) return "B";
    if (score >= 50) return "C";
    return "D";
}

export async function POST(req: NextRequest) {
    const rate = applyRateLimit(req, {
        namespace: "lab-complete",
        maxRequests: 20,
        windowMs: 60_000,
    });
    const rateHeaders = buildRateLimitHeaders(rate);

    if (!rate.success) {
        return NextResponse.json(
            { error: "Too many requests. Please try again shortly." },
            { status: 429, headers: rateHeaders }
        );
    }

    const session = await getServerSession();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: rateHeaders });
    }

    const userId = getSessionUserId(session);
    if (!userId) {
        return NextResponse.json(
            { error: "User ID not found in session" },
            { status: 401, headers: rateHeaders }
        );
    }

    try {
        const body = await parseJsonBodyWithLimit(req, LAB_COMPLETE_BODY_MAX_BYTES);
        const { sessionId, duration, attackerScore, defenderScore, quizScore, tasksCompleted } =
            labCompleteRequestSchema.parse(body);

        const existingSession = await getLabSessionForUser(sessionId, userId);
        if (!existingSession) {
            return NextResponse.json({ error: "Session not found" }, { status: 403, headers: rateHeaders });
        }

        if (existingSession.ended_at) {
            return NextResponse.json(
                { error: "Session is already completed" },
                { status: 409, headers: rateHeaders }
            );
        }

        const grade = calculateGrade(attackerScore);

        const updated = await updateLabSessionForUser(sessionId, userId, {
            ended_at: new Date().toISOString(),
            duration_seconds: duration,
            attacker_score: attackerScore,
            defender_score: defenderScore,
            quiz_score: quizScore,
            tasks_completed: tasksCompleted,
            grade,
        });

        if (!updated) {
            return NextResponse.json({ error: "Failed to update session" }, { status: 500, headers: rateHeaders });
        }

        const updatedUser = await updateUserXP(userId, attackerScore);
        const newLevel = updatedUser?.level ?? null;
        const newBadges = await checkAndAwardBadges(userId, sessionId);

        return NextResponse.json({ grade, newBadges, newLevel }, { headers: rateHeaders });
    } catch (error) {
        if (error instanceof RequestBodyTooLargeError) {
            return NextResponse.json(
                { error: `Payload too large (max ${LAB_COMPLETE_BODY_MAX_BYTES} bytes)` },
                { status: 413, headers: rateHeaders }
            );
        }

        if (error instanceof InvalidJsonBodyError) {
            return NextResponse.json({ error: error.message }, { status: 400, headers: rateHeaders });
        }

        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: "Invalid request payload", details: getValidationDetails(error) },
                { status: 400, headers: rateHeaders }
            );
        }

        console.error("Lab complete route error:", error);
        return NextResponse.json({ error: "Unable to complete session" }, { status: 500, headers: rateHeaders });
    }
}
