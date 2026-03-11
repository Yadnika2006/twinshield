import { supabaseAdmin } from "@/lib/supabase";
import { getScenario } from "@/lib/scenarios";

// ─────────────────────────────────────────────
// USER FUNCTIONS
// ─────────────────────────────────────────────

export async function getUserByEmail(email: string) {
    const { data, error } = await supabaseAdmin
        .from("users")
        .select("*")
        .eq("email", email)
        .single();
    if (error) return null;
    return data;
}

export async function getUserById(id: string) {
    const { data, error } = await supabaseAdmin
        .from("users")
        .select("*")
        .eq("id", id)
        .single();
    if (error) return null;
    return data;
}

export async function updateUserXP(userId: string, xpToAdd: number) {
    // Get current user data
    const user = await getUserById(userId);
    if (!user) return null;

    const currentXP = user.xp || 0;
    const currentLevel = user.level || 1;
    const currentScore = user.score || 0;
    let newXP = currentXP + xpToAdd;
    let newLevel = currentLevel;

    // Level up check: Level N requires N*100 XP to complete
    // Threshold for next level = newLevel * 100
    let threshold = newLevel * 100;
    while (newXP >= threshold) {
        newXP -= threshold;
        newLevel += 1;
        threshold = newLevel * 100;
    }

    const { data, error } = await supabaseAdmin
        .from("users")
        .update({
            xp: newXP,
            level: newLevel,
            score: currentScore + xpToAdd,
        })
        .eq("id", userId)
        .select()
        .single();

    if (error) return null;
    return data;
}

