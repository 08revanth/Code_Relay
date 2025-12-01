import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import phase2Questions from '../data/phase2Questions.json';
import { motion } from 'framer-motion';

const Phase2 = () => {
    const { gameState, updatePhaseProgress, completePhase, teamId } = useGame();
    const [answer, setAnswer] = useState('');
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const currentQIndex = gameState.phaseProgress[2].currentQuestion || 0;
    const currentQuestion = phase2Questions[currentQIndex];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (answer.trim() === currentQuestion.answer) {
            const nextIndex = currentQIndex + 1;
            if (nextIndex < phase2Questions.length) {
                updatePhaseProgress(2, { currentQuestion: nextIndex });
                setAnswer('');
                setError(false);
            } else {
                completePhase(2);
                navigate(`/team/${teamId}/dashboard`);
            }
        } else {
            setError(true);
            setTimeout(() => setError(false), 1000);
        }
    };

    return (
        <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8 text-secondary">PHASE 2: OUTPUT PREDICTION</h2>

            <div className="glass-card p-8 mb-8 text-left">
                <div className="text-sm text-gray-400 mb-4 text-center">CHALLENGE {currentQIndex + 1} OF {phase2Questions.length}</div>

                <div className="bg-black p-6 rounded-lg border border-white/10 font-mono text-green-400 mb-8 whitespace-pre-wrap">
                    {currentQuestion.code}
                </div>

                <form onSubmit={handleSubmit} className="relative">
                    <input
                        type="text"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="PREDICT OUTPUT"
                        className={`w-full bg-black/50 border-2 rounded-lg p-4 text-center text-xl focus:outline-none transition-colors ${error ? 'border-error text-error' : 'border-secondary/50 focus:border-secondary'
                            }`}
                        autoFocus
                    />
                    <button
                        type="submit"
                        className="mt-6 bg-secondary text-white font-bold py-3 px-8 rounded hover:bg-secondary/80 transition-colors w-full"
                    >
                        VERIFY
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Phase2;
