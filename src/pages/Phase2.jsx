import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import phase2Questions from '../data/phase2Questions.json';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, CheckCircle, Lock, MapPin, ArrowRight } from 'lucide-react';

const Phase2 = () => {
    const { gameState, updatePhaseProgress, completePhase, teamId } = useGame();
    const [answer, setAnswer] = useState('');
    const [error, setError] = useState(false);
    
    // Step 1 = Predict Output, Step 2 = Enter Location String
    const [step, setStep] = useState(1); 
    
    const navigate = useNavigate();

    const currentQIndex = gameState.phaseProgress[2].currentQuestion || 0;
    const currentQuestion = phase2Questions[currentQIndex];

    // Reset step when question changes
    useEffect(() => {
        setStep(1);
        setAnswer('');
        setError(false);
    }, [currentQIndex]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (step === 1) {
            // Validate Code Output
            if (answer.trim() === currentQuestion.outputAnswer) {
                setStep(2);
                setAnswer('');
                setError(false);
            } else {
                setError(true);
                setTimeout(() => setError(false), 1000);
            }
        } else {
            // Validate Final String
            if (answer.trim() === currentQuestion.finalAnswer) {
                const nextIndex = currentQIndex + 1;
                if (nextIndex < phase2Questions.length) {
                    updatePhaseProgress(2, { currentQuestion: nextIndex });
                } else {
                    completePhase(2);
                    navigate(`/team/${teamId}/dashboard`);
                }
            } else {
                setError(true);
                setTimeout(() => setError(false), 1000);
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <header className="flex items-center justify-between mb-8 border-b border-secondary/30 pb-4">
                <h2 className="text-3xl font-bold text-secondary neon-text">PHASE 2: LOGIC GATE</h2>
                <div className="text-sm font-mono text-gray-400">
                    NODE {currentQIndex + 1} / {phase2Questions.length}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Left Column: The Problem */}
                <div className="space-y-6">
                    <div className="glass-card p-6 border-l-4 border-l-secondary relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-secondary/20 px-3 py-1 text-xs font-bold text-secondary">
                            MODULE: {currentQuestion.module}
                        </div>
                        <p className="font-mono text-sm text-gray-300 mt-4 mb-4">
                            {currentQuestion.log}
                        </p>
                        
                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                                <motion.div
                                    key="code"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="bg-black/80 p-4 rounded-lg border border-white/10 font-mono text-xs md:text-sm text-green-400 whitespace-pre-wrap shadow-inner"
                                >
                                    {currentQuestion.code}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-success/10 p-8 rounded-lg border border-success/30 flex flex-col items-center text-center"
                                >
                                    <CheckCircle size={48} className="text-success mb-4" />
                                    <h3 className="text-xl font-bold text-white">OUTPUT VERIFIED</h3>
                                    <p className="text-gray-400 text-sm mt-2">
                                        Logic trace complete. Physical location data unlocked.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right Column: Interaction */}
                <div className="flex flex-col justify-center space-y-6">
                    
                    {/* Step 1 Indicator */}
                    <div className={`transition-all duration-300 ${step === 1 ? 'opacity-100' : 'opacity-50 grayscale'}`}>
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-400 mb-2">
                            <Terminal size={16} /> STEP 1: PREDICT OUTPUT
                        </div>
                    </div>

                    {/* Step 2 Indicator (Hint) */}
                    <AnimatePresence>
                        {step === 2 && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                className="glass-card p-6 border-secondary shadow-[0_0_20px_rgba(188,19,254,0.2)]"
                            >
                                <div className="flex items-center gap-2 text-secondary font-bold mb-2">
                                    <MapPin size={20} /> PHYSICAL LOCATION HINT
                                </div>
                                <div className="text-xl text-white font-bold text-center py-4 neon-text">
                                    "{currentQuestion.hint}"
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Input Form */}
                    <form onSubmit={handleSubmit} className="relative mt-4">
                        <input
                            type="text"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder={step === 1 ? "ENTER CODE OUTPUT" : "ENTER FOUND STRING"}
                            className={`w-full bg-black/50 border-2 rounded-lg p-5 pl-12 text-xl font-mono focus:outline-none transition-all ${
                                error 
                                ? 'border-error text-error' 
                                : 'border-secondary/50 text-white focus:border-secondary focus:shadow-[0_0_20px_rgba(188,19,254,0.3)]'
                            }`}
                            autoFocus
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                            {step === 1 ? <Terminal size={20} /> : <Lock size={20} />}
                        </div>
                        
                        <button
                            type="submit"
                            className="mt-4 bg-gradient-to-r from-secondary to-purple-800 text-white font-bold py-4 px-8 rounded w-full hover:scale-[1.02] transition-transform shadow-lg flex items-center justify-center gap-2"
                        >
                            {step === 1 ? 'VERIFY LOGIC' : 'UNLOCK NODE'} <ArrowRight size={20} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Phase2;