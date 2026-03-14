import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { getAgentSettings, upsertAgentSettings } from "@/lib/db";
import { sanitizeAgentSettings } from "@/lib/agents/settings";

function getSessionUserId(session: Awaited<ReturnType<typeof getServerSession>>): string | null {
    const user = session?.user as { id?: unknown } | undefined;
    return typeof user?.id === "string" ? user.id : null;
}

export async function GET() {
    const session = await getServerSession();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = getSessionUserId(session);
    if (!userId) {
        return NextResponse.json({ error: "User ID not found in session" }, { status: 401 });
    }

    const settings = await getAgentSettings(userId);
    return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
    const session = await getServerSession();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = getSessionUserId(session);
    if (!userId) {
        return NextResponse.json({ error: "User ID not found in session" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const payload = sanitizeAgentSettings(body?.settings ?? body);
        const saved = await upsertAgentSettings(userId, payload);

        if (!saved) {
            return NextResponse.json(
                {
                    error: "Failed to save agent settings. Ensure the agent_settings table exists.",
                },
                { status: 500 }
            );
        }

        return NextResponse.json(saved);
    } catch (error) {
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : "Invalid request body",
            },
            { status: 400 }
        );
    }
}
