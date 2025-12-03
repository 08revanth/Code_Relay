import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import phase1Questions from '../data/phase1Questions.json';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle, Lock, Unlock } from 'lucide-react';

const HINT_DELAY_SECONDS = 300; // 5 minutes

const Phase1 = () => {
    const { gameState, updatePhaseProgress, completePhase, teamId } = useGame();
    const [answer, setAnswer] = useState('');
    const [error, setError] = useState(false);
    const [timeLeft, setTimeLeft] = useState(HINT_DELAY_SECONDS);
    const navigate = useNavigate();

    // 1. Initialize Order and Timer if missing
    useEffect(() => {
        const phaseData = gameState.phaseProgress[1];
        
        // If no random order exists, create one (Persistent Randomization)
        if (!phaseData.order) {
            const indices = Array.from({ length: phase1Questions.length }, (_, i) => i);
            // Fisher-Yates Shuffle
            for (let i = indices.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [indices[i], indices[j]] = [indices[j], indices[i]];
            }
            
            updatePhaseProgress(1, { 
                order: indices,
                startTime: Date.now() // Start timer for first question
            });
            return;
        }

        // If order exists but startTime is null (edge case fix), set it
        if (!phaseData.startTime) {
            updatePhaseProgress(1, { startTime: Date.now() });
        }
    }, []);

    // 2. Loading State while initializing
    const phaseData = gameState.phaseProgress[1];
    if (!phaseData || !phaseData.order || !phaseData.startTime) {
        return <div className="text-center mt-20 text-primary animate-pulse">INITIALIZING SECURE LINK...</div>;
    }

    // 3. Determine Current Question based on Randomized Order
    const currentStep = phaseData.currentQuestion || 0;
    const actualQuestionIndex = phaseData.order[currentStep];
    const currentQuestion = phase1Questions[actualQuestionIndex];

    // 4. Timer Logic
    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            // Calculate time based on saved start time (Robust against reload)
            const elapsed = Math.floor((now - phaseData.startTime) / 1000);
            const remaining = Math.max(0, HINT_DELAY_SECONDS - elapsed);
            
            setTimeLeft(remaining);
        }, 1000);

        return () => clearInterval(interval);
    }, [phaseData.startTime, currentStep]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    // 5. Submit Handler
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Normalize answer check (trim whitespace)
        if (answer.trim() === currentQuestion.answer) {
            const nextStep = currentStep + 1;
            
            if (nextStep < phase1Questions.length) {
                // Move to next question AND RESET TIMER (update startTime)
                updatePhaseProgress(1, { 
                    currentQuestion: nextStep,
                    startTime: Date.now() 
                });
                setAnswer('');
                setError(false);
                setTimeLeft(HINT_DELAY_SECONDS); // Visual reset
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
        <div className="max-w-6xl mx-auto p-4">
            <header className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-primary/30 pb-4 gap-4">
                <h2 className="text-2xl md:text-3xl font-bold text-primary neon-text text-center md:text-left">
                    PHASE 1: PERIMETER BREACH
                </h2>
                <div className="text-sm font-mono text-gray-400">
                    FRAGMENT {currentStep + 1} / {phase1Questions.length}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: System Log (Question) */}
                <div className="lg:col-span-2 space-y-6">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card p-6 border-l-4 border-l-error relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 bg-error/20 px-3 py-1 text-xs font-bold text-error">
                            PRIORITY: CRITICAL
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 font-mono">
                            {currentQuestion.module}
                        </h3>
                        <p className="font-mono text-sm text-green-400 mb-6 leading-relaxed whitespace-pre-wrap">
                            {currentQuestion.log}
                        </p>
                        <div className="bg-black/40 p-4 rounded border border-white/10">
                            <span className="text-primary font-bold block mb-1">CURRENT DIRECTIVE:</span>
                            <span className="text-white text-lg">{currentQuestion.task}</span>
                        </div>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="relative">
                        <input
                            type="text"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="INPUT FRAGMENT KEY"
                            className={`w-full bg-black/50 border-2 rounded-lg p-5 text-center text-xl font-mono tracking-widest focus:outline-none transition-all ${
                                error 
                                ? 'border-error text-error shadow-[0_0_20px_rgba(255,0,0,0.5)]' 
                                : 'border-primary/50 text-white focus:border-primary focus:shadow-[0_0_20px_rgba(0,243,255,0.3)]'
                            }`}
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="mt-4 bg-white text-black font-black py-3 px-8 rounded w-full hover:bg-primary transition-colors shadow-lg"
                        >
                            AUTHENTICATE
                        </button>
                    </form>
                </div>

                {/* Right Column: Timer & Hint */}
                <div className="space-y-6">
                    {/* Timer Card */}
                    <div className="glass-card p-6 text-center">
                        <div className="flex justify-center items-center gap-2 text-gray-400 mb-2">
                            <Clock size={18} /> TIME UNTIL DECRYPTION
                        </div>
                        <div className={`text-4xl font-mono font-bold ${timeLeft === 0 ? 'text-error animate-pulse' : 'text-white'}`}>
                            {formatTime(timeLeft)}
                        </div>
                    </div>

                    {/* Hint Card */}
                    <div className={`glass-card p-6 border transition-all duration-500 ${timeLeft === 0 ? 'border-secondary/50 bg-secondary/5' : 'border-white/5 grayscale opacity-70'}`}>
                        <div className="flex items-center gap-2 font-bold mb-4">
                            {timeLeft === 0 ? <Unlock className="text-secondary"/> : <Lock size={18}/>}
                            <span className={timeLeft === 0 ? "text-secondary neon-text" : "text-gray-500"}>
                                HINT PROTOCOL
                            </span>
                        </div>
                        
                        {timeLeft === 0 ? (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-lg font-bold text-white text-center"
                            >
                                {currentQuestion.hint}
                            </motion.div>
                        ) : (
                            <div className="text-sm text-gray-500 font-mono text-center">
                                HINT ENCRYPTED.<br/>
                                AWAITING TIMER EXPIRATION...
                            </div>
                        )}
                    </div>

                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded text-xs text-yellow-200 flex gap-2 items-start">
                        <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                        WARNING: Reloading does not reset the encryption timer. The system is persistent.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Phase1;