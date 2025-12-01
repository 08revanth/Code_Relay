import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { motion } from 'framer-motion';

const HomePage = () => {
    const { login } = useGame();
    const navigate = useNavigate();
    const teams = Array.from({ length: 10 }, (_, i) => i + 1);

    const handleTeamSelect = (id) => {
        login(id);
        navigate(`/team/${id}/dashboard`);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold mb-12 text-center"
            >
                SELECT YOUR <span className="text-secondary">ALLIANCE</span>
            </motion.h2>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full max-w-4xl">
                {teams.map((id) => (
                    <motion.button
                        key={id}
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(0, 243, 255, 0.1)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleTeamSelect(id)}
                        className="p-6 glass-card border-primary/30 hover:border-primary text-xl font-bold transition-all duration-300 group"
                    >
                        <span className="text-gray-400 group-hover:text-primary transition-colors">TEAM</span>
                        <div className="text-3xl text-white mt-2">{id}</div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
