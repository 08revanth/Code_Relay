import axios from 'axios';

const JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com"; // Or your self-hosted instance
// NOTE: For a real event, you should use a self-hosted instance or a paid plan to avoid rate limits.
// We will use the public CE API for now, but keys should be managed via env vars.
// Since this is a frontend-only app, keys will be exposed. 
// For this demo, we assume a self-hosted instance or we'll use a placeholder if no key is provided.

const API_KEY = ""; // User should provide this or we use a free tier if available without key (limited)
const API_HOST = "judge0-ce.p.rapidapi.com";

const headers = {
  "content-type": "application/json",
  "Content-Type": "application/json",
  // "X-RapidAPI-Key": API_KEY,
  // "X-RapidAPI-Host": API_HOST
};

// If using a self-hosted instance (recommended for events):
const USE_SELF_HOSTED = true; 
const SELF_HOSTED_URL = "http://localhost:2358"; // Default Judge0 Docker port

const getBaseUrl = () => USE_SELF_HOSTED ? SELF_HOSTED_URL : JUDGE0_API_URL;
const getHeaders = () => USE_SELF_HOSTED ? { "Content-Type": "application/json" } : headers;

export const runCode = async (source_code, language_id, stdin = "") => {
  try {
    const baseUrl = getBaseUrl();
    const headers = getHeaders();

    // 1. Submit Code
    const submissionResponse = await axios.post(`${baseUrl}/submissions?base64_encoded=false&wait=true`, {
      source_code,
      language_id,
      stdin,
      redirect_stderr_to_stdout: true
    }, { headers });

    const result = submissionResponse.data;

    // If wait=true is supported and works, we get the result immediately.
    // Otherwise, we might need to poll. Judge0 CE usually supports wait=true.

    return {
      stdout: result.stdout || "",
      stderr: result.stderr || "",
      compile_output: result.compile_output || "",
      status: result.status
    };

  } catch (error) {
    console.error("Judge0 Error:", error);
    return {
      error: "Execution failed. Check API connection."
    };
  }
};
