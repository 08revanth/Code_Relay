import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { motion } from 'framer-motion';

const FinalMerge = () => {
    const { gameState } = useGame();
    const [answer, setAnswer] = useState('');
    const [won, setWon] = useState(false);

    const hints = gameState.phaseProgress[5]?.hints || [];
    // Hardcoded for demo if not fully played through
    const displayHints = hints.length > 0 ? hints : ["RISE", "TO", "GLORY"];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (answer.trim().toUpperCase() === "RISE TO GLORY FOREVER") {
            setWon(true);
        } else {
            alert("INCORRECT PHRASE");
        }
    };

    if (won) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
                <motion.h1
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-6xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary mb-8 neon-text"
                >
                    VICTORY
                </motion.h1>
                <p className="text-2xl text-white mb-8">THE SYSTEM HAS BEEN CONQUERED.</p>
                <div className="p-4 bg-white/10 rounded-lg animate-pulse">
                    TEAM WINS
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-12 text-white">FINAL MERGE</h2>

            <div className="grid grid-cols-3 gap-4 mb-12">
                {displayHints.map((hint, idx) => (
                    <div key={idx} className="p-6 glass-card border-primary/50 text-2xl font-bold text-primary neon-text">
                        {hint}
                    </div>
                ))}
                <div className="p-6 glass-card border-secondary/50 text-2xl font-bold text-secondary neon-text animate-pulse">
                    ??? (OUTDOOR)
                </div>
            </div>

            <div className="glass-card p-8">
                <p className="text-gray-400 mb-6">COMBINE THE INDOOR HINTS WITH THE OUTDOOR CLUE.</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="ENTER FINAL PASSPHRASE"
                        className="w-full bg-black/50 border-2 border-white/20 rounded-lg p-6 text-center text-2xl focus:outline-none focus:border-primary transition-colors mb-6"
                    />
                    <button
                        type="submit"
                        className="bg-gradient-to-r from-primary to-secondary text-black font-black text-2xl py-4 px-12 rounded-full hover:scale-105 transition-transform shadow-[0_0_30px_rgba(188,19,254,0.5)]"
                    >
                        UNLOCK VICTORY
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FinalMerge;
