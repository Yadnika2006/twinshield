import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { createLabSession } from "@/lib/db";
import { getScenario } from "@/lib/scenarios";
import { applyRateLimit, buildRateLimitHeaders } from "@/lib/rate-limit";
import { InvalidJsonBodyError, parseJsonBodyWithLimit, RequestBodyTooLargeError } from "@/lib/request-body";
import { labStartRequestSchema } from "@/lib/validation/schemas";
import { getValidationDetails } from "@/lib/validation/http";
import { ZodError } from "zod";

const LAB_START_BODY_MAX_BYTES = 4 * 1024;

function getSessionUserId(session: Awaited<ReturnType<typeof getServerSession>>): string | null {
    const user = session?.user as { id?: unknown } | undefined;
    return typeof user?.id === "string" ? user.id : null;
}

export async function POST(req: NextRequest) {
    const rate = applyRateLimit(req, {
        namespace: "lab-start",
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
        const body = await parseJsonBodyWithLimit(req, LAB_START_BODY_MAX_BYTES);
        const { scenarioId } = labStartRequestSchema.parse(body);

        const scenario = getScenario(scenarioId);
        if (!scenario) {
            return NextResponse.json({ error: "Scenario not found" }, { status: 404, headers: rateHeaders });
        }

        const newSession = await createLabSession(userId, scenarioId);
        if (!newSession) {
            return NextResponse.json(
                { error: "Failed to create lab session" },
                { status: 500, headers: rateHeaders }
            );
        }

        return NextResponse.json({ sessionId: newSession.id }, { headers: rateHeaders });
    } catch (error) {
        if (error instanceof RequestBodyTooLargeError) {
            return NextResponse.json(
                { error: `Payload too large (max ${LAB_START_BODY_MAX_BYTES} bytes)` },
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

        console.error("Lab start route error:", error);
        return NextResponse.json({ error: "Unable to start lab" }, { status: 500, headers: rateHeaders });
    }
}
