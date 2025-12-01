import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import finalCoding from '../data/finalCoding.json';
import Editor from '@monaco-editor/react';
import { runCode } from '../utils/judge0';
import { Play, Loader2, Lock, Unlock } from 'lucide-react';

const FinalPhase = () => {
    const { gameState, updatePhaseProgress, completePhase, teamId } = useGame();
    const [activeTask, setActiveTask] = useState(0);
    const [code, setCode] = useState('// Write your solution here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    // Read input from stdin\n    // Print output to stdout\n    return 0;\n}');
    const [output, setOutput] = useState('');
    const [status, setStatus] = useState('IDLE');
    const navigate = useNavigate();

    const solvedParts = gameState.phaseProgress[5]?.solvedParts || [false, false, false];
    const hints = gameState.phaseProgress[5]?.hints || [];

    const handleRun = async () => {
        setStatus('RUNNING');
        setOutput('Testing against hidden cases...');

        const task = finalCoding[activeTask];
        const result = await runCode(code, 54, task.testInput); // 54 = C++

        if (result.error || result.compile_output || result.stderr) {
            setOutput(result.error || result.compile_output || result.stderr);
            setStatus('ERROR');
            return;
        }

        const actualOutput = (result.stdout || "").trim();
        if (actualOutput === task.expectedOutput) {
            setStatus('SUCCESS');
            setOutput(`Test Passed!\nOutput: ${actualOutput}\n\nHINT UNLOCKED: ${task.hint}`);

            // Update state
            const newSolved = [...solvedParts];
            newSolved[activeTask] = true;

            const newHints = [...hints];
            if (!newHints.includes(task.hint)) {
                newHints.push(task.hint);
            }

            updatePhaseProgress(5, { solvedParts: newSolved, hints: newHints });

            // Check if all solved
            if (newSolved.every(s => s)) {
                setTimeout(() => {
                    completePhase(5);
                    navigate('/final-merge');
                }, 2000);
            }
        } else {
            setStatus('ERROR');
            setOutput(`Wrong Answer.\nExpected: ${task.expectedOutput}\nGot: ${actualOutput}`);
        }
    };

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-primary">FINAL PHASE: CODING TRIALS</h2>
                <div className="flex gap-2">
                    {finalCoding.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveTask(idx)}
                            className={`px-4 py-2 rounded font-bold transition-all ${activeTask === idx ? 'bg-primary text-black' :
                                    solvedParts[idx] ? 'bg-success/20 text-success border border-success' :
                                        'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            TASK {idx + 1} {solvedParts[idx] && '✓'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
                {/* Task Description */}
                <div className="glass-card p-6 overflow-auto">
                    <h3 className="text-xl font-bold mb-4 text-white">TASK {activeTask + 1}</h3>
                    <p className="text-gray-300 mb-6">{finalCoding[activeTask].description}</p>

                    <div className="bg-black/50 p-4 rounded mb-4">
                        <div className="text-xs text-gray-500 mb-1">SAMPLE INPUT</div>
                        <div className="font-mono">{finalCoding[activeTask].testInput}</div>
                    </div>

                    <div className="mt-8">
                        <h4 className="font-bold text-secondary mb-2 flex items-center gap-2">
                            {solvedParts[activeTask] ? <Unlock size={18} /> : <Lock size={18} />}
                            REWARD HINT
                        </h4>
                        <div className={`p-4 rounded text-center font-bold text-xl ${solvedParts[activeTask] ? 'bg-secondary/20 text-secondary border border-secondary' : 'bg-gray-800 text-gray-600'
                            }`}>
                            {solvedParts[activeTask] ? finalCoding[activeTask].hint : '???'}
                        </div>
                    </div>
                </div>

                {/* Editor & Output (Spans 2 cols) */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                    <div className="glass-card flex-1 overflow-hidden flex flex-col">
                        <div className="bg-white/5 p-2 flex justify-between items-center border-b border-white/10">
                            <span className="text-xs font-mono text-gray-400">solution.cpp</span>
                            <button
                                onClick={handleRun}
                                disabled={status === 'RUNNING' || solvedParts[activeTask]}
                                className={`flex items-center gap-2 px-4 py-1 rounded text-sm font-bold transition-colors ${solvedParts[activeTask] ? 'bg-success text-black cursor-default' :
                                        status === 'RUNNING' ? 'bg-gray-600 cursor-not-allowed' :
                                            'bg-primary text-black hover:bg-white'
                                    }`}
                            >
                                {status === 'RUNNING' ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                                {solvedParts[activeTask] ? 'SOLVED' : status === 'RUNNING' ? 'TESTING' : 'SUBMIT'}
                            </button>
                        </div>
                        <Editor
                            height="100%"
                            defaultLanguage="cpp"
                            value={code}
                            onChange={(value) => setCode(value)}
                            theme="vs-dark"
                            options={{ minimap: { enabled: false }, fontSize: 14 }}
                        />
                    </div>

                    <div className="glass-card h-32 p-4 font-mono text-sm overflow-auto bg-black border border-white/10">
                        {output || <span className="text-gray-600">// Execution results...</span>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinalPhase;
