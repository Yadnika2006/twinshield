import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { getScenario } from "@/lib/scenarios";
import { completeTask, updateUserXP, getUserByEmail } from "@/lib/db";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId, scenarioId, taskId, type, answer } = await req.json();

    if (!sessionId || !scenarioId || !taskId || !type) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // For question tasks — verify the answer
    if (type === "question") {
        if (!answer) {
            return NextResponse.json({ error: "Answer is required for question tasks" }, { status: 400 });
        }

        const scenario = getScenario(scenarioId);
        if (!scenario) {
            return NextResponse.json({ error: "Scenario not found" }, { status: 404 });
        }

        const task = scenario.tasks.find(t => t.id === taskId);
        if (!task || task.type !== "question") {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        const correct =
            answer.trim().toLowerCase() === (task.expectedAnswer ?? "").trim().toLowerCase();

        if (!correct) {
            return NextResponse.json({ correct: false });
        }

        // Correct answer — mark complete and award XP
        await completeTask(sessionId, taskId, scenarioId, answer);
        const xpAwarded = taskId * 30;
        const user = await getUserByEmail(session.user.email);
        if (user) {
            await updateUserXP(user.id, xpAwarded);
        }

        return NextResponse.json({ correct: true, xpAwarded });
    }

    // For checklist tasks — mark complete immediately
    await completeTask(sessionId, taskId, scenarioId);
    const xpAwarded = taskId * 30;
    const user = await getUserByEmail(session.user.email);
    if (user) {
        await updateUserXP(user.id, xpAwarded);
    }

    return NextResponse.json({ success: true, xpAwarded });
}
