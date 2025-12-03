import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import phase4Questions from '../data/phase4DebugQuestions.json';
import Editor from '@monaco-editor/react';
import { validateDebugCode } from '../utils/judge0';
import { Play, Loader2, Bug, CheckCircle, Lock, Unlock, ArrowRight, FileCode, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Phase4 = () => {
    const { gameState, updatePhaseProgress, completePhase, teamId } = useGame();
    const navigate = useNavigate();

    const phaseData = gameState.phaseProgress[4];
    const currentQIndex = phaseData?.currentQuestion || 0;
    const currentQuestion = phase4Questions[currentQIndex];

    const [userCode, setUserCode] = useState('');
    const [status, setStatus] = useState('IDLE');
    const [finalString, setFinalString] = useState('');
    const [stringError, setStringError] = useState(false);
    const [codeFixed, setCodeFixed] = useState(false);

    // Initialize from Storage or Default
    useEffect(() => {
        if (currentQuestion) {
            // Restore Code
            if (phaseData.draftCode) {
                setUserCode(phaseData.draftCode);
            } else {
                setUserCode(currentQuestion.buggyCode);
            }
            
            // Restore Status
            if (phaseData.codeFixed) {
                setCodeFixed(true);
                setStatus('SUCCESS');
            } else {
                setCodeFixed(false);
                setStatus('IDLE');
            }

            // Restore String Input
            if (phaseData.draftString) {
                setFinalString(phaseData.draftString);
            }
        }
    }, [currentQIndex]);

    // Handle Code Change with Auto-Save
    const handleCodeChange = (val) => {
        setUserCode(val);
        // We use a small timeout or direct update. Since it's local, direct is fine.
        updatePhaseProgress(4, { draftCode: val });
    };

    const handleVerifyCode = async () => {
        setStatus('RUNNING');
        const result = await validateDebugCode(userCode, currentQuestion.language);

        if (result.correct) {
            setStatus('SUCCESS');
            setCodeFixed(true);
            updatePhaseProgress(4, { codeFixed: true });
        } else {
            setStatus('ERROR');
        }
    };

    const handleStringChange = (e) => {
        const val = e.target.value;
        setFinalString(val);
        updatePhaseProgress(4, { draftString: val });
    };

    const handleStringSubmit = (e) => {
        e.preventDefault();
        if (finalString.trim() === currentQuestion.finalString) {
            const nextIndex = currentQIndex + 1;
            if (nextIndex < phase4Questions.length) {
                // Reset for next question
                updatePhaseProgress(4, { 
                    currentQuestion: nextIndex,
                    draftCode: '',
                    draftString: '',
                    codeFixed: false 
                });
            } else {
                completePhase(4);
                navigate(`/team/${teamId}/dashboard`);
            }
        } else {
            setStringError(true);
            setTimeout(() => setStringError(false), 1000);
        }
    };

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col p-4 max-w-[1600px] mx-auto">
            <div className="flex justify-between items-center mb-4 border-b border-primary/30 pb-2">
                <h2 className="text-2xl font-bold text-primary neon-text flex items-center gap-2">
                    <Bug /> PHASE 4: DEBUGGING PROTOCOL
                </h2>
                <div className="text-sm text-gray-400 font-mono">
                    LOG {currentQIndex + 1} / {phase4Questions.length}
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
                
                {/* COLUMN 1: Task Info */}
                <div className="lg:col-span-3 flex flex-col gap-4 overflow-y-auto">
                    <div className="glass-card p-5 border-l-4 border-l-yellow-500 relative">
                        <div className="absolute top-0 right-0 bg-yellow-500/20 px-2 py-0.5 text-[10px] font-bold text-yellow-500">
                            SYSTEM ERROR
                        </div>
                        <h3 className="text-md font-bold text-white mb-2">{currentQuestion.module}</h3>
                        <p className="text-xs text-gray-300 font-mono leading-relaxed">
                            {currentQuestion.log}
                        </p>
                    </div>

                    <AnimatePresence>
                        {codeFixed && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="glass-card p-5 border-success shadow-[0_0_20px_rgba(10,255,10,0.2)]"
                            >
                                <div className="flex items-center gap-2 text-success font-bold mb-2 text-sm">
                                    <Unlock size={16} /> SYSTEM RESTORED
                                </div>
                                <div className="text-center">
                                    <p className="text-gray-400 text-[10px] uppercase mb-1">LOCATION HINT</p>
                                    <p className="text-lg text-white font-bold neon-text">
                                        "{currentQuestion.hint}"
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className={`glass-card p-5 transition-all duration-500 ${!codeFixed ? 'opacity-50 grayscale' : ''}`}>
                        <form onSubmit={handleStringSubmit}>
                            <label className="block text-[10px] font-bold text-gray-500 mb-2">
                                {codeFixed ? "ENTER RETRIEVED STRING" : "FIX CODE TO UNLOCK"}
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={finalString}
                                    onChange={handleStringChange}
                                    disabled={!codeFixed}
                                    placeholder={codeFixed ? "Secret String..." : "LOCKED"}
                                    className={`w-full bg-black/50 border-2 rounded-lg p-3 pl-9 text-md font-mono focus:outline-none transition-all ${
                                        stringError 
                                        ? 'border-error text-error' 
                                        : 'border-white/20 text-white focus:border-primary'
                                    }`}
                                />
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                    {codeFixed ? <ArrowRight size={16} /> : <Lock size={16} />}
                                </div>
                            </div>
                            {codeFixed && (
                                <button type="submit" className="w-full mt-3 bg-white text-black font-bold py-2 rounded text-xs hover:bg-primary transition-colors">
                                    VERIFY
                                </button>
                            )}
                        </form>
                    </div>
                </div>

                {/* COLUMN 2: Read-Only Code */}
                <div className="lg:col-span-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-error font-bold text-xs uppercase tracking-wider pl-1">
                        <FileCode size={14} /> Corrupted Source (Read Only)
                    </div>
                    <div className="flex-1 glass-card overflow-hidden border border-error/30 relative">
                        <div className="absolute inset-0 z-10 bg-error/5 pointer-events-none"></div>
                        <Editor
                            height="100%"
                            defaultLanguage={currentQuestion.language}
                            value={currentQuestion.buggyCode}
                            theme="vs-dark"
                            options={{ readOnly: true, minimap: { enabled: false }, fontSize: 12, lineNumbers: 'on' }}
                        />
                    </div>
                </div>

                {/* COLUMN 3: Editable Workspace */}
                <div className="lg:col-span-5 flex flex-col gap-2">
                     <div className="flex justify-between items-end pl-1">
                        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                            <Edit3 size={14} /> Patch Workspace
                        </div>
                        <button
                            onClick={handleVerifyCode}
                            disabled={status === 'RUNNING' || codeFixed}
                            className={`flex items-center gap-2 px-4 py-1 rounded text-xs font-bold transition-all ${
                                codeFixed 
                                ? 'bg-success text-black cursor-default'
                                : status === 'RUNNING' 
                                    ? 'bg-gray-700 cursor-wait'
                                    : 'bg-primary text-black hover:bg-white'
                            }`}
                        >
                            {status === 'RUNNING' ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
                            {status === 'RUNNING' ? 'VALIDATING...' : codeFixed ? 'FIX VERIFIED' : 'RUN PATCH'}
                        </button>
                    </div>

                    <div className={`flex-1 glass-card overflow-hidden border transition-all duration-300 ${status === 'ERROR' ? 'border-error' : status === 'SUCCESS' ? 'border-success' : 'border-primary/50'}`}>
                        <Editor
                            height="100%"
                            defaultLanguage={currentQuestion.language}
                            value={userCode}
                            onChange={handleCodeChange}
                            theme="vs-dark"
                            options={{ minimap: { enabled: false }, fontSize: 13, automaticLayout: true }}
                        />
                    </div>
                    
                    <div className="h-8 flex items-center justify-end px-2">
                        {status === 'ERROR' && <span className="text-error text-xs font-mono animate-pulse">[ERROR] SYNTAX INVALID. REVIEW CODE.</span>}
                        {status === 'SUCCESS' && <span className="text-success text-xs font-mono">[SUCCESS] COMPILED SUCCESSFULLY.</span>}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Phase4;