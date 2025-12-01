import axios from 'axios';

// Use the proxy path defined in vite.config.js
const JUDGE0_API_URL = "/api/judge0"; 

const headers = {
  "content-type": "application/json",
  "Content-Type": "application/json",
};

export const runCode = async (source_code, language_id, stdin = "") => {
  console.log("🚀 Preparing to send code to Judge0...");
  try {
    // 1. Submit Code (wait=false to get token immediately)
    console.log("POSTing submission...");
    const submissionResponse = await axios.post(`${JUDGE0_API_URL}/submissions?base64_encoded=false&wait=false`, {
      source_code,
      language_id,
      stdin,
      redirect_stderr_to_stdout: true
    }, { 
      headers,
      timeout: 10000 // 10s timeout for submission
    });

    const token = submissionResponse.data.token;
    console.log("Token received:", token);
    if (!token) throw new Error("No token received from Judge0");

    // 2. Poll for results
    let result = null;
    let attempts = 0;
    const maxAttempts = 40; // 40 * 500ms = 20 seconds max

    while (attempts < maxAttempts) {
      console.log(`Polling attempt ${attempts + 1}/${maxAttempts}...`);
      const statusResponse = await axios.get(`${JUDGE0_API_URL}/submissions/${token}?base64_encoded=false`, { 
        headers,
        timeout: 5000 
      });
      result = statusResponse.data;

      // Status 1=In Queue, 2=Processing, 3=Accepted, >3=Error/Wrong Answer
      if (result.status.id >= 3) {
        console.log("Execution finished with status:", result.status.description);
        break;
      }

      await new Promise(resolve => setTimeout(resolve, 500));
      attempts++;
    }

    if (!result || result.status.id < 3) {
      console.error("Polling timed out.");
      return { error: "Execution timed out. Judge0 is taking too long." };
    }

    return {
      stdout: result.stdout || "",
      stderr: result.stderr || "",
      compile_output: result.compile_output || "",
      status: result.status,
      message: result.message || ""
    };

  } catch (error) {
    console.error("Judge0 Error Details:", error);
    if (error.code === 'ECONNABORTED') {
      return { error: "Network timeout. Is Judge0 running?" };
    }
    return {
      error: `Execution failed: ${error.message}`
    };
  }
};
