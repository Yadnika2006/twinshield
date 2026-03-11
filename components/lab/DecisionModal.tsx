import React, { useState } from 'react';
import { DecisionPoint } from '../../lib/lab-engine';

interface DecisionModalProps {
    decision: DecisionPoint | null;
    onChoice: (choiceIndex: number, safe: boolean) => void;
    visible: boolean;
}

export default function DecisionModal({ decision, onChoice, visible }: DecisionModalProps) {
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
    const [showConq, setShowConq] = useState(false);

    if (!visible || !decision) return null;

    const handleSelect = (idx: number, safe: boolean) => {
        if (selectedIdx !== null) return; // Prevent double clicks

        setSelectedIdx(idx);
        setShowConq(true);

        setTimeout(() => {
            onChoice(idx, safe);
            setShowConq(false);
            setSelectedIdx(null);
        }, 1500);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-card">
                <div className="modal-header">
                    <span className="icon">⚡</span>
                    <span className="orbitron">DECISION POINT</span>
                </div>

                <div className="modal-body">
                    <h2 className="question">{decision.question}</h2>
                    <p className="description">{decision.description}</p>

                    <div className="choices">
                        {decision.choices.map((choice, idx) => {
                            const isSelected = selectedIdx === idx;
                            const styleClass = choice.safe ? 'safe' : 'unsafe';
                            const stateClass = isSelected ? 'selected' : (selectedIdx !== null ? 'dimmed' : '');

                            return (
                                <div key={idx} className={`choice-wrapper ${stateClass}`}>
                                    <button
                                        className={`choice-btn ${styleClass}`}
                                        onClick={() => handleSelect(idx, choice.safe)}
                                        disabled={selectedIdx !== null}
                                    >
                                        {choice.label}
                                    </button>
                                    {isSelected && showConq && (
                                        <div className="consequence slide-down">
                                            <span className="icon">↳</span> {choice.consequence}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <style jsx>{`
        .modal-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          animation: fadeIn 0.3s;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        
        .modal-card {
          width: 90%;
          max-width: 500px;
          background: #091a2e;
          border: 2px solid #ffcc00;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 0 30px rgba(255,204,0,0.2);
          animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes popIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }

        .modal-header {
          background: rgba(255,204,0,0.15);
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid rgba(255,204,0,0.3);
        }
        .icon { font-size: 1.2rem; }
        .orbitron { font-family: 'Orbitron', sans-serif; font-size: 1.2rem; color: #ffcc00; font-weight: bold; letter-spacing: 1px; }

        .modal-body {
          padding: 30px 24px;
        }
        .question {
          font-family: 'Exo 2', sans-serif;
          font-size: 1.2rem;
          color: #fff;
          margin: 0 0 12px 0;
          line-height: 1.4;
        }
        .description {
          font-size: 0.9rem;
          color: #88a0b8;
          margin: 0 0 24px 0;
          line-height: 1.5;
        }

        .choices {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .choice-wrapper {
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: 0.3s;
        }
        .choice-wrapper.dimmed { opacity: 0.4; }

        .choice-btn {
          width: 100%;
          padding: 16px 20px;
          text-align: left;
          font-family: 'Exo 2', sans-serif;
          font-size: 1rem;
          font-weight: 500;
          background: rgba(0,0,0,0.3);
          border: 2px solid;
          border-radius: 6px;
          cursor: pointer;
          transition: 0.2s;
        }
        .choice-btn:disabled { cursor: default; }

        .choice-btn.safe { border-color: #00ff88; color: #00ff88; }
        .choice-btn.safe:hover:not(:disabled) { background: rgba(0,255,136,0.1); box-shadow: 0 0 15px rgba(0,255,136,0.3); }
        .choice-btn.safe:disabled { border-color: #00ff88; color: #00ff88; }

        .choice-btn.unsafe { border-color: #ff4444; color: #ff4444; }
        .choice-btn.unsafe:hover:not(:disabled) { background: rgba(255,68,68,0.1); box-shadow: 0 0 15px rgba(255,68,68,0.3); }
        .choice-btn.unsafe:disabled { border-color: #ff4444; color: #ff4444; }

        .consequence {
          background: rgba(0,0,0,0.4);
          padding: 12px 16px;
          border-radius: 4px;
          font-size: 0.9rem;
          color: #c8e6f0;
          border-left: 2px solid rgba(255,255,255,0.2);
          display: flex;
          gap: 10px;
        }
        .slide-down { animation: slideDown 0.3s ease-out; }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
        </div>
    );
}
