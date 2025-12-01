import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import phase1Questions from '../data/phase1Questions.json';
import { motion } from 'framer-motion';

const Phase1 = () => {
    const { gameState, updatePhaseProgress, completePhase, teamId } = useGame();
    const [answer, setAnswer] = useState('');
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const currentQIndex = gameState.phaseProgress[1].currentQuestion || 0;
    const currentQuestion = phase1Questions[currentQIndex];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (answer.trim().toUpperCase() === currentQuestion.answer.toUpperCase()) {
            // Correct
            const nextIndex = currentQIndex + 1;
            if (nextIndex < phase1Questions.length) {
                updatePhaseProgress(1, { currentQuestion: nextIndex });
                setAnswer('');
                setError(false);
            } else {
                completePhase(1);
                navigate(`/team/${teamId}/dashboard`);
            }
        } else {
            setError(true);
            setTimeout(() => setError(false), 1000);
        }
    };

    return (
        <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8 text-primary">PHASE 1: QR HUNT</h2>

            <div className="glass-card p-8 mb-8">
                <div className="text-sm text-gray-400 mb-4">CLUE {currentQIndex + 1} OF {phase1Questions.length}</div>
                <div className="text-2xl font-mono mb-8">{currentQuestion.question}</div>

                <form onSubmit={handleSubmit} className="relative">
                    <input
                        type="text"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="ENTER CODE FOUND"
                        className={`w-full bg-black/50 border-2 rounded-lg p-4 text-center text-xl focus:outline-none transition-colors ${error ? 'border-error text-error' : 'border-primary/50 focus:border-primary'
                            }`}
                        autoFocus
                    />
                    <button
                        type="submit"
                        className="mt-6 bg-white text-black font-bold py-3 px-8 rounded hover:bg-primary transition-colors w-full"
                    >
                        SUBMIT
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Phase1;
