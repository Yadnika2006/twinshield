import { buildMentorPrompt } from '@/lib/agents/mentor-prompt';
import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { getAgentSettings } from '@/lib/db';
import { applyRateLimit, buildRateLimitHeaders } from '@/lib/rate-limit';
import { InvalidJsonBodyError, parseJsonBodyWithLimit, RequestBodyTooLargeError } from '@/lib/request-body';
import { mentorAgentRequestSchema } from '@/lib/validation/schemas';
import { ZodError } from 'zod';

const AGENT_BODY_MAX_BYTES = 20 * 1024;

function toSingleChunkSseResponse(content: string): Response {
    const payload =
        `data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\n\n` +
        'data: [DONE]\n\n';

    return new Response(payload, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        }
    });
}

function getSessionUserId(session: Awaited<ReturnType<typeof getServerSession>>): string | null {
    const user = session?.user as { id?: unknown } | undefined;
    return typeof user?.id === 'string' ? user.id : null;
}

function getValidationDetails(error: ZodError): string[] {
    return error.issues.map((issue) => {
        const path = issue.path.length ? issue.path.join('.') : 'body';
        return `${path}: ${issue.message}`;
    });
}

export async function POST(request: Request) {
    const rate = applyRateLimit(request, {
        namespace: 'agents-mentor',
        maxRequests: 30,
        windowMs: 60_000,
    });
    const rateHeaders = buildRateLimitHeaders(rate);

    if (!rate.success) {
        return NextResponse.json(
            { error: 'Too many requests. Please try again shortly.' },
            { status: 429, headers: rateHeaders }
        );
    }

    const session = await getServerSession();
    const userId = getSessionUserId(session);

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: rateHeaders });
    }

    try {
        const body = await parseJsonBodyWithLimit(request, AGENT_BODY_MAX_BYTES);
        const payload = mentorAgentRequestSchema.parse(body);

        const {
            scenarioId,
            scenarioName,
            attackType,
            currentPhase,
            phaseEvent,
            studentDecision,
            sessionHistory,
        } = payload;

        const mentorSettings = (await getAgentSettings(userId)).mentor;

        if (!mentorSettings.active) {
            return toSingleChunkSseResponse('Mentor AI is disabled in Agent Configuration.');
        }

        if (!process.env.GROQ_API_KEY) {
            return NextResponse.json(
                { error: 'Model provider is not configured' },
                { status: 503, headers: rateHeaders }
            );
        }

        const systemPrompt = buildMentorPrompt({
            scenarioId,
            scenarioName,
            attackType,
            currentPhase,
            phaseEvent,
            studentDecision,
            sessionHistory: sessionHistory || [],
            mentorSettings
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
                            content: `Phase: ${currentPhase}\nEvent: ${phaseEvent}\n${studentDecision ? 'Student just decided: ' + studentDecision : ''}\nRespond as Mentor AI now. Maximum 60 words.`
                        }
                    ]
                })
            }
        );

        if (!response.ok) {
            console.error('Groq API error (Mentor AI):', response.status);
            return NextResponse.json(
                { error: 'Agent provider unavailable' },
                { status: 502, headers: rateHeaders }
            );
        }

        return new Response(response.body, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                ...rateHeaders,
            }
        });

    } catch (error) {
        if (error instanceof RequestBodyTooLargeError) {
            return NextResponse.json(
                { error: `Payload too large (max ${AGENT_BODY_MAX_BYTES} bytes)` },
                { status: 413, headers: rateHeaders }
            );
        }

        if (error instanceof InvalidJsonBodyError) {
            return NextResponse.json(
                { error: error.message },
                { status: 400, headers: rateHeaders }
            );
        }

        if (error instanceof ZodError) {
            return NextResponse.json(
                {
                    error: 'Invalid request payload',
                    details: getValidationDetails(error),
                },
                { status: 400, headers: rateHeaders }
            );
        }

        console.error('Mentor AI route error:', error);
        return new Response(
            JSON.stringify({ error: 'Agent unavailable' }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    ...rateHeaders,
                }
            }
        );
    }
}
