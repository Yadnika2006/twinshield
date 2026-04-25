import { supabaseAdmin } from "@/lib/supabase-admin";
import {
    defaultAgentSettings,
    sanitizeAgentSettings,
    type AgentSettings,
} from "@/lib/agents/settings";

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

async function calculateUserStreak(userId: string) {
    const { data: sessions } = await supabaseAdmin
        .from("lab_sessions")
        .select("started_at")
        .eq("user_id", userId)
        .not("ended_at", "is", null)
        .order("started_at", { ascending: false });

    if (!sessions || sessions.length === 0) return 0;

    // Extract unique dates in YYYY-MM-DD format
    const dates = sessions.map(s => {
        try {
            return new Date(s.started_at).toISOString().split("T")[0];
        } catch {
            return null;
        }
    }).filter(d => d !== null) as string[];
    
    const uniqueDates = Array.from(new Set(dates));
    if (uniqueDates.length === 0) return 0;

    const today = new Date().toISOString().split("T")[0];
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toISOString().split("T")[0];

    // If the latest activity is not today OR yesterday, official streak is dead
    if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) {
        return 0;
    }

    let streak = 1;
    let currentDate = new Date(uniqueDates[0]);

    for (let i = 1; i < uniqueDates.length; i++) {
        const nextDate = new Date(uniqueDates[i]);
        const diffTime = Math.abs(currentDate.getTime() - nextDate.getTime());
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            streak++;
            currentDate = nextDate;
        } else {
            break;
        }
    }

    return streak;
}

export async function getUserStats(userId: string) {
    // Fetch all core stats in parallel to reduce latency
    const [statsResult, user, badges] = await Promise.all([
        supabaseAdmin
            .from("lab_sessions")
            .select("*", { count: "exact", head: true })
            .eq("user_id", userId)
            .not("ended_at", "is", null),
        getUserById(userId),
        supabaseAdmin
            .from("user_badges")
            .select("badge_id, earned_at")
            .eq("user_id", userId),
    ]);

    const totalSessions = statsResult.count || 0;

    // Optimized Rank calculation: count users with higher scores
    let rank = null;
    if (user?.score != null) {
        const { count: higherCount } = await supabaseAdmin
            .from("users")
            .select("*", { count: "exact", head: true })
            .gt("score", user.score);
        rank = (higherCount ?? 0) + 1;
    }

    // Recent sessions (last 5)
    const { data: recentSessions } = await supabaseAdmin
        .from("lab_sessions")
        .select("id, scenario_id, attacker_score, defender_score, grade, started_at, ended_at, duration_seconds")
        .eq("user_id", userId)
        .not("ended_at", "is", null)
        .order("started_at", { ascending: false })
        .limit(5);

    const streak = await calculateUserStreak(userId);

    return {
        totalSessions,
        totalScore: user?.score || 0,
        level: user?.level || 1,
        xp: user?.xp || 0,
        rank,
        streak,
        badges: badges.data || [],
        recentSessions: recentSessions || [],
    };
}

export async function getAgentSettings(userId: string): Promise<AgentSettings> {
    const { data, error } = await supabaseAdmin
        .from("agent_settings")
        .select("config")
        .eq("user_id", userId)
        .maybeSingle();

    if (error) {
        console.error("Failed to fetch agent settings:", error);
        return sanitizeAgentSettings(defaultAgentSettings);
    }

    if (!data?.config) {
        return sanitizeAgentSettings(defaultAgentSettings);
    }

    return sanitizeAgentSettings(data.config);
}

