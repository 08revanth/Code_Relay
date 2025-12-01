import React from 'react';
import { useGame } from '../contexts/GameContext';

const Layout = ({ children }) => {
    const { teamId } = useGame();

    return (
        <div className="min-h-screen bg-background text-white font-mono relative overflow-hidden selection:bg-primary selection:text-black">
            {/* Background Grid Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            {/* Header */}
            <header className="relative z-10 p-6 flex justify-between items-center border-b border-white/10 bg-black/50 backdrop-blur-md">
                <h1 className="text-2xl font-bold tracking-tighter text-primary neon-text">
                    CSE FEST <span className="text-white">2025</span>
                </h1>
                {teamId && (
                    <div className="px-4 py-1 rounded-full border border-secondary/50 bg-secondary/10 text-secondary text-sm font-bold">
                        TEAM {teamId}
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
