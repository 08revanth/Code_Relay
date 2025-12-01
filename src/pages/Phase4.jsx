import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import phase4Questions from '../data/phase4DebugQuestions.json';
import Editor from '@monaco-editor/react';
import { runCode } from '../utils/judge0';
import { Play, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';

const Phase4 = () => {
    const { gameState, updatePhaseProgress, completePhase, teamId } = useGame();
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [status, setStatus] = useState('IDLE'); // IDLE, RUNNING, SUCCESS, ERROR
    const navigate = useNavigate();

    const currentQIndex = gameState.phaseProgress[4].currentQuestion || 0;
    const currentQuestion = phase4Questions[currentQIndex];

    // Initialize code only when question changes
    React.useEffect(() => {
        if (currentQuestion) {
            setCode(currentQuestion.buggyCode);
            setOutput('');
            setStatus('IDLE');
        }
    }, [currentQuestion]);

    const handleRun = async () => {
        setStatus('RUNNING');
        setOutput('Compiling & Executing...');

        const result = await runCode(code, currentQuestion.language_id);

        if (result.error) {
            setOutput(`System Error: ${result.error}`);
            setStatus('ERROR');
            return;
        }

        if (result.compile_output) {
            setOutput(`Compile Error:\n${result.compile_output}`);
            setStatus('ERROR');
            return;
        }

        if (result.stderr) {
            setOutput(`Runtime Error:\n${result.stderr}`);
            setStatus('ERROR');
            return;
        }

        const actualOutput = (result.stdout || "").trim();
        setOutput(actualOutput);

        if (actualOutput === currentQuestion.expectedOutput) {
            setStatus('SUCCESS');
            setTimeout(() => {
                const nextIndex = currentQIndex + 1;
                if (nextIndex < phase4Questions.length) {
                    updatePhaseProgress(4, { currentQuestion: nextIndex });
                } else {
                    completePhase(4);
                    navigate(`/team/${teamId}/dashboard`);
                }
            }, 1500);
        } else {
            setStatus('ERROR');
            setOutput((prev) => `${prev}\n\n[INCORRECT OUTPUT] Expected: ${currentQuestion.expectedOutput}`);
        }
    };

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-primary">PHASE 4: DEBUGGING RUSH</h2>
                <div className="text-sm text-gray-400">BUG {currentQIndex + 1} / {phase4Questions.length}</div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
                {/* Editor */}
                <div className="glass-card overflow-hidden flex flex-col">
                    <div className="bg-white/5 p-2 flex justify-between items-center border-b border-white/10">
                        <span className="text-xs font-mono text-gray-400">main.cpp</span>
                        <button
                            onClick={handleRun}
                            disabled={status === 'RUNNING' || status === 'SUCCESS'}
                            className={`flex items-center gap-2 px-4 py-1 rounded text-sm font-bold transition-colors ${status === 'RUNNING' ? 'bg-gray-600 cursor-not-allowed' :
                                    status === 'SUCCESS' ? 'bg-success text-black' :
                                        'bg-primary text-black hover:bg-white'
                                }`}
                        >
                            {status === 'RUNNING' ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                            {status === 'RUNNING' ? 'EXECUTING' : 'RUN CODE'}
                        </button>
                    </div>
                    <Editor
                        height="100%"
                        defaultLanguage="cpp"
                        value={code}
                        onChange={(value) => setCode(value)}
                        theme="vs-dark"
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            scrollBeyondLastLine: false,
                        }}
                    />
                </div>

                {/* Output & Status */}
                <div className="glass-card p-4 flex flex-col">
                    <h3 className="text-sm font-bold text-gray-400 mb-2">CONSOLE OUTPUT</h3>
                    <div className="flex-1 bg-black rounded p-4 font-mono text-sm whitespace-pre-wrap overflow-auto border border-white/10">
                        {output || <span className="text-gray-600">// Output will appear here...</span>}
                    </div>

                    {status === 'SUCCESS' && (
                        <div className="mt-4 p-4 bg-success/20 border border-success rounded flex items-center gap-4 text-success font-bold animate-pulse">
                            <CheckCircle /> BUG FIXED! MOVING TO NEXT...
                        </div>
                    )}

                    {status === 'ERROR' && (
                        <div className="mt-4 p-4 bg-error/20 border border-error rounded flex items-center gap-4 text-error font-bold">
                            <AlertTriangle /> INCORRECT OR ERROR
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Phase4;
