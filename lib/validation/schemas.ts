import { z } from "zod";
import {
    alertSensitivityLevels,
    defenseModes,
    mentorPersonalities,
    mentorTeachingModes,
} from "@/lib/agents/settings";

const shortText = (maxLength: number) => z.string().trim().min(1).max(maxLength);

const boundedStringArray = (itemMaxLength: number, maxItems: number) =>
    z.array(z.string().trim().min(1).max(itemMaxLength)).max(maxItems);

const mentorSettingsSchema = z
    .object({
        active: z.boolean(),
        teachingMode: z.enum(mentorTeachingModes),
        explanationDepth: z.number().finite().min(0).max(100),
        toggles: z
            .object({
                realWorldExamples: z.boolean(),
                psychologicalContext: z.boolean(),
                postLessonSummary: z.boolean(),
                technicalDetails: z.boolean(),
            })
            .strict(),
        personality: z.enum(mentorPersonalities),
    })
    .strict();

const defenseSettingsSchema = z
    .object({
        active: z.boolean(),
        defenceMode: z.enum(defenseModes),
        aggression: z.number().finite().min(0).max(100),
        toggles: z
            .object({
                autoBlock: z.boolean(),
                postMortem: z.boolean(),
                realtimeAlerts: z.boolean(),
                emailAlerts: z.boolean(),
                diffScaling: z.boolean(),
            })
            .strict(),
        alertSensitivity: z.enum(alertSensitivityLevels),
    })
    .strict();

export const mentorAgentRequestSchema = z
    .object({
        scenarioId: shortText(80),
        scenarioName: shortText(120),
        attackType: shortText(120),
        currentPhase: shortText(120),
        phaseEvent: shortText(2000),
        studentDecision: z.string().trim().max(1000).optional(),
        sessionHistory: boundedStringArray(1000, 50).default([]),
        teachingMode: z.enum(mentorTeachingModes).optional(),
        mentorSettings: mentorSettingsSchema.optional(),
    })
    .strict();

export const guardianAgentRequestSchema = z
    .object({
        scenarioId: shortText(80),
        scenarioName: shortText(120),
        attackType: shortText(120),
        currentPhase: shortText(120),
        phaseEvent: shortText(2000),
        redFlagsVisible: boundedStringArray(300, 30).default([]),
        sessionHistory: boundedStringArray(1000, 50).default([]),
        socMode: z.enum(defenseModes).optional(),
        defenseSettings: defenseSettingsSchema.optional(),
    })
    .strict();

const allowedRoles = ["student", "instructor", "admin"] as const;

export const registerRequestSchema = z
    .object({
        email: z.string().trim().email().max(254),
        password: z.string().min(8).max(128),
        name: z.string().trim().min(1).max(80),
        role: z.enum(allowedRoles).optional(),
    })
    .strict();

export const labStartRequestSchema = z
    .object({
        scenarioId: shortText(80),
    })
    .strict();

export const labCompleteRequestSchema = z
    .object({
        sessionId: shortText(120),
        duration: z.number().int().min(0).max(86_400).optional().default(0),
        attackerScore: z.number().int().min(0).max(100).optional().default(0),
        defenderScore: z.number().int().min(0).max(100).optional().default(0),
        quizScore: z.number().int().min(0).max(100).optional().default(0),
        tasksCompleted: z.number().int().min(0).max(100).optional().default(0),
    })
    .strict();

export const labTaskRequestSchema = z
    .object({
        sessionId: shortText(120),
        scenarioId: shortText(80),
        taskId: z.number().int().min(1).max(500),
        type: z.enum(["question", "checklist"]),
        answer: z.string().trim().max(1000).optional(),
    })
    .strict();

export const quizSubmitRequestSchema = z
    .object({
        sessionId: shortText(120),
        scenarioId: shortText(80),
        answers: z
            .array(
                z
                    .object({
                        questionId: z.number().int().min(0).max(500),
                        selectedIndex: z.number().int().min(0).max(50),
                    })
                    .strict()
            )
            .min(1)
            .max(100),
    })
    .strict();
