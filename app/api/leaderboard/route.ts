import { NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
    try {
        const data = await getLeaderboard(20);
        return NextResponse.json(data);
    } catch (error) {
        console.error("Leaderboard API error:", error);
        return NextResponse.json([], { status: 500 });
    }
}
