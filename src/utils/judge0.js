import axios from 'axios';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// Using the stable 2.5 Flash model
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// --- GENERIC: EXECUTE CODE (Returns Output) ---
// Used if we just want to run code and see stdout
export const runCode = async (source_code, language_id, stdin = "") => {
  console.log("🤖 Asking Gemini to judge...");

  let langName = "C";
  if (language_id === 71) langName = "Python";
  if (language_id === 54) langName = "C++";
  if (language_id === 50) langName = "C";

  const prompt = `
You are a strict code execution engine. 
Your task is to simulate the execution of the following ${langName} code with the provided input.

Input (stdin):
${stdin}

Code:
${source_code}

Instructions:
1. Analyze the code logic carefully.
2. Calculate the exact output based on the input.
3. If there is a syntax error or compilation error, output the error message.
4. Return ONLY a JSON object with the following structure (no markdown formatting):
{
  "stdout": "actual output here",
  "stderr": "error message if any",
  "compile_output": "",
  "status": { "id": 3, "description": "Accepted" } 
}
If there is an error, set status.id to 6 (Compilation Error) or 11 (Runtime Error) and put the message in stderr.
  `;

  try {
    const response = await axios.post(GEMINI_URL, {
      contents: [{ parts: [{ text: prompt }] }]
    });

    const text = response.data.candidates[0].content.parts[0].text;
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonString);

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      stdout: "",
      stderr: `AI Judge Connection Failed. ${error.response?.data?.error?.message || error.message}`,
      compile_output: "",
      status: { id: 13, description: "Internal Error" }
    };
  }
};

// --- PHASE 4: DEBUG VALIDATOR (Returns ONLY True/False) ---
export const validateDebugCode = async (source_code, language) => {
    console.log("🤖 Asking Gemini to validate syntax (Strict Mode)...");

    const prompt = `
    You are a binary syntax validator.
    Analyze the following ${language} code.
    
    Code:
    ${source_code}

    Task:
    Check ONLY for syntax errors, indentation errors, missing brackets/semicolons, or compilation blockers.
    
    Output Rules:
    - If the code has ANY syntax error (it would fail to compile/run): Return { "correct": false }
    - If the code is syntactically valid (it would compile/run): Return { "correct": true }
    
    Return ONLY the JSON object. Do NOT include any error messages, hints, or explanations.
    `;

    try {
        const response = await axios.post(GEMINI_URL, {
            contents: [{ parts: [{ text: prompt }] }]
        });

        const text = response.data.candidates[0].content.parts[0].text;
        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonString);

    } catch (error) {
        console.error("Gemini Validation Error:", error);
        return { correct: false };
    }
};

// --- PHASE 5: SOLUTION COMPARATOR (Logic Check) ---
export const compareCodeWithSolution = async (userCode, solutionCode, language) => {
    console.log("🤖 Comparing User Code vs Solution...");

    const prompt = `
    You are a Senior Code Reviewer / Judge.
    
    I have two pieces of ${language} code.
    1. **User Code**: Written by a participant.
    2. **Solution Code**: The correct reference implementation.

    **Task:**
    Determine if the **User Code** implements the SAME logic and algorithms as the **Solution Code**.
    
    **Rules:**
    - Ignore variable names, spacing, comments, and print statements.
    - Focus on the algorithms: 
      - Does it filter primes correctly?
      - Does it sanitize strings (alphanumeric)?
      - Does it sort by Length Descending then ID Ascending?
      - Does it shift characters by +1?
    - If the user code logic is correct and handles the tasks, return "correct": true.
    - If the user code has logical errors, missing steps, or syntax errors, return "correct": false.

    **User Code:**
    ${userCode}

    **Solution Code:**
    ${solutionCode}

    **Return ONLY JSON:**
    {
        "correct": boolean,
        "message": "A short, encouraging status message (e.g., 'Logic Matches' or 'Sorting Logic Incorrect')"
    }
    `;

    try {
        const response = await axios.post(GEMINI_URL, {
            contents: [{ parts: [{ text: prompt }] }]
        });

        const text = response.data.candidates[0].content.parts[0].text;
        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonString);

    } catch (error) {
        console.error("Gemini Comparator Error:", error);
        return { 
            correct: false, 
            message: "AI Connection Failed. Please try submitting again." 
        };
    }
};