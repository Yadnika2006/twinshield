import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { saveCTFAttempt } from "@/lib/db";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(50, "1 h"), // 50 CTF submissions per hour per user
    analytics: true,
});

const CTF_FLAGS: Record<string, string> = {
    "login-breaker": "FLAG{sql_bypass_admin}",
    "phish-master": "FLAG{homograph_attack_detected}",
    "cookie-monster": "FLAG{session_fixation_pwned}",
    "xss-ploit": "FLAG{xss_cookie_stolen}",
    "mitm-breaker": "FLAG{arp_poison_cracked}",
};

const CTF_POINTS: Record<string, number> = {
    "login-breaker": 100,
    "phish-master": 100,
    "cookie-monster": 150,
    "xss-ploit": 150,
    "mitm-breaker": 200,
};

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id || (session.user as Record<string, string>).userId;
        if (!userId) {
            return Response.json(
                { error: "User ID not found in session" },
                { status: 400 }
            );
        }

        // Rate limit check
        const { success } = await ratelimit.limit(userId);
        if (!success) {
            return Response.json(
                { error: "Too many submissions. Try again later." },
                { status: 429 }
            );
        }

        const { challengeId, flagSubmitted, hintsUsed } = await req.json();

        if (!challengeId || !flagSubmitted) {
            return Response.json(
                { error: "Missing challengeId or flag" },
                { status: 400 }
            );
        }

        const correctFlag = CTF_FLAGS[challengeId];
        if (!correctFlag) {
            return Response.json(
                { error: "Invalid challenge ID" },
                { status: 400 }
            );
        }

        const isCorrect = flagSubmitted.trim() === correctFlag;
        const pointsEarned = isCorrect ? CTF_POINTS[challengeId] || 100 : 0;

        // Save attempt to database
        const attempt = await saveCTFAttempt({
            userId,
            challengeId,
            flagSubmitted: flagSubmitted.trim(),
            isCorrect,
            hintsUsed: hintsUsed || 0,
            pointsEarned,
        });

        if (!attempt) {
            return Response.json(
                { error: "Failed to save attempt" },
                { status: 500 }
            );
        }

        // If correct, update user's CTF score
        if (isCorrect) {
            const { data: user } = await supabaseAdmin
                .from("users")
                .select("ctf_score")
                .eq("id", userId)
                .single();

            const currentCTFScore = user?.ctf_score || 0;
            await supabaseAdmin
                .from("users")
                .update({ ctf_score: currentCTFScore + pointsEarned })
                .eq("id", userId);
        }

        return Response.json({
            success: true,
            isCorrect,
            pointsEarned,
            message: isCorrect
                ? `✓ Correct! +${pointsEarned} points`
                : "✗ Incorrect flag. Try again!",
            correctFlag: isCorrect ? correctFlag : null,
        });
    } catch (error) {
        console.error("CTF submit error:", error);
        return Response.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
