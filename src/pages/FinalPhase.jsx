import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import finalCodingData from '../data/finalCoding.json';
import Editor from '@monaco-editor/react';
import { compareCodeWithSolution } from '../utils/judge0';
import { Play, Loader2, Cpu, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const FinalPhase = () => {
    const { gameState, updatePhaseProgress, teamId } = useGame();
    const navigate = useNavigate();
    
    const taskData = finalCodingData[0];
    const phaseData = gameState.phaseProgress[5]; // Phase 5 data

    const [language, setLanguage] = useState(phaseData?.language || 'c');
    const [code, setCode] = useState(taskData.boilerplateC);
    const [status, setStatus] = useState('IDLE'); 
    const [feedback, setFeedback] = useState('');

    // Load saved code on mount
    useEffect(() => {
        if (phaseData?.draftCode) {
            setCode(phaseData.draftCode);
        } else {
            // If no draft, load boilerplate
            setCode(language === 'c' ? taskData.boilerplateC : taskData.boilerplatePython);
        }
    }, []);

    // Handle Language Switch (Only updates if user manually switches)
    const handleLanguageChange = (e) => {
        const newLang = e.target.value;
        setLanguage(newLang);
        // Reset code to boilerplate of new language OR empty
        const newCode = newLang === 'c' ? taskData.boilerplateC : taskData.boilerplatePython;
        setCode(newCode);
        updatePhaseProgress(5, { language: newLang, draftCode: newCode });
    };

    // Auto-Save Code
    const handleCodeChange = (val) => {
        setCode(val);
        updatePhaseProgress(5, { draftCode: val });
    };

    const handleSubmit = async () => {
        setStatus('CHECKING');
        setFeedback('AI Judge is analyzing your logic...');

        const solutionCode = language === 'c' ? taskData.solutionC : taskData.solutionPython;
        const result = await compareCodeWithSolution(code, solutionCode, language);

        if (result.correct) {
            setStatus('SUCCESS');
            setFeedback('SYSTEM OVERRIDE SUCCESSFUL. KEY: pelmt');
            setTimeout(() => {
                navigate('/final-merge');
            }, 3000);
        } else {
            setStatus('FAIL');
            setFeedback(result.message || "Logic verification failed. Do not hardcode the answer.");
        }
    };

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col p-4 max-w-[1800px] mx-auto">
            <div className="flex justify-between items-center mb-4 border-b border-primary/30 pb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/20 p-2 rounded border border-primary/50">
                        <Cpu className="text-primary animate-pulse" size={24} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-white tracking-tight">
                            PHASE 5: <span className="text-primary neon-text">CORE OVERRIDE</span>
                        </h2>
                        <p className="text-xs text-gray-400 font-mono tracking-widest">FINAL CODING CHALLENGE</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    <select
                        value={language}
                        onChange={handleLanguageChange}
                        className="bg-black/50 border border-white/20 text-white p-2 rounded font-mono text-sm focus:border-primary outline-none"
                    >
                        <option value="c">C Language</option>
                        <option value="python">Python 3</option>
                    </select>

                    <button
                        onClick={handleSubmit}
                        disabled={status === 'CHECKING' || status === 'SUCCESS'}
                        className={`px-8 py-3 rounded font-black tracking-wider transition-all flex items-center gap-2 ${
                            status === 'SUCCESS' ? 'bg-success text-black' :
                            status === 'FAIL' ? 'bg-error text-white' :
                            'bg-primary text-black hover:bg-white hover:scale-105 shadow-[0_0_20px_rgba(0,243,255,0.4)]'
                        }`}
                    >
                        {status === 'CHECKING' ? <Loader2 className="animate-spin" /> : <Play fill="currentColor" />}
                        {status === 'CHECKING' ? 'VERIFYING...' : status === 'SUCCESS' ? 'ACCESS GRANTED' : 'COMPILE & SUBMIT'}
                    </button>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
                <div className="glass-card p-6 overflow-y-auto custom-scrollbar">
                    <h3 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">
                        DIRECTIVES
                    </h3>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                        {taskData.description}
                    </p>

                    <div className="space-y-4 font-mono text-sm">
                        <div className="bg-black/40 p-4 rounded border-l-2 border-primary">
                            <span className="text-gray-500 block text-xs mb-1">INPUT DATA</span>
                            <div className="text-white whitespace-pre-wrap">{taskData.inputDescription}</div>
                        </div>

                        <div className="bg-black/40 p-4 rounded border-l-2 border-secondary">
                            <span className="text-gray-500 block text-xs mb-1">ALGORITHM STEPS</span>
                            <ul className="list-decimal pl-4 space-y-2 text-gray-300">
                                <li><span className="text-secondary font-bold">Filter:</span> Remove IDs that are Prime Numbers.</li>
                                <li><span className="text-secondary font-bold">Sanitize:</span> Remove any symbol that is not a letter or number from strings.</li>
                                <li><span className="text-secondary font-bold">Sort:</span> Order by Length (High to Low), then by ID (Low to High).</li>
                                <li><span className="text-secondary font-bold">Forge:</span> Extract the middle character of each string.</li>
                            </ul>
                        </div>
                    </div>

                    {status === 'FAIL' && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 p-4 bg-error/10 border border-error/50 rounded flex gap-3 items-start"
                        >
                            <AlertTriangle className="text-error shrink-0" />
                            <div>
                                <h4 className="font-bold text-error">EXECUTION FAILED</h4>
                                <p className="text-sm text-error/80">{feedback}</p>
                            </div>
                        </motion.div>
                    )}

                    {status === 'SUCCESS' && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 p-4 bg-success/10 border border-success/50 rounded flex gap-3 items-start"
                        >
                            <CheckCircle className="text-success shrink-0" />
                            <div>
                                <h4 className="font-bold text-success">SYSTEM UNLOCKED</h4>
                                <p className="text-sm text-success/80">{feedback}</p>
                            </div>
                        </motion.div>
                    )}
                </div>

                <div className="lg:col-span-2 glass-card overflow-hidden flex flex-col border-primary/30">
                    <div className="bg-white/5 p-2 px-4 flex justify-between items-center text-xs font-mono text-gray-500 border-b border-white/5">
                        <span>{language === 'c' ? 'main.c' : 'script.py'}</span>
                        <span>AI ASSISTED ENVIRONMENT</span>
                    </div>
                    <Editor
                        height="100%"
                        defaultLanguage={language}
                        language={language}
                        value={code}
                        onChange={handleCodeChange}
                        theme="vs-dark"
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default FinalPhase;