"use client";

import { useState } from "react";
import { getScenario } from "@/lib/scenarios";

interface QuizQuestion {
    id: number;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

interface Props {
    scenarioId: string;
    sessionId: string;
    onComplete: (score: number) => void;
}

const OPTION_LABELS = ["A", "B", "C", "D"];

export default function QuizPanel({ scenarioId, sessionId, onComplete }: Props) {
    const scenario = getScenario(scenarioId);
    const questions: QuizQuestion[] = scenario?.quiz || [];

    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [answers, setAnswers] = useState<number[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [loading, setLoading] = useState(false);

    if (questions.length === 0) {
        return (
            <div className="empty-state">
                No quiz data found for this scenario.
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIdx];

    const handleNext = () => {
        if (selectedAnswer === null) return;

        const newAnswers = [...answers, selectedAnswer];
        setAnswers(newAnswers);

        if (currentQuestionIdx < questions.length - 1) {
            setCurrentQuestionIdx(currentQuestionIdx + 1);
            setSelectedAnswer(null);
        } else {
            handleSubmit(newAnswers);
        }
    };

    const handleSubmit = async (finalAnswers: number[]) => {
        setLoading(true);
        let finalScore = 0;
        const submitPayload = finalAnswers.map((ans, idx) => {
            const isCorrect = ans === questions[idx].correctIndex;
            if (isCorrect) finalScore++;
            return {
                questionId: idx,
                selectedIndex: ans
            };
        });

        setScore(finalScore);
        setSubmitted(true);
        setShowResults(true);

        // Only submit to API if sessionId looks like a valid UUID (not a scenario slug)
        if (sessionId && sessionId.includes('-')) {
            try {
                const res = await fetch('/api/quiz/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        sessionId,
                        scenarioId,
                        answers: submitPayload
                    })
                });
                if (!res.ok) {
                    console.warn("Quiz submit API returned", res.status);
                }
            } catch (error) {
                console.error("Failed to submit quiz results:", error);
            }
        }
        setLoading(false);
    };

    const getGradeInfo = (s: number) => {
        const total = questions.length;
        if (s === total) return { label: "S+ PERFECT", color: "#FFD700", bg: "rgba(255,215,0,0.1)", xp: 100 };
        if (s >= total * 0.8) return { label: "A EXCELLENT", color: "#00ff88", bg: "rgba(0,255,136,0.1)", xp: 80 };
        if (s >= total * 0.6) return { label: "B GOOD", color: "#00d4ff", bg: "rgba(0,212,255,0.1)", xp: 60 };
        if (s >= total * 0.4) return { label: "C AVERAGE", color: "#FFCC00", bg: "rgba(255,204,0,0.1)", xp: 40 };
        if (s >= total * 0.2) return { label: "D NEEDS WORK", color: "#FF8800", bg: "rgba(255,136,0,0.1)", xp: 20 };
        return { label: "F RETRY", color: "#ff4444", bg: "rgba(255,68,68,0.1)", xp: 0 };
    };

    const cleanOption = (opt: string) => {
        return opt.replace(/^[A-D][:.]\s*/, '');
    };

    const grade = getGradeInfo(score);

