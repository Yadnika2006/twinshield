import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { getUserCTFProgress, getUserCTFStats } from "@/lib/db";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as any).id || (session.user as any).userId;
        if (!userId) {
            return Response.json(
                { error: "User ID not found in session" },
                { status: 400 }
            );
        }

        const progress = await getUserCTFProgress(userId);
        const stats = await getUserCTFStats(userId);

        return Response.json({
            progress,
            stats,
        });
    } catch (error) {
        console.error("CTF progress error:", error);
        return Response.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
