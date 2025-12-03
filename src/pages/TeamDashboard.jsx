import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { motion } from 'framer-motion';
import { 
    Lock, CheckCircle, Play, MapPin, 
    Terminal, RefreshCw, Bug, Cpu, Shield 
} from 'lucide-react';

const PHASE_CONFIG = {
    1: { name: "PERIMETER BREACH", icon: MapPin, desc: "Physical QR Hunt" },
    2: { name: "LOGIC GATE", icon: Terminal, desc: "Output Prediction" },
    3: { name: "PROTOCOL SWAP", icon: RefreshCw, desc: "Role Reversal" },
    4: { name: "SYSTEM PATCH", icon: Bug, desc: "Code Debugging" },
    5: { name: "CORE OVERRIDE", icon: Cpu, desc: "Final Coding Challenge" }
};

const TeamDashboard = () => {
    const { teamId, getCurrentPhaseId, gameState, teamPhaseOrder } = useGame();
    const navigate = useNavigate();

    if (!gameState) return <div className="text-center mt-20 text-primary">SYNCING...</div>;

    const currentPhaseId = getCurrentPhaseId();
    const phaseOrder = teamPhaseOrder[teamId];

    const handleStartPhase = () => {
        if (currentPhaseId === 'COMPLETED') {
            navigate('/final-merge');
            return;
        }

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
        <div className="max-w-5xl mx-auto pb-10">
            {/* Status Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8 mb-8 text-center relative overflow-hidden group"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <h2 className="text-xl font-bold mb-2 text-gray-400 tracking-widest">CURRENT OBJECTIVE</h2>
                
                <div className="my-6">
                    {currentPhaseId === 'COMPLETED' ? (
                        <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-success to-primary neon-text">
                            ALL SYSTEMS GO
                        </h1>
                    ) : (
                        <div className="flex flex-col items-center">
                            <span className="text-6xl md:text-7xl font-black text-white neon-text mb-2">
                                PHASE {currentPhaseId}
                            </span>
                            <span className="text-xl text-primary font-bold tracking-widest uppercase">
                                {PHASE_CONFIG[currentPhaseId]?.name}
                            </span>
                        </div>
                    )}
                </div>

                <button
                    onClick={handleStartPhase}
                    className="relative z-10 bg-white text-black font-black text-lg px-10 py-4 rounded-full hover:bg-primary hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-3 mx-auto"
                >
                    {currentPhaseId === 'COMPLETED' ? 'ENTER FINAL CHAMBER' : 'ENGAGE MISSION'} 
                    <Play size={20} fill="black" />
                </button>
            </motion.div>

            {/* Timeline / Grid */}
            <div className="grid gap-4">
                <h3 className="text-gray-500 font-bold mb-2 pl-2">MISSION TRAJECTORY</h3>
                
                {phaseOrder.map((pId, index) => {
                    const isCompleted = index < gameState.currentPhaseIndex;
                    const isCurrent = index === gameState.currentPhaseIndex;
                    const isLocked = index > gameState.currentPhaseIndex;
                    const PhaseIcon = PHASE_CONFIG[pId].icon;

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-6 rounded-xl border flex items-center justify-between transition-all duration-300 ${
                                isCurrent 
                                ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(0,243,255,0.1)] scale-[1.02]' 
                                : isCompleted 
                                    ? 'bg-success/5 border-success/30 opacity-70' 
                                    : 'bg-black/40 border-white/5 opacity-50 grayscale'
                            }`}
                        >
                            <div className="flex items-center gap-6">
                                {/* Number/Status Icon */}
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border ${
                                    isCurrent ? 'bg-primary text-black border-primary' :
                                    isCompleted ? 'bg-success text-black border-success' :
                                    'bg-transparent text-gray-500 border-gray-700'
                                }`}>
                                    {isCompleted ? <CheckCircle size={24} /> : index + 1}
                                </div>

                                {/* Text Info */}
                                <div>
                                    <h4 className={`text-xl font-black tracking-wide ${isCurrent ? 'text-white' : 'text-gray-400'}`}>
                                        {PHASE_CONFIG[pId].name}
                                    </h4>
                                    <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                        <PhaseIcon size={14} /> {PHASE_CONFIG[pId].desc}
                                    </p>
                                </div>
                            </div>

                            {/* Right Side Status */}
                            <div>
                                {isCurrent && (
                                    <span className="px-3 py-1 rounded bg-primary/20 text-primary text-xs font-bold border border-primary/50 animate-pulse">
                                        IN PROGRESS
                                    </span>
                                )}
                                {isLocked && <Lock className="text-gray-600" />}
                                {isCompleted && <span className="text-success font-bold text-xs">COMPLETE</span>}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default TeamDashboard;