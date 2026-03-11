import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { getLabSession } from "@/lib/db";

export async function GET(
    req: NextRequest,
    { params }: { params: { sessionId: string } }
) {
    const session = await getServerSession();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const labSession = await getLabSession(params.sessionId);
    if (!labSession) {
        return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json(labSession);
}
