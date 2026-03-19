import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
    const session = await getServerSession();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id?: string }).id;
    if (!userId) {
        return NextResponse.json({ error: "User ID not found" }, { status: 401 });
    }

    const url = new URL(req.url);
    const filter = url.searchParams.get("filter") || "all"; // all, beginner, intermediate, advanced
    const sort = url.searchParams.get("sort") || "date_desc"; // date_desc, date_asc, score_desc, grade_desc

    // Fetch ALL completed sessions
    let query = supabaseAdmin
        .from("lab_sessions")
        .select("id, scenario_id, attacker_score, defender_score, quiz_score, tasks_completed, grade, started_at, ended_at, duration_seconds")
        .eq("user_id", userId)
        .not("ended_at", "is", null);

    // Apply sorting
    switch (sort) {
        case "date_asc":
            query = query.order("started_at", { ascending: true });
            break;
        case "score_desc":
            query = query.order("attacker_score", { ascending: false });
            break;
        case "grade_desc":
            query = query.order("grade", { ascending: true });
            break;
        default: // date_desc
            query = query.order("started_at", { ascending: false });
    }

    const { data: sessions } = await query;

    return NextResponse.json({
        sessions: sessions || [],
        total: sessions?.length || 0,
    });
}
