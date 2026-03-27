import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { getScenario } from "@/lib/scenarios";
import {
    completeTask,
    getLabSessionForUser,
    getTaskCompletions,
    updateLabSessionForUser,
    updateUserXP,
} from "@/lib/db";
import { applyRateLimit, buildRateLimitHeaders } from "@/lib/rate-limit";
import { InvalidJsonBodyError, parseJsonBodyWithLimit, RequestBodyTooLargeError } from "@/lib/request-body";
import { labTaskRequestSchema } from "@/lib/validation/schemas";
import { getValidationDetails } from "@/lib/validation/http";
import { ZodError } from "zod";

const LAB_TASK_BODY_MAX_BYTES = 8 * 1024;

function getSessionUserId(session: Awaited<ReturnType<typeof getServerSession>>): string | null {
    const user = session?.user as { id?: unknown } | undefined;
    return typeof user?.id === "string" ? user.id : null;
}

async function syncSessionTaskCount(sessionId: string, userId: string) {
    const completions = await getTaskCompletions(sessionId);
    const tasksCompleted = new Set(
        completions
            .map((row: { task_id?: number | null }) => row.task_id)
            .filter((taskId): taskId is number => typeof taskId === "number")
    ).size;

    await updateLabSessionForUser(sessionId, userId, { tasks_completed: tasksCompleted });
    return tasksCompleted;
}

export async function POST(req: NextRequest) {
    const rate = applyRateLimit(req, {
        namespace: "lab-task",
        maxRequests: 80,
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
        const body = await parseJsonBodyWithLimit(req, LAB_TASK_BODY_MAX_BYTES);
        const payload = labTaskRequestSchema.parse(body);
        const submittedAnswer = payload.answer?.trim();

        const labSession = await getLabSessionForUser(payload.sessionId, userId);
        if (!labSession) {
            return NextResponse.json({ error: "Session not found" }, { status: 403, headers: rateHeaders });
        }

        if (labSession.ended_at) {
            return NextResponse.json(
                { error: "This session is already completed" },
                { status: 409, headers: rateHeaders }
            );
        }

        if (labSession.scenario_id !== payload.scenarioId) {
            return NextResponse.json(
                { error: "scenarioId does not match session" },
                { status: 400, headers: rateHeaders }
            );
        }

        const scenario = getScenario(payload.scenarioId);
        if (!scenario) {
            return NextResponse.json({ error: "Scenario not found" }, { status: 404, headers: rateHeaders });
        }

        const task = scenario.tasks.find((item) => item.id === payload.taskId);
        if (!task) {
            return NextResponse.json({ error: "Task not found" }, { status: 404, headers: rateHeaders });
        }

        if (payload.type === "question") {
            if (task.type !== "question") {
                return NextResponse.json(
                    { error: "Task type mismatch for question submission" },
                    { status: 400, headers: rateHeaders }
                );
            }

            if (!submittedAnswer) {
                return NextResponse.json(
                    { error: "Answer is required for question tasks" },
                    { status: 400, headers: rateHeaders }
                );
            }

            const expected = (task.expectedAnswer ?? "").trim().toLowerCase();
            const submitted = submittedAnswer.toLowerCase();
            const correct = submitted === expected
                || submitted.includes(expected)
                || expected.includes(submitted);

            if (!correct) {
                return NextResponse.json({ correct: false }, { headers: rateHeaders });
            }

            const completion = await completeTask(
                payload.sessionId,
                payload.taskId,
                payload.scenarioId,
                submittedAnswer
            );
            if (!completion) {
                return NextResponse.json(
                    { error: "Failed to save task completion" },
                    { status: 500, headers: rateHeaders }
                );
            }

            const xpAwarded = payload.taskId * 30;
            await updateUserXP(userId, xpAwarded);
            const tasksCompleted = await syncSessionTaskCount(payload.sessionId, userId);

            return NextResponse.json({ correct: true, xpAwarded, tasksCompleted }, { headers: rateHeaders });
        }

        if (task.type !== "checklist") {
            return NextResponse.json(
                { error: "Task type mismatch for checklist submission" },
                { status: 400, headers: rateHeaders }
            );
        }

        const completion = await completeTask(payload.sessionId, payload.taskId, payload.scenarioId);
        if (!completion) {
            return NextResponse.json(
                { error: "Failed to save task completion" },
                { status: 500, headers: rateHeaders }
            );
        }

        const xpAwarded = payload.taskId * 30;
        await updateUserXP(userId, xpAwarded);
        const tasksCompleted = await syncSessionTaskCount(payload.sessionId, userId);

        return NextResponse.json({ success: true, xpAwarded, tasksCompleted }, { headers: rateHeaders });
    } catch (error) {
        if (error instanceof RequestBodyTooLargeError) {
            return NextResponse.json(
                { error: `Payload too large (max ${LAB_TASK_BODY_MAX_BYTES} bytes)` },
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

        console.error("Lab task route error:", error);
        return NextResponse.json({ error: "Unable to process task" }, { status: 500, headers: rateHeaders });
    }
}
