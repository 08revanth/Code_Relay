import React from 'react';
import { useGame } from '../contexts/GameContext';
import { Terminal } from 'lucide-react';

const Layout = ({ children }) => {
    const { teamId } = useGame();

    return (
        <div className="min-h-screen relative overflow-x-hidden selection:bg-primary selection:text-black">
            {/* Background Grid Effect */}
            <div className="fixed inset-0 cyber-grid pointer-events-none z-0"></div>

            {/* Header */}
            <header className="relative z-50 p-6 flex justify-between items-center border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/20 p-2 rounded-lg border border-primary/50">
                        <Terminal className="text-primary" size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tighter text-white">
                            CSE FEST <span className="text-primary neon-text">2025</span>
                        </h1>
                        <p className="text-[10px] text-gray-400 tracking-widest uppercase">System Override Protocol</p>
                    </div>
                </div>
                
                {teamId && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-secondary/50 bg-secondary/10 shadow-[0_0_15px_rgba(188,19,254,0.3)]">
                        <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                        <span className="text-secondary text-sm font-bold tracking-wider">UNIT {teamId}</span>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="relative z-10 container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
};

export default Layout;