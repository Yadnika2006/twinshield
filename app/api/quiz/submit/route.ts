import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { getLabSessionForUser, saveQuizResult, updateLabSessionForUser } from "@/lib/db";
import { getScenario } from "@/lib/scenarios";
import { applyRateLimit, buildRateLimitHeaders } from "@/lib/rate-limit";
import { InvalidJsonBodyError, parseJsonBodyWithLimit, RequestBodyTooLargeError } from "@/lib/request-body";
import { quizSubmitRequestSchema } from "@/lib/validation/schemas";
import { getValidationDetails } from "@/lib/validation/http";
import { ZodError } from "zod";

const QUIZ_SUBMIT_BODY_MAX_BYTES = 16 * 1024;

function getSessionUserId(session: Awaited<ReturnType<typeof getServerSession>>): string | null {
    const user = session?.user as { id?: unknown } | undefined;
    return typeof user?.id === "string" ? user.id : null;
}

export async function POST(req: NextRequest) {
    const rate = applyRateLimit(req, {
        namespace: "quiz-submit",
        maxRequests: 30,
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
        const body = await parseJsonBodyWithLimit(req, QUIZ_SUBMIT_BODY_MAX_BYTES);
        const { sessionId, scenarioId, answers } = quizSubmitRequestSchema.parse(body);

        const labSession = await getLabSessionForUser(sessionId, userId);
        if (!labSession) {
            return NextResponse.json({ error: "Session not found" }, { status: 403, headers: rateHeaders });
        }

        if (labSession.ended_at) {
            return NextResponse.json(
                { error: "This session is already completed" },
                { status: 409, headers: rateHeaders }
            );
        }

        if (labSession.scenario_id !== scenarioId) {
            return NextResponse.json(
                { error: "scenarioId does not match session" },
                { status: 400, headers: rateHeaders }
            );
        }

        const scenario = getScenario(scenarioId);
        if (!scenario) {
            return NextResponse.json({ error: "Scenario not found" }, { status: 404, headers: rateHeaders });
        }

        let totalCorrect = 0;

        for (const answer of answers) {
            const { questionId, selectedIndex } = answer;
            const question = scenario.quiz[questionId];
            if (!question) continue;

            const isCorrect = selectedIndex === question.correctIndex;
            if (isCorrect) totalCorrect++;

            const saved = await saveQuizResult(sessionId, questionId, selectedIndex, isCorrect);
            if (!saved) {
                return NextResponse.json(
                    { error: "Failed to save quiz result" },
                    { status: 500, headers: rateHeaders }
                );
            }
        }

        const updated = await updateLabSessionForUser(sessionId, userId, { quiz_score: totalCorrect });
        if (!updated) {
            return NextResponse.json(
                { error: "Failed to update session quiz score" },
                { status: 500, headers: rateHeaders }
            );
        }

        return NextResponse.json({ score: totalCorrect, total: scenario.quiz.length }, { headers: rateHeaders });
    } catch (error) {
        if (error instanceof RequestBodyTooLargeError) {
            return NextResponse.json(
                { error: `Payload too large (max ${QUIZ_SUBMIT_BODY_MAX_BYTES} bytes)` },
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

        console.error("Quiz submit route error:", error);
        return NextResponse.json({ error: "Unable to submit quiz" }, { status: 500, headers: rateHeaders });
    }
}
