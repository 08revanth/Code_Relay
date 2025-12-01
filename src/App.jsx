import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import PhaseGuard from './components/PhaseGuard';
import HomePage from './pages/HomePage';
import TeamDashboard from './pages/TeamDashboard';
import Phase1 from './pages/Phase1';
import Phase2 from './pages/Phase2';
import Phase3 from './pages/Phase3';
import Phase4 from './pages/Phase4';
import FinalPhase from './pages/FinalPhase';
import FinalMerge from './pages/FinalMerge';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/team/:teamId/dashboard" element={<TeamDashboard />} />

          <Route path="/phase1" element={
            <PhaseGuard requiredPhaseId={1}>
              <Phase1 />
            </PhaseGuard>
          } />

          <Route path="/phase2" element={
            <PhaseGuard requiredPhaseId={2}>
              <Phase2 />
            </PhaseGuard>
          } />

          <Route path="/phase3" element={
            <PhaseGuard requiredPhaseId={3}>
              <Phase3 />
            </PhaseGuard>
          } />

          <Route path="/phase4" element={
            <PhaseGuard requiredPhaseId={4}>
              <Phase4 />
            </PhaseGuard>
          } />

          <Route path="/final-phase" element={
            <PhaseGuard requiredPhaseId={5}>
              <FinalPhase />
            </PhaseGuard>
          } />

          <Route path="/final-merge" element={
            <PhaseGuard requiredPhaseId="FINAL_MERGE">
              <FinalMerge />
            </PhaseGuard>
          } />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
