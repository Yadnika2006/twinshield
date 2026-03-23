import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { saveCTFAttempt } from "@/lib/db";
import { applyRateLimit, buildRateLimitHeaders } from "@/lib/rate-limit";

const CTF_FLAGS: Record<string, string> = {
    "loginbreaker-01": "FLAG{sql_bypass_admin}",
    "phishmaster-01": "FLAG{homograph_attack_detected}",
    "cookiemonster-01": "FLAG{session_fixation_pwned}",
    "xssploit-01": "FLAG{xss_cookie_stolen}",
    "mitmbreaker-01": "FLAG{arp_poison_cracked}",
};

const CTF_POINTS: Record<string, number> = {
    "loginbreaker-01": 100,
    "phishmaster-01": 150,
    "cookiemonster-01": 200,
    "xssploit-01": 200,
    "mitmbreaker-01": 350,
};

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const sessionUser = session.user as {
            id?: string;
            userId?: string;
            email?: string | null;
        };

        let userId = sessionUser.id || sessionUser.userId;

        if (!userId) {
            const { data: userByEmail } = await supabaseAdmin
                .from("users")
                .select("id")
                .eq("email", session.user.email)
                .single();
            userId = userByEmail?.id;
        }

        if (!userId) {
            return Response.json(
                { error: "User ID not found in session" },
                { status: 400 }
            );
        }

        const rate = applyRateLimit(req, {
            namespace: `ctf-submit:${userId}`,
            maxRequests: 50,
            windowMs: 60 * 60 * 1000,
        });
        if (!rate.success) {
            return Response.json(
                { error: "Too many submissions. Try again later." },
                { status: 429, headers: buildRateLimitHeaders(rate) }
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
            persisted: Boolean(attempt),
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
