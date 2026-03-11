import { buildMentorPrompt } from '@/lib/agents/mentor-prompt';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            scenarioId,
            scenarioName,
            attackType,
            currentPhase,
            phaseEvent,
            studentDecision,
            sessionHistory,
            teachingMode
        } = body;

        const systemPrompt = buildMentorPrompt({
            scenarioId,
            scenarioName,
            attackType,
            currentPhase,
            phaseEvent,
            studentDecision,
            sessionHistory: sessionHistory || [],
            teachingMode: teachingMode || 'CONTEXTUAL'
        });

        const response = await fetch(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'llama-3.1-8b-instant',
                    max_tokens: 150,
                    stream: true,
                    messages: [
                        {
                            role: 'system',
                            content: systemPrompt
                        },
                        {
                            role: 'user',
                            content: `Phase: ${currentPhase}\nEvent: ${phaseEvent}\n${studentDecision ? 'Student just decided: ' + studentDecision : ''}\nRespond as MentorAI now. Maximum 60 words.`
                        }
                    ]
                })
            }
        );

        if (!response.ok) {
            throw new Error(`Groq API error: ${response.status}`);
        }

        return new Response(response.body, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
            }
        });

    } catch (error) {
        console.error('MentorAI route error:', error);
        return new Response(
            JSON.stringify({ error: 'Agent unavailable' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}
