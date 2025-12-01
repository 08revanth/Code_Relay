const STORAGE_PREFIX = 'csefest_';

export const getTeamState = (teamId) => {
  const data = localStorage.getItem(`${STORAGE_PREFIX}team_${teamId}`);
  return data ? JSON.parse(data) : null;
};

export const saveTeamState = (teamId, state) => {
  localStorage.setItem(`${STORAGE_PREFIX}team_${teamId}`, JSON.stringify(state));
};

export const initializeTeam = (teamId) => {
  const initialState = {
    currentPhaseIndex: 0,
    phaseProgress: {
      1: { completed: false, currentQuestion: 0 },
      2: { completed: false, currentQuestion: 0 },
      3: { completed: false },
      4: { completed: false, currentQuestion: 0 },
      5: { completed: false, solvedParts: [false, false, false], hints: [] }
    }
  };
  saveTeamState(teamId, initialState);
  return initialState;
};

export const getGlobalState = (key) => {
  const data = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
  return data ? JSON.parse(data) : null;
};

export const saveGlobalState = (key, value) => {
  localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
};
