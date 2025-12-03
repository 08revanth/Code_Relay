import axios from 'axios';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// --- GENERIC EXECUTION ---
export const runCode = async (source_code, language_id, stdin = "") => {
  // Legacy function for direct execution if needed
  return { stdout: "", stderr: "" };
};

// --- PHASE 4: DEBUG VALIDATOR ---
export const validateDebugCode = async (source_code, language) => {
    console.log("🤖 Asking Gemini to validate syntax...");
    const prompt = `
    You are a binary syntax validator.
    Analyze the following ${language} code.
    Check ONLY for syntax errors, indentation errors, or compilation blockers.
    If valid: return { "correct": true }. If invalid: return { "correct": false }.
    Return ONLY JSON.
    Code: ${source_code}
    `;
    try {
        const response = await axios.post(GEMINI_URL, { contents: [{ parts: [{ text: prompt }] }] });
        const text = response.data.candidates[0].content.parts[0].text;
        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonString);
    } catch (error) {
        return { correct: false };
    }
};

// --- PHASE 5: SOLUTION COMPARATOR (Cheat Detection) ---
export const compareCodeWithSolution = async (userCode, solutionCode, language) => {
    console.log("🤖 Comparing User Code vs Solution...");

    const prompt = `
    You are a Senior Code Judge.
    
    I have two pieces of ${language} code.
    1. **User Code**: Written by a participant.
    2. **Solution Code**: The correct reference implementation.

    **Task:**
    Determine if the **User Code** implements the correct algorithmic logic to solve the problem.

    **CRITICAL CHEAT DETECTION:**
    - If the user simply prints the final answer (e.g., 'printf("pelmt")' or 'print("pelmt")') WITHOUT implementing the logic steps (Filter, Sanitize, Sort, Forge), you must return "correct": false.
    - The user MUST implement:
      1. Prime Checking/Filtering.
      2. String Sanitization (removing special chars).
      3. Sorting logic (or calling the helper).
      4. Middle character extraction.

    **Rules:**
    - Ignore variable names, spacing, comments, and extra print statements.
    - If the logic is valid and matches the Solution Code's intent, return "correct": true.
    - If logic is missing or they are hardcoding the output, return "correct": false.

    **User Code:**
    ${userCode}

    **Solution Code:**
    ${solutionCode}

    **Return ONLY JSON:**
    {
        "correct": boolean,
        "message": "Short feedback (e.g., 'Logic verified' or 'Hardcoded answer detected')"
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