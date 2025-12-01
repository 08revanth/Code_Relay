import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';

const PhaseGuard = ({ children, requiredPhaseId }) => {
    const { teamId, getCurrentPhaseId, gameState } = useGame();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!teamId) {
            navigate('/');
            return;
        }

        const currentPhase = getCurrentPhaseId();

        // Special case for Final Merge which is accessible after Final Phase (Phase 5/6 merged)
        if (requiredPhaseId === 'FINAL_MERGE') {
            if (currentPhase !== 'COMPLETED' && currentPhase !== 5) { // Assuming 5 is final
                // Logic for final merge access can be refined. 
                // For now, let's say if they are NOT in the final phase or completed, kick them out.
                // Actually, Final Merge is likely the very end.
            }
            return;
        }

        // Strict Phase Checking
        // If the user tries to access /phase1 but their current phase is 2, redirect to dashboard.
        if (currentPhase !== requiredPhaseId && requiredPhaseId !== 'ANY') {
            // Allow viewing past phases? The prompt implies strict "Next Phase" flow.
            // Let's redirect to dashboard if they are not on the correct phase.
            navigate(`/team/${teamId}/dashboard`);
        }

    }, [teamId, navigate, requiredPhaseId, getCurrentPhaseId]);

    if (!teamId) return null;

    return <>{children}</>;
};

export default PhaseGuard;
