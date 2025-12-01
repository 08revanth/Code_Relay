import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTeamState, saveTeamState, initializeTeam } from '../utils/storage';
import teamPhaseOrder from '../data/teamPhaseOrder.json';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
    const [teamId, setTeamId] = useState(null);
    const [gameState, setGameState] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load state on mount if teamId exists in URL or local storage (optional, but we'll rely on explicit login)

    const login = (id) => {
        let state = getTeamState(id);
        if (!state) {
            state = initializeTeam(id);
        }
        setTeamId(id);
        setGameState(state);
        setLoading(false);
    };

    const updatePhaseProgress = (phaseId, updates) => {
        if (!gameState) return;

        const newPhaseProgress = {
            ...gameState.phaseProgress,
            [phaseId]: {
                ...gameState.phaseProgress[phaseId],
                ...updates
            }
        };

        const newState = {
            ...gameState,
            phaseProgress: newPhaseProgress
        };

        setGameState(newState);
        saveTeamState(teamId, newState);
    };

    const completePhase = (phaseId) => {
        if (!gameState) return;

        // Mark current phase as completed
        const newPhaseProgress = {
            ...gameState.phaseProgress,
            [phaseId]: { ...gameState.phaseProgress[phaseId], completed: true }
        };

        // Move to next phase index
        const newIndex = gameState.currentPhaseIndex + 1;

        const newState = {
            ...gameState,
            currentPhaseIndex: newIndex,
            phaseProgress: newPhaseProgress
        };

        setGameState(newState);
        saveTeamState(teamId, newState);
    };

    const getCurrentPhaseId = () => {
        if (!teamId || !gameState) return null;
        const order = teamPhaseOrder[teamId];
        if (!order || gameState.currentPhaseIndex >= order.length) return 'COMPLETED';
        return order[gameState.currentPhaseIndex];
    };

    return (
        <GameContext.Provider value={{
            teamId,
            gameState,
            login,
            updatePhaseProgress,
            completePhase,
            getCurrentPhaseId,
            teamPhaseOrder
        }}>
            {children}
        </GameContext.Provider>
    );
};
