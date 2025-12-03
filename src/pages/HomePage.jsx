import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { motion } from 'framer-motion';
import { ShieldAlert, Key, Cpu, Users, ArrowRight } from 'lucide-react';

const HomePage = () => {
    const { login } = useGame();
    const navigate = useNavigate();
    const teams = Array.from({ length: 10 }, (_, i) => i + 1);

    const handleTeamSelect = (id) => {
        login(id);
        navigate(`/team/${id}/dashboard`);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16 pt-10">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-block px-4 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold tracking-[0.2em] mb-4"
                >
                    INITIALIZING SYSTEM...
                </motion.div>
                <motion.h1 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl md:text-7xl font-black text-white mb-6"
                >
                    INITIATE <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary neon-text">PROTOCOL</span>
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed"
                >
                    The system core has been fragmented. Your unit must traverse physical and digital realms to retrieve the override keys.
                </motion.p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left: Mission Briefing */}
                <motion.div 
                    className="lg:col-span-7 space-y-6"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    <motion.div variants={itemVariants} className="glass-card p-8 border-l-4 border-l-primary">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <Cpu className="text-primary" /> MISSION BRIEFING
                        </h2>
                        
                        <div className="space-y-6 relative">
                            {/* Line connecting items */}
                            <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-white/10"></div>

                            <div className="flex gap-4 relative z-10">
                                <div className="w-10 h-10 rounded-full bg-black border border-white/20 flex items-center justify-center shrink-0 font-bold text-gray-500">1</div>
                                <div>
                                    <h3 className="font-bold text-white">Hunt & Solve</h3>
                                    <p className="text-sm text-gray-400">Navigate the campus to find physical QR codes and solve logic puzzles on the terminal.</p>
                                </div>
                            </div>

                            <div className="flex gap-4 relative z-10">
                                <div className="w-10 h-10 rounded-full bg-black border border-white/20 flex items-center justify-center shrink-0 font-bold text-gray-500">2</div>
                                <div>
                                    <h3 className="font-bold text-white">Debug The System</h3>
                                    <p className="text-sm text-gray-400">Fix corrupted code blocks to reveal hidden locations.</p>
                                </div>
                            </div>

                            <div className="flex gap-4 relative z-10">
                                <div className="w-10 h-10 rounded-full bg-black border border-secondary flex items-center justify-center shrink-0 text-secondary font-bold shadow-[0_0_10px_rgba(188,19,254,0.5)]">3</div>
                                <div>
                                    <h3 className="font-bold text-white flex items-center gap-2">
                                        Collect The Secrets <Key size={14} className="text-secondary"/>
                                    </h3>
                                    <p className="text-sm text-gray-300">
                                        <span className="text-secondary font-bold">CRITICAL:</span> After every phase, you will receive a secret string and a message. 
                                        Write these down! You will need to use them in your code during the Final Phase.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="p-6 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex gap-4 items-start">
                        <ShieldAlert className="text-yellow-500 shrink-0 mt-1" />
                        <div>
                            <h4 className="font-bold text-yellow-500 mb-1">WARNING: FINAL PHASE DEPENDENCY</h4>
                            <p className="text-xs text-yellow-200/80 leading-relaxed">
                                The Final Phase (Core Override) requires the specific strings collected from previous phases. 
                                Without them, you cannot compile the final victory code. Do not lose your data.
                            </p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Right: Team Selection */}
                <motion.div 
                    className="lg:col-span-5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <div className="glass-card p-8 h-full">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Users /> SELECT UNIT ID
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            {teams.map((id) => (
                                <button
                                    key={id}
                                    onClick={() => handleTeamSelect(id)}
                                    className="group relative p-4 bg-black/40 border border-white/10 rounded-lg hover:bg-primary/20 hover:border-primary transition-all duration-300 text-left overflow-hidden"
                                >
                                    <span className="text-xs text-gray-500 group-hover:text-primary transition-colors">UNIT</span>
                                    <div className="text-2xl font-black text-white">{id.toString().padStart(2, '0')}</div>
                                    <ArrowRight className="absolute right-4 bottom-4 text-white/10 group-hover:text-primary group-hover:translate-x-1 transition-all" size={20} />
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default HomePage;