export async function upsertAgentSettings(userId: string, settings: unknown): Promise<AgentSettings | null> {
    const sanitized = sanitizeAgentSettings(settings);

    const { data, error } = await supabaseAdmin
        .from("agent_settings")
        .upsert(
            {
                user_id: userId,
                config: sanitized,
            },
            {
                onConflict: "user_id",
            }
        )
        .select("config")
        .maybeSingle();

    if (error) {
        console.error("Failed to save agent settings:", error);
        return null;
    }

    return sanitizeAgentSettings(data?.config || sanitized);
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

type LabSessionUpdateData = {
    ended_at?: string;
    duration_seconds?: number;
    attacker_score?: number;
    defender_score?: number;
    quiz_score?: number;
    tasks_completed?: number;
    grade?: string;
};

export async function updateLabSession(sessionId: string, updateData: LabSessionUpdateData) {
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

export async function getLabSessionForUser(sessionId: string, userId: string) {
    const { data, error } = await supabaseAdmin
        .from("lab_sessions")
        .select("*")
        .eq("id", sessionId)
        .eq("user_id", userId)
        .maybeSingle();

    if (error) return null;
    return data;
}

export async function updateLabSessionForUser(
    sessionId: string,
    userId: string,
    updateData: LabSessionUpdateData
) {
    const { data, error } = await supabaseAdmin
        .from("lab_sessions")
        .update(updateData)
        .eq("id", sessionId)
        .eq("user_id", userId)
        .select()
        .maybeSingle();

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

export async function getTaskCompletions(sessionId: string) {
    const { data, error } = await supabaseAdmin
        .from("task_completions")
        .select("task_id")
        .eq("session_id", sessionId);

    if (error) return [];
    return data || [];
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

    const owned = new Set((existingBadges || []).map((b: { badge_id: string }) => b.badge_id));
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
        .order("score", { ascending: false })
        .order("level", { ascending: false })
        .order("xp", { ascending: false })
        .limit(limit);

    if (error) {
        // Fallback: query users table directly
        const { data: users } = await supabaseAdmin
            .from("users")
            .select("id, name, score, level, xp")
            .order("score", { ascending: false })
            .order("level", { ascending: false })
            .order("xp", { ascending: false })
            .limit(limit);
        return (users || []).map((u: any, i: number) => ({
            user_id: u.id,
            name: u.name,
            score: u.score,
            level: u.level,
            xp: u.xp,
            rank: i + 1
        }));
    }

    return data || [];
}

// ─────────────────────────────────────────────
// CTF FUNCTIONS
// ─────────────────────────────────────────────

export async function saveCTFAttempt({
    userId,
    challengeId,
    flagSubmitted,
    isCorrect,
    hintsUsed = 0,
    pointsEarned = 0,
}: {
    userId: string;
    challengeId: string;
    flagSubmitted: string;
    isCorrect: boolean;
    hintsUsed?: number;
    pointsEarned?: number;
}) {
    const { data, error } = await supabaseAdmin
        .from("ctf_attempts")
        .upsert(
            {
                user_id: userId,
                challenge_id: challengeId,
                flag_submitted: flagSubmitted,
                is_correct: isCorrect,
                hints_used: hintsUsed,
                points_earned: pointsEarned,
            },
            { onConflict: "user_id,challenge_id" }
        )
        .select()
        .single();

    if (error) {
        console.error("CTF attempt save error:", error);
        return null;
    }
    return data;
}

export async function getUserCTFProgress(userId: string) {
    const { data, error } = await supabaseAdmin
        .from("ctf_attempts")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (error) return [];
    return data || [];
}

export async function getUserCTFStats(userId: string) {
    const { data, error } = await supabaseAdmin
        .from("ctf_attempts")
        .select("*")
        .eq("user_id", userId)
        .eq("is_correct", true);

    if (error) {
        return {
            totalSolved: 0,
            totalPoints: 0,
            solvedChallenges: [],
        };
    }

    const totalSolved = (data || []).length;
    const totalPoints = (data || []).reduce(
        (sum, attempt) => sum + (attempt.points_earned || 0),
        0
    );
    const solvedChallenges = (data || []).map((attempt) => attempt.challenge_id);

    return { totalSolved, totalPoints, solvedChallenges };
}
