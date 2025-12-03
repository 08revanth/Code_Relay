import React, { useState, useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Unlock, Users, Key } from 'lucide-react';
import Confetti from 'react-confetti';

const FinalMerge = () => {
    const { gameState, updatePhaseProgress } = useGame();
    const [answer, setAnswer] = useState('');
    const [error, setError] = useState(false);
    const [won, setWon] = useState(false);
    
    // Check for previous win state on mount
    useEffect(() => {
        if (gameState?.phaseProgress?.finalMerge?.won) {
            setWon(true);
        }
    }, [gameState]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (answer.trim().toLowerCase() === "pelmt") {
            setWon(true);
            updatePhaseProgress('finalMerge', { won: true });
        } else {
            setError(true);
            setTimeout(() => setError(false), 1000);
        }
    };

    if (won) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] text-center relative overflow-hidden">
                <Confetti numberOfPieces={200} recycle={false} />
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="p-10 border-4 border-success bg-black/80 rounded-3xl shadow-[0_0_100px_rgba(10,255,10,0.5)] z-10"
                >
                    <ShieldCheck size={80} className="text-success mx-auto mb-6" />
                    <h1 className="text-6xl md:text-8xl font-black text-white mb-4 tracking-tighter">
                        VICTORY
                    </h1>
                    <p className="text-2xl text-gray-300 font-mono mb-8">
                        MASTER KEY ACCEPTED.<br/>SYSTEM RESTORED.
                    </p>
                    <div className="inline-block px-8 py-3 bg-success text-black font-bold rounded-full animate-pulse">
                        PROTOCOL COMPLETE
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto text-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
                    PROTOCOL: <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary neon-text">UNITY</span>
                </h1>
                
                <div className="glass-card p-8 border-l-4 border-l-primary text-left max-w-3xl mx-auto relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-primary/20 px-3 py-1 text-xs font-bold text-primary">
                        BROADCAST MESSAGE
                    </div>
                    <p className="text-gray-300 whitespace-pre-wrap leading-relaxed font-mono">
                        "Attention Tech Rangers! This is AetherOS Core.
                        
                        We are initiating Protocol: UNITY. 
                        
                        All Field Agents: Abandon your sectors. 
                        All Command Units: Lock your terminals. 
                        
                        <span className="text-white font-bold">CONVERGE AT THE AUDITORIUM IMMEDIATELY.</span>
                        
                        You have 9 Fragments of a broken instruction and 9 Slices of corrupted data. Only together can you forge the Master Key."
                    </p>
                </div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="glass-card p-10 max-w-xl mx-auto border-secondary/30"
            >
                <div className="flex items-center justify-center gap-3 text-secondary font-bold mb-8">
                    <Key className="animate-pulse" /> FINAL AUTHENTICATION
                </div>

                <form onSubmit={handleSubmit} className="relative">
                    <input
                        type="text"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="ENTER MASTER KEY"
                        className={`w-full bg-black/60 border-2 rounded-xl p-6 text-center text-3xl font-black tracking-widest focus:outline-none transition-all ${
                            error 
                            ? 'border-error text-error shadow-[0_0_30px_rgba(255,0,0,0.4)]' 
                            : 'border-white/20 text-white focus:border-secondary focus:shadow-[0_0_30px_rgba(188,19,254,0.3)]'
                        }`}
                        autoFocus
                    />
                    
                    <button
                        type="submit"
                        className="mt-8 bg-gradient-to-r from-secondary to-purple-600 text-white font-bold text-xl py-4 px-12 rounded-full hover:scale-105 transition-transform shadow-lg w-full flex items-center justify-center gap-3"
                    >
                        {error ? <Lock size={20} /> : <Unlock size={20} />}
                        UNLOCK CORE
                    </button>
                </form>
            </motion.div>

            <div className="mt-8 flex justify-center gap-4 text-xs text-gray-500 font-mono uppercase tracking-widest">
                <span className="flex items-center gap-1"><Users size={12}/> AWAITING ALL UNITS</span>
                <span className="flex items-center gap-1"><Lock size={12}/> SECURITY ACTIVE</span>
            </div>
        </div>
    );
};

export default FinalMerge;