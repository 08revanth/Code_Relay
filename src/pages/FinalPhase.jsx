import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import finalCodingData from '../data/finalCoding.json';
import Editor from '@monaco-editor/react';
import { compareCodeWithSolution } from '../utils/judge0';
import { Play, Loader2, Cpu, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const FinalPhase = () => {
    const { teamId, completePhase } = useGame();
    const navigate = useNavigate();
    
    const taskData = finalCodingData[0];
    const [language, setLanguage] = useState('c');
    const [code, setCode] = useState(taskData.boilerplateC);
    const [status, setStatus] = useState('IDLE'); // IDLE, CHECKING, SUCCESS, FAIL
    const [feedback, setFeedback] = useState('');

    // Switch Boilerplate when language changes
    useEffect(() => {
        if (language === 'c') setCode(taskData.boilerplateC);
        if (language === 'python') setCode(taskData.boilerplatePython);
    }, [language]);

    const handleSubmit = async () => {
        setStatus('CHECKING');
        setFeedback('AI Judge is analyzing your logic...');

        // Select correct solution to compare against
        const solutionCode = language === 'c' ? taskData.solutionC : taskData.solutionPython;

        const result = await compareCodeWithSolution(code, solutionCode, language);

        if (result.correct) {
            setStatus('SUCCESS');
            setFeedback('SYSTEM OVERRIDE SUCCESSFUL. KEY GENERATED.');
            setTimeout(() => {
                navigate('/final-merge');
            }, 3000);
        } else {
            setStatus('FAIL');
            setFeedback(result.message || "Logic verification failed. Check your algorithms.");
        }
    };

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col p-4 max-w-[1800px] mx-auto">
            {/* Header */}
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
                        onChange={(e) => setLanguage(e.target.value)}
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
                {/* Left: Instructions */}
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
                                <li><span className="text-secondary font-bold">Sort:</span> Order by String Length (Descending). If equal, order by ID (Ascending).</li>
                                <li><span className="text-secondary font-bold">Forge:</span> Extract the middle character of each string.</li>
                                <li><span className="text-secondary font-bold">Encrypt:</span> Shift each extracted character by +1 (a→b, z→a).</li>
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

                {/* Right: Editor */}
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
                        onChange={(val) => setCode(val)}
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