export async function getUserStats(userId: string) {
    // Total sessions
    const { count: totalSessions } = await supabaseAdmin
        .from("lab_sessions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .not("ended_at", "is", null);

    // User data for level, xp, score
    const user = await getUserById(userId);

    // Recent sessions (last 5)
    const { data: recentSessions } = await supabaseAdmin
        .from("lab_sessions")
        .select("id, scenario_id, attacker_score, defender_score, grade, started_at, ended_at, duration_seconds")
        .eq("user_id", userId)
        .not("ended_at", "is", null)
        .order("started_at", { ascending: false })
        .limit(5);

    // Get rank from leaderboard view
    let rank: number | null = null;
    try {
        const { data: lb } = await supabaseAdmin
            .from("leaderboard")
            .select("*");
        if (lb) {
            const myIndex = lb.findIndex((r: any) => r.user_id === userId || r.id === userId);
            rank = myIndex >= 0 ? myIndex + 1 : null;
        }
    } catch {
        rank = null;
    }

    // Badges
    const { data: badges } = await supabaseAdmin
        .from("user_badges")
        .select("badge_id, earned_at")
        .eq("user_id", userId);

    return {
        totalSessions: totalSessions || 0,
        totalScore: user?.score || 0,
        level: user?.level || 1,
        xp: user?.xp || 0,
        rank,
        badges: badges || [],
        recentSessions: recentSessions || [],
    };
}

// ─────────────────────────────────────────────
// LAB SESSION FUNCTIONS
// ─────────────────────────────────────────────

export async function createLabSession(userId: string, scenarioId: string) {
    const { data, error } = await supabaseAdmin
        .from("lab_sessions")
        .insert({
            user_id: userId,
            scenario_id: scenarioId,
            started_at: new Date().toISOString(),
        })
        .select()
        .single();

    if (error) return null;
    return data;
}

export async function updateLabSession(
    sessionId: string,
    updateData: {
        ended_at?: string;
        duration_seconds?: number;
        attacker_score?: number;
        defender_score?: number;
        quiz_score?: number;
        tasks_completed?: number;
        grade?: string;
    }
) {
    const { data, error } = await supabaseAdmin
        .from("lab_sessions")
        .update(updateData)
        .eq("id", sessionId)
        .select()
        .single();

    if (error) return null;
    return data;
}

export async function getLabSession(sessionId: string) {
    const { data, error } = await supabaseAdmin
        .from("lab_sessions")
        .select("*")
        .eq("id", sessionId)
        .single();

    if (error) return null;
    return data;
}

export async function getUserSessions(userId: string) {
    const { data, error } = await supabaseAdmin
        .from("lab_sessions")
        .select("*")
        .eq("user_id", userId)
        .order("started_at", { ascending: false })
        .limit(10);

    if (error) return [];
    return data;
}

// ─────────────────────────────────────────────
// TASK FUNCTIONS
// ─────────────────────────────────────────────

export async function completeTask(
    sessionId: string,
    taskId: number,
    scenarioId: string,
    answerSubmitted?: string
) {
    const { data, error } = await supabaseAdmin
        .from("task_completions")
        .insert({
            session_id: sessionId,
            task_id: taskId,
            scenario_id: scenarioId,
            answer_submitted: answerSubmitted ?? null,
            completed_at: new Date().toISOString(),
        })
        .select()
        .single();

    if (error) return null;
    return data;
}

// ─────────────────────────────────────────────
// QUIZ FUNCTIONS
// ─────────────────────────────────────────────

export async function saveQuizResult(
    sessionId: string,
    questionId: number,
    selectedIndex: number,
    isCorrect: boolean
) {
    const { data, error } = await supabaseAdmin
        .from("quiz_results")
        .insert({
            session_id: sessionId,
            question_id: questionId,
            selected_index: selectedIndex,
            is_correct: isCorrect,
        })
        .select()
        .single();

    if (error) return null;
    return data;
}

export async function getQuizResults(sessionId: string) {
    const { data, error } = await supabaseAdmin
        .from("quiz_results")
        .select("*")
        .eq("session_id", sessionId);

    if (error) return [];
    return data;
}

// ─────────────────────────────────────────────
// BADGE FUNCTIONS
// ─────────────────────────────────────────────

export async function checkAndAwardBadges(userId: string, sessionId: string) {
    const session = await getLabSession(sessionId);
    if (!session) return [];

    // Get total completed sessions
    const { count: totalCompleted } = await supabaseAdmin
        .from("lab_sessions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .not("ended_at", "is", null);

    // Get existing badges
    const { data: existingBadges } = await supabaseAdmin
        .from("user_badges")
        .select("badge_id")
        .eq("user_id", userId);

    const owned = new Set((existingBadges || []).map((b: any) => b.badge_id));
    const toAward: string[] = [];

    // FIRST_BLOOD: exactly 1 completed session
    if (!owned.has("FIRST_BLOOD") && (totalCompleted || 0) === 1) {
        toAward.push("FIRST_BLOOD");
    }
    // SPEED_RUN: session duration < 900 seconds (15 min)
    if (!owned.has("SPEED_RUN") && session.duration_seconds && session.duration_seconds < 900) {
        toAward.push("SPEED_RUN");
    }
    // DEFENDER: defender_score > 80
    if (!owned.has("DEFENDER") && session.defender_score && session.defender_score > 80) {
        toAward.push("DEFENDER");
    }
    // QUIZ_MASTER: quiz_score = 5
    if (!owned.has("QUIZ_MASTER") && session.quiz_score === 5) {
        toAward.push("QUIZ_MASTER");
    }
    // PERSISTENT: 5+ completed sessions
    if (!owned.has("PERSISTENT") && (totalCompleted || 0) >= 5) {
        toAward.push("PERSISTENT");
    }

    // Insert newly earned badges
    if (toAward.length > 0) {
        await supabaseAdmin.from("user_badges").insert(
            toAward.map((badgeId) => ({
                user_id: userId,
                badge_id: badgeId,
                earned_at: new Date().toISOString(),
            }))
        );
    }

    return toAward;
}

export async function getUserBadges(userId: string) {
    const { data, error } = await supabaseAdmin
        .from("user_badges")
        .select("*")
        .eq("user_id", userId);

    if (error) return [];
    return data;
}

// ─────────────────────────────────────────────
// LEADERBOARD
// ─────────────────────────────────────────────

export async function getLeaderboard(limit: number = 20) {
    // Try leaderboard view first, fall back to users table sorted by score
    const { data, error } = await supabaseAdmin
        .from("leaderboard")
        .select("*")
        .limit(limit);

    if (error) {
        // Fallback: query users table directly
        const { data: users } = await supabaseAdmin
            .from("users")
            .select("id, name, score, level, xp")
            .order("score", { ascending: false })
            .limit(limit);
        return (users || []).map((u: any, i: number) => ({ ...u, rank: i + 1 }));
    }

    return data || [];
}
