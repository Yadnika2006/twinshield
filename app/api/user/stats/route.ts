import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { getUserStats } from "@/lib/db";

export async function GET() {
    const session = await getServerSession();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id?: string }).id;
    if (!userId) {
        return NextResponse.json({ error: "User ID not found in session" }, { status: 401 });
    }

    const stats = await getUserStats(userId);
    return NextResponse.json(stats);
}
