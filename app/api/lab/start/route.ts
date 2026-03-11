import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { createLabSession } from "@/lib/db";

export async function POST(req: NextRequest) {
    const session = await getServerSession();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id?: string }).id;
    if (!userId) {
        return NextResponse.json({ error: "User ID not found in session" }, { status: 401 });
    }

    const { scenarioId } = await req.json();
    if (!scenarioId) {
        return NextResponse.json({ error: "scenarioId is required" }, { status: 400 });
    }

    const newSession = await createLabSession(userId, scenarioId);
    if (!newSession) {
        return NextResponse.json({ error: "Failed to create lab session" }, { status: 500 });
    }

    return NextResponse.json({ sessionId: newSession.id });
}
