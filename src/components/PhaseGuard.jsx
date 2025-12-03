import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';

const PhaseGuard = ({ children, requiredPhaseId }) => {
    const { teamId, getCurrentPhaseId, loading } = useGame();
    const navigate = useNavigate();
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        // 1. Wait for loading to finish (Data restoration)
        if (loading) return;

        // 2. If no team ID found after loading, redirect to home
        if (!teamId) {
            navigate('/');
            return;
        }

        const currentPhase = getCurrentPhaseId();

        // 3. Logic for Final Merge
        if (requiredPhaseId === 'FINAL_MERGE') {
            if (currentPhase !== 'COMPLETED' && currentPhase !== 5) {
               // Optional: Redirect if they aren't ready, but for now we allow access if logged in
            }
        } 
        // 4. Strict Phase Checking
        else if (currentPhase !== requiredPhaseId && requiredPhaseId !== 'ANY') {
            navigate(`/team/${teamId}/dashboard`);
        }

        setIsChecked(true);

    }, [teamId, navigate, requiredPhaseId, getCurrentPhaseId, loading]);

    // Show nothing (or a loader) while checking state
    if (loading || !isChecked) {
        return (
            <div className="flex h-[50vh] items-center justify-center text-primary font-mono animate-pulse">
                INITIALIZING SECURITY PROTOCOLS...
            </div>
        );
    }

    if (!teamId) return null;

    return <>{children}</>;
};

export default PhaseGuard;