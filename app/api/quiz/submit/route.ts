import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { saveQuizResult, updateLabSession } from "@/lib/db";
import { getScenario } from "@/lib/scenarios";

export async function POST(req: NextRequest) {
    const session = await getServerSession();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId, scenarioId, answers } = await req.json();

    if (!sessionId || !scenarioId || !Array.isArray(answers)) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const scenario = getScenario(scenarioId);
    if (!scenario) {
        return NextResponse.json({ error: "Scenario not found" }, { status: 404 });
    }

    let totalCorrect = 0;

    for (const answer of answers) {
        const { questionId, selectedIndex } = answer;
        const question = scenario.quiz[questionId];
        if (!question) continue;

        const isCorrect = selectedIndex === question.correctIndex;
        if (isCorrect) totalCorrect++;

        await saveQuizResult(sessionId, questionId, selectedIndex, isCorrect);
    }

    // Update the session with the quiz score
    await updateLabSession(sessionId, { quiz_score: totalCorrect });

    return NextResponse.json({ score: totalCorrect, total: scenario.quiz.length });
}
