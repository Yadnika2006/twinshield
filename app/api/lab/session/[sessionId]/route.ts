import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { getLabSessionForUser } from "@/lib/db";
import { applyRateLimit, buildRateLimitHeaders } from "@/lib/rate-limit";

function getSessionUserId(session: Awaited<ReturnType<typeof getServerSession>>): string | null {
    const user = session?.user as { id?: unknown } | undefined;
    return typeof user?.id === "string" ? user.id : null;
}

export async function GET(
    req: NextRequest,
    { params }: { params: { sessionId: string } }
) {
    const rate = applyRateLimit(req, {
        namespace: "lab-session",
        maxRequests: 120,
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

    const labSession = await getLabSessionForUser(params.sessionId, userId);
    if (!labSession) {
        return NextResponse.json({ error: "Session not found" }, { status: 404, headers: rateHeaders });
    }

    return NextResponse.json(labSession, { headers: rateHeaders });
}
