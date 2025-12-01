import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { motion } from 'framer-motion';
import { Lock, CheckCircle, Play } from 'lucide-react';

const TeamDashboard = () => {
    const { teamId, getCurrentPhaseId, gameState, teamPhaseOrder } = useGame();
    const navigate = useNavigate();

    if (!gameState) return <div>Loading...</div>;

    const currentPhaseId = getCurrentPhaseId();
    const phaseOrder = teamPhaseOrder[teamId];

    const handleStartPhase = () => {
        if (currentPhaseId === 'COMPLETED') {
            navigate('/final-merge');
            return;
        }

        // Map phase ID to route
        const routes = {
            1: '/phase1',
            2: '/phase2',
            3: '/phase3',
            4: '/phase4',
            5: '/final-phase'
        };

        navigate(routes[currentPhaseId]);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-8 mb-8 text-center relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>

                <h2 className="text-3xl font-bold mb-2">MISSION CONTROL</h2>
                <p className="text-gray-400 mb-8">STATUS: <span className="text-primary">ACTIVE</span></p>

                <div className="flex justify-center items-center mb-8">
                    <div className="text-6xl font-bold text-white neon-text">
                        {currentPhaseId === 'COMPLETED' ? 'ALL DONE' : `PHASE ${currentPhaseId}`}
                    </div>
                </div>

                <button
                    onClick={handleStartPhase}
                    className="bg-primary text-black font-bold text-xl px-12 py-4 rounded-full hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(0,243,255,0.5)] flex items-center gap-2 mx-auto"
                >
                    {currentPhaseId === 'COMPLETED' ? 'ENTER FINAL CHAMBER' : 'INITIATE PROTOCOL'} <Play size={24} fill="black" />
                </button>
            </motion.div>

            <div className="grid gap-4">
                {phaseOrder.map((pId, index) => {
                    const isCompleted = index < gameState.currentPhaseIndex;
                    const isCurrent = index === gameState.currentPhaseIndex;
                    const isLocked = index > gameState.currentPhaseIndex;

                    return (
                        <div
                            key={index}
                            className={`p-4 rounded-lg border flex items-center justify-between ${isCurrent ? 'bg-primary/10 border-primary' :
                                    isCompleted ? 'bg-success/10 border-success' :
                                        'bg-white/5 border-white/10 opacity-50'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${isCurrent ? 'bg-primary text-black' :
                                        isCompleted ? 'bg-success text-black' :
                                            'bg-gray-700 text-gray-400'
                                    }`}>
                                    {index + 1}
                                </div>
                                <span className="text-lg font-bold">
                                    {pId === 3 ? 'ROLE SWAP' : `PHASE ${pId}`}
                                </span>
                            </div>

                            <div>
                                {isCompleted && <CheckCircle className="text-success" />}
                                {isLocked && <Lock className="text-gray-500" />}
                                {isCurrent && <span className="text-primary animate-pulse">IN PROGRESS</span>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TeamDashboard;
