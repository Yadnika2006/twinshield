import { NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/db";

export async function GET() {
    const data = await getLeaderboard(20);
    return NextResponse.json(data);
}
