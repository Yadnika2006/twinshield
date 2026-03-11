export interface TerminalLine {
    text: string;
    type: 'command' | 'output' | 'success' | 'error' | 'warning' | 'info' | 'dim' | 'data' | 'separator';
    delay: number;
    /** When this line renders, ScenarioEngine will switch the victim panel to this screen id */
    trigger?: string;
}

export interface VictimScreen {
    id: string;
    type: 'inbox' | 'email' | 'browser' | 'terminal' | 'desktop' | 'login' | 'result' | 'mobile';
    url?: string;
    content: string;
}

export interface DecisionPoint {
    id: string;
    question: string;
    description: string;
    choices: {
        label: string;
        safe: boolean;
        consequence: string;
    }[];
}

export interface AgentMessage {
    agent: 'mentor' | 'guardian';
    type: 'lesson' | 'redflag' | 'alert' | 'tip' | 'prevention' | 'praise';
    text: string;
}

export interface ScenarioPhase {
    id: string;
    name: string;
    autoPlay: boolean;
    terminalLines: TerminalLine[];
    victimScreen: string;
    agentMessages: AgentMessage[];
    decisionPoint?: DecisionPoint;
    nextPhase?: string;
    progressPct: number;
}

export interface ScenarioScript {
    id: string;
    phases: ScenarioPhase[];
    victimScreens: VictimScreen[];
}

export type LabOutcome = 'compromised' | 'defended';
export type PhaseStatus = 'pending' | 'active' | 'complete';
