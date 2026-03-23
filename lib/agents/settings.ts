export const mentorTeachingModes = ['observe', 'contextual', 'deep_dive', 'step_by_step'] as const;
export const mentorPersonalities = ['academic', 'friendly', 'concise'] as const;
export const defenseModes = ['rookie', 'soc_analyst', 'autonomous', 'adversarial'] as const;
export const alertSensitivityLevels = ['low', 'medium', 'high'] as const;

export type MentorTeachingMode = (typeof mentorTeachingModes)[number];
export type MentorPersonality = (typeof mentorPersonalities)[number];
export type DefenseMode = (typeof defenseModes)[number];
export type AlertSensitivity = (typeof alertSensitivityLevels)[number];

export interface MentorAgentToggles {
    realWorldExamples: boolean;
    psychologicalContext: boolean;
    postLessonSummary: boolean;
    technicalDetails: boolean;
}

export interface DefenseAgentToggles {
    autoBlock: boolean;
    postMortem: boolean;
    realtimeAlerts: boolean;
    diffScaling: boolean;
}

export interface MentorAgentSettings {
    active: boolean;
    teachingMode: MentorTeachingMode;
    explanationDepth: number;
    toggles: MentorAgentToggles;
    personality: MentorPersonality;
}

export interface DefenseAgentSettings {
    active: boolean;
    defenceMode: DefenseMode;
    aggression: number;
    toggles: DefenseAgentToggles;
    alertSensitivity: AlertSensitivity;
}

export interface AgentSettings {
    mentor: MentorAgentSettings;
    defense: DefenseAgentSettings;
}

export const defaultAgentSettings: AgentSettings = {
    mentor: {
        active: true,
        teachingMode: 'contextual',
        explanationDepth: 50,
        toggles: {
            realWorldExamples: true,
            psychologicalContext: true,
            postLessonSummary: true,
            technicalDetails: false,
        },
        personality: 'friendly',
    },
    defense: {
        active: true,
        defenceMode: 'soc_analyst',
        aggression: 40,
        toggles: {
            autoBlock: true,
            postMortem: true,
            realtimeAlerts: true,
            diffScaling: true,
        },
        alertSensitivity: 'medium',
    },
};

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseBoolean(value: unknown, fallback: boolean): boolean {
    return typeof value === 'boolean' ? value : fallback;
}

function parseNumber(value: unknown, fallback: number): number {
    return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

function parseEnum<T extends readonly string[]>(
    value: unknown,
    allowed: T,
    fallback: T[number]
): T[number] {
    return typeof value === 'string' && (allowed as readonly string[]).includes(value)
        ? (value as T[number])
        : fallback;
}

export function sanitizeMentorSettings(input: unknown): MentorAgentSettings {
    const source = isRecord(input) ? input : {};
    const toggles = isRecord(source.toggles) ? source.toggles : {};

    return {
        active: parseBoolean(source.active, defaultAgentSettings.mentor.active),
        teachingMode: parseEnum(source.teachingMode, mentorTeachingModes, defaultAgentSettings.mentor.teachingMode),
        explanationDepth: clamp(
            parseNumber(source.explanationDepth, defaultAgentSettings.mentor.explanationDepth),
            0,
            100
        ),
        toggles: {
            realWorldExamples: parseBoolean(
                toggles.realWorldExamples,
                defaultAgentSettings.mentor.toggles.realWorldExamples
            ),
            psychologicalContext: parseBoolean(
                toggles.psychologicalContext,
                defaultAgentSettings.mentor.toggles.psychologicalContext
            ),
            postLessonSummary: parseBoolean(
                toggles.postLessonSummary,
                defaultAgentSettings.mentor.toggles.postLessonSummary
            ),
            technicalDetails: parseBoolean(
                toggles.technicalDetails,
                defaultAgentSettings.mentor.toggles.technicalDetails
            ),
        },
        personality: parseEnum(source.personality, mentorPersonalities, defaultAgentSettings.mentor.personality),
    };
}

export function sanitizeDefenseSettings(input: unknown): DefenseAgentSettings {
    const source = isRecord(input) ? input : {};
    const toggles = isRecord(source.toggles) ? source.toggles : {};

    return {
        active: parseBoolean(source.active, defaultAgentSettings.defense.active),
        defenceMode: parseEnum(source.defenceMode, defenseModes, defaultAgentSettings.defense.defenceMode),
        aggression: clamp(parseNumber(source.aggression, defaultAgentSettings.defense.aggression), 0, 100),
        toggles: {
            autoBlock: parseBoolean(toggles.autoBlock, defaultAgentSettings.defense.toggles.autoBlock),
            postMortem: parseBoolean(toggles.postMortem, defaultAgentSettings.defense.toggles.postMortem),
            realtimeAlerts: parseBoolean(
                toggles.realtimeAlerts,
                defaultAgentSettings.defense.toggles.realtimeAlerts
            ),
            diffScaling: parseBoolean(toggles.diffScaling, defaultAgentSettings.defense.toggles.diffScaling),
        },
        alertSensitivity: parseEnum(
            source.alertSensitivity,
            alertSensitivityLevels,
            defaultAgentSettings.defense.alertSensitivity
        ),
    };
}

export function sanitizeAgentSettings(input: unknown): AgentSettings {
    const source = isRecord(input) ? input : {};

    return {
        mentor: sanitizeMentorSettings(source.mentor),
        defense: sanitizeDefenseSettings(source.defense),
    };
}

export function getExplanationDepthTier(depth: number): 'simple' | 'balanced' | 'technical' {
    if (depth <= 30) return 'simple';
    if (depth >= 70) return 'technical';
    return 'balanced';
}

export function getAggressionTier(aggression: number): 'passive' | 'moderate' | 'aggressive' {
    if (aggression <= 30) return 'passive';
    if (aggression >= 70) return 'aggressive';
    return 'moderate';
}
