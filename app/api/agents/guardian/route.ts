import { buildGuardianPrompt } from '@/lib/agents/guardian-prompt';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            scenarioId,
            scenarioName,
            attackType,
            currentPhase,
            phaseEvent,
            redFlagsVisible,
            sessionHistory,
            socMode
        } = body;

        const systemPrompt = buildGuardianPrompt({
            scenarioId,
            scenarioName,
            attackType,
            currentPhase,
            phaseEvent,
            redFlagsVisible: redFlagsVisible || [],
            sessionHistory: sessionHistory || [],
            socMode: socMode || 'SOC_ANALYST'
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
                    max_tokens: 120,
                    stream: true,
                    messages: [
                        {
                            role: 'system',
                            content: systemPrompt
                        },
                        {
                            role: 'user',
                            content: `Phase: ${currentPhase}\nEvent: ${phaseEvent}\nRed flags visible: ${redFlagsVisible?.join(', ') || 'none'}\nRespond as GuardianAI now. Maximum 50 words. Start with RED FLAG, ALERT, or PREVENTION.`
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
        console.error('GuardianAI route error:', error);
        return new Response(
            JSON.stringify({ error: 'Agent unavailable' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}
