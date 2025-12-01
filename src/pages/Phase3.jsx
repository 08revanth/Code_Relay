import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { RefreshCw } from 'lucide-react';

const Phase3 = () => {
    const { completePhase, teamId } = useGame();
    const navigate = useNavigate();

    const handleContinue = () => {
        completePhase(3);
        navigate(`/team/${teamId}/dashboard`);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-8 animate-spin-slow">
                <RefreshCw size={48} className="text-primary" />
            </div>

            <h2 className="text-5xl font-bold mb-8 text-white">ROLE SWAP</h2>

            <div className="glass-card p-8 max-w-xl w-full mb-8 space-y-4">
                <div className="p-4 bg-white/5 rounded border border-white/10">
                    <span className="block text-gray-400 text-sm">INDOOR TEAM</span>
                    <span className="text-xl font-bold text-primary">GO OUTDOORS</span>
                </div>
                <div className="p-4 bg-white/5 rounded border border-white/10">
                    <span className="block text-gray-400 text-sm">OUTDOOR TEAM</span>
                    <span className="text-xl font-bold text-secondary">COME INDOORS</span>
                </div>
            </div>

            <p className="text-gray-400 mb-8 max-w-md">
                Physically swap locations. Once the teams have exchanged positions, press continue.
            </p>

            <button
                onClick={handleContinue}
                className="bg-white text-black font-bold text-xl px-12 py-4 rounded-full hover:scale-105 transition-transform"
            >
                CONFIRM SWAP & CONTINUE
            </button>
        </div>
    );
};

export default Phase3;