    return (
        <div className="center-scroll">
            {showResults ? (
                <div className="quiz-container fade-in results-container">
                    <div className="results-header text-center mb-8">
                        <h2 className="orbitron title-label">QUIZ COMPLETE</h2>
                        <div className="grade-section mt-6">
                            <div className="grade-row">
                                <div className="grade-score orbitron" style={{ color: grade.color }}>
                                    {score}/{questions.length}
                                </div>
                                <div className="grade-details">
                                    <div className="grade-badge orbitron" style={{ background: grade.bg, color: grade.color, borderColor: grade.color }}>
                                        {grade.label}
                                    </div>
                                    <div className="grade-subtext font-mono">SCORE ACHIEVED</div>
                                </div>
                            </div>
                            
                            <div className="xp-award mt-2">
                                <span className="orbitron text-cyan">+{grade.xp} XP AWARDED</span>
                            </div>
                        </div>
                    </div>

                    <div className="results-list">
                        {questions.map((q, idx) => {
                            const userAns = answers[idx];
                            const isCorrect = userAns === q.correctIndex;
                            return (
                                <div key={idx} className="result-item">
                                    <div className="result-item-flex">
                                        <div className={`result-icon ${isCorrect ? 'icon-correct' : 'icon-wrong'}`}>
                                            {isCorrect ? '✓' : '✗'}
                                        </div>
                                        <div className="result-content">
                                            <p className="result-question">{q.question}</p>
                                            
                                            <div className="options-grid">
                                                {q.options.map((opt, oIdx) => {
                                                    const cleanedOpt = cleanOption(opt);
                                                    const isSelected = userAns === oIdx;
                                                    const isRightOne = oIdx === q.correctIndex;
                                                    
                                                    let className = "result-option";
                                                    if (isRightOne) {
                                                        className += " option-correct";
                                                    } else if (isSelected && !isCorrect) {
                                                        className += " option-incorrect";
                                                    }

                                                    return (
                                                        <div key={oIdx} className={className}>
                                                            <span className="opt-label mini font-mono">{OPTION_LABELS[oIdx]}</span>
                                                            <span className="opt-text">{cleanedOpt}</span>
                                                            {isRightOne && <span className="opt-indicator text-green">✓</span>}
                                                            {(isSelected && !isCorrect) && <span className="opt-indicator text-red">✗</span>}
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <div className="explanation-box">
                                                <p className="exp-label font-mono">EXPLANATION</p>
                                                <p className="exp-text">{q.explanation}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="cta-container">
                        <button 
                            className="btn-continue orbitron"
                            onClick={() => onComplete(score)}
                        >
                            COMPLETE QUIZ ✓
                        </button>
                    </div>
                </div>
            ) : (
                <div className="quiz-container fade-in">
                    <div className="quiz-header">
                        <div className="header-top">
                            <div>
                                <h2 className="orbitron title-label">KNOWLEDGE CHECK</h2>
                                <p className="scenario-label font-mono mt-1">SCENARIO: {scenarioId.toUpperCase()}</p>
                            </div>
                            <div className="progress-text">
                                <span className="orbitron current-num">0{currentQuestionIdx + 1}</span>
                                <span className="divider font-mono">/</span>
                                <span className="total-num font-mono">{String(questions.length).padStart(2, '0')}</span>
                            </div>
                        </div>
                        <div className="progress-bar-bg">
                            <div 
                                className="progress-bar-fill" 
                                style={{ 
                                    width: `${((currentQuestionIdx + 1) / questions.length) * 100}%`
                                }}
                            />
                        </div>
                    </div>

                    <div className="q-card">
                        <h3 className="question-text">
                            {currentQuestion.question}
                        </h3>

                        <div className="options-container">
                            {currentQuestion.options.map((opt, idx) => {
                                const cleanedOpt = cleanOption(opt);
                                const isSelected = selectedAnswer === idx;
                                return (
                                    <button
                                        key={idx}
                                        className={`option-btn ${isSelected ? 'sel' : ''}`}
                                        onClick={() => setSelectedAnswer(idx)}
                                    >
                                        <span className="opt-label font-mono">
                                            {OPTION_LABELS[idx]}
                                        </span>
                                        <span className="opt-text">{cleanedOpt}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="action-container">
                        <button
                            className="btn-continue orbitron"
                            disabled={selectedAnswer === null || loading}
                            onClick={handleNext}
                        >
                            {loading ? '...' : currentQuestionIdx === questions.length - 1 ? 'SUBMIT QUIZ' : 'NEXT QUESTION →'}
                        </button>
                    </div>
                </div>
            )}
            
            <style jsx>{`
                .center-scroll {
                    width: 100%;
                    height: 100%;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    padding: 20px;
                }
                .quiz-container {
                    background: #091a2e;
                    padding: 40px;
                    border-radius: 12px;
                    max-width: 700px;
                    margin: 40px auto;
                    width: 100%;
                    box-sizing: border-box;
                }
                .results-container {
                    max-width: 800px;
                }
                .orbitron { font-family: 'Orbitron', sans-serif; }
                .font-mono { font-family: 'Share Tech Mono', monospace; }
                .fade-in { animation: fadeIn 0.5s ease-out; }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* Header */
                .quiz-header { margin-bottom: 32px; }
                .header-top { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 16px; }
                .title-label { color: #00d4ff; font-size: 1.5rem; font-weight: bold; margin: 0; }
                .scenario-label { font-size: 0.875rem; color: rgba(255,255,255,0.5); margin-top: 4px; margin-bottom: 0; }
                .progress-text { text-align: right; }
                .current-num { color: #00d4ff; font-size: 1.25rem; }
                .divider { color: rgba(255,255,255,0.3); margin: 0 8px; }
                .total-num { color: rgba(255,255,255,0.3); }

                /* Progress Bar */
                .progress-bar-bg { width: 100%; height: 6px; background: rgba(255,255,255,0.05); border-radius: 999px; overflow: hidden; }
                .progress-bar-fill { height: 100%; background: #00d4ff; box-shadow: 0 0 10px #00d4ff; transition: width 0.5s ease-out; }

                /* Question */
                .q-card { margin-bottom: 40px; }
                .question-text { font-family: 'Exo 2', sans-serif; font-size: 1.5rem; color: white; margin-top: 0; margin-bottom: 32px; line-height: 1.4; font-weight: 500;}
                .options-container { display: flex; flex-direction: column; gap: 12px; }

                /* Options */
                .option-btn {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 20px;
                    border-radius: 8px;
                    border: 1px solid rgba(0, 212, 255, 0.2);
                    background: rgba(0, 212, 255, 0.05);
                    text-align: left;
                    cursor: pointer;
                    transition: all 0.2s;
                    width: 100%;
                    outline: none;
                }
                .option-btn:hover {
                    background: rgba(0, 212, 255, 0.1);
                }
                .option-btn.sel {
                    border-color: #00d4ff;
                    background: rgba(0, 212, 255, 0.15);
                }
                .opt-label {
                    width: 40px;
                    height: 40px;
                    flex-shrink: 0;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    background: rgba(255, 255, 255, 0.05);
                    color: rgba(255, 255, 255, 0.4);
                    transition: all 0.2s;
                }
                .opt-label.mini {
                    width: 28px;
                    height: 28px;
                    font-size: 0.75rem;
                }
                .option-btn.sel .opt-label {
                    background: #00d4ff;
                    color: #000;
                }
                .opt-text {
                    color: white;
                    opacity: 0.8;
                    font-size: 1rem;
                    line-height: 1.5;
                    font-family: 'Exo 2', sans-serif;
                }
                .option-btn:hover .opt-text { opacity: 1; }

                /* Action Button */
                .action-container { display: flex; justify-content: flex-end; }
                .btn-continue {
                    padding: 16px 40px;
                    border-radius: 8px;
                    background: #00d4ff;
                    color: #000;
                    font-weight: bold;
                    border: none;
                    cursor: pointer;
                    transition: transform 0.2s, opacity 0.2s;
                    font-size: 1rem;
                }
                .btn-continue:hover:not(:disabled) { transform: scale(1.05); }
                .btn-continue:active:not(:disabled) { transform: scale(0.95); }
                .btn-continue:disabled { opacity: 0.3; cursor: not-allowed; }

                /* Results */
                .text-center { text-align: center; }
                .mb-8 { margin-bottom: 32px; }
                .mt-6 { margin-top: 24px; }
                .mt-2 { margin-top: 8px; }
                .mt-4 { margin-top: 16px; }
                .grade-section { display: flex; flex-direction: column; align-items: center; gap: 16px; margin-top: 24px; }
                .grade-row { display: flex; align-items: center; justify-content: center; gap: 24px; }
                .grade-score { font-size: 4rem; font-weight: bold; line-height: 1; }
                .grade-details { display: flex; flex-direction: column; align-items: flex-start; }
                .grade-badge { padding: 4px 16px; border-radius: 4px; font-size: 0.85rem; border: 1px solid; margin-bottom: 4px; }
                .grade-subtext { font-size: 0.85rem; color: rgba(255,255,255,0.6); }
                .xp-award { display: inline-block; padding: 12px 24px; border-radius: 999px; background: rgba(0, 212, 255, 0.1); border: 1px solid rgba(0, 212, 255, 0.3); }
                .text-cyan { color: #00d4ff; }
                .text-green { color: #00ff88; }
                .text-red { color: #ff4444; }

                /* Result List */
                .results-list { margin-top: 48px; display: flex; flex-direction: column; gap: 32px; }
                .result-item { border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 32px; }
                .result-item:last-child { border-bottom: none; }
                .result-item-flex { display: flex; gap: 16px; }
                .result-icon { width: 32px; height: 32px; flex-shrink: 0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.2rem; }
                .icon-correct { background: rgba(0, 255, 136, 0.1); color: #00ff88; }
                .icon-wrong { background: rgba(255, 68, 68, 0.1); color: #ff4444; }
                .result-content { flex-grow: 1; }
                .result-question { font-family: 'Exo 2', sans-serif; font-size: 1.1rem; color: white; margin-bottom: 16px; margin-top: 4px; line-height: 1.4; }
                .options-grid { display: flex; flex-direction: column; gap: 8px; }
                .result-option { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 4px; border: 1px solid rgba(255, 255, 255, 0.05); background: rgba(255, 255, 255, 0.02); }
                .result-option .opt-text { font-size: 0.9rem; color: rgba(255, 255, 255, 0.8); flex-grow: 1;}
                .option-correct { border-color: #00ff88; background: rgba(0, 255, 136, 0.15); }
                .option-incorrect { border-color: #ff4444; background: rgba(255, 68, 68, 0.1); }
                .opt-indicator { margin-left: auto; font-weight: bold; font-size: 1.1rem; }
                .explanation-box { margin-top: 16px; padding: 16px; border-radius: 4px; background: rgba(187, 136, 255, 0.08); border: 1px solid rgba(187, 136, 255, 0.2); border-left: 3px solid #bb88ff; }
                .exp-label { font-size: 0.75rem; color: #bb88ff; letter-spacing: 2px; margin-bottom: 8px; margin-top: 0; text-transform: uppercase; }
                .exp-text { font-size: 0.9rem; color: rgba(255,255,255,0.8); line-height: 1.6; margin: 0; font-family: 'Exo 2', sans-serif;}
                .cta-container { display: flex; justify-content: center; margin-top: 48px; padding-bottom: 40px; }
                
            `}</style>
        </div>
    );
}

