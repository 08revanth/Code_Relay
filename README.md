# CSE Fest 2025 - Event System

A complete React-based event system for the CSE Fest, featuring a hybrid physical/digital scavenger hunt and coding challenges.

## 🚀 Features

-   **Team Dashboard**: Real-time progress tracking for 10 teams.
-   **Phase Orchestration**: Enforces a strict phase order (Phase 3 is always Role Swap).
-   **Offline-First**: Uses `localStorage` for state persistence (No backend required).
-   **Judge0 Integration**: Real-time C++ code execution for debugging and coding phases.
-   **Cyberpunk UI**: Fully responsive, dark-mode aesthetic with neon animations.

## 🛠️ Tech Stack

-   **Frontend**: React, Vite, Tailwind CSS v4
-   **State**: React Context + LocalStorage
-   **Editor**: Monaco Editor (`@monaco-editor/react`)
-   **Execution**: Judge0 (Self-Hosted via Docker)
-   **Icons**: Lucide React

## 🏁 Getting Started

### Prerequisites

-   Node.js (v18+)
-   Docker & Docker Compose (for Judge0)

### 1. Start Judge0 (Code Execution Engine)

This project uses a local instance of Judge0 to execute code without rate limits.

```bash
cd judge0
docker-compose up -d
```
*Wait a few minutes for the images to pull and services to start.*

### 2. Start the Application

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🎮 Game Flow

1.  **Home**: Select your Team ID (1-10).
2.  **Dashboard**: View your current phase.
3.  **Phase 1 (QR Hunt)**: Find physical QR codes and enter the hidden strings.
4.  **Phase 2 (Prediction)**: Predict the output of C++ code snippets.
5.  **Phase 3 (Role Swap)**: Mandatory physical location swap between Indoor/Outdoor sub-teams.
6.  **Phase 4 (Debugging)**: Fix buggy C++ code using the in-browser editor.
7.  **Final Phase**: Solve 3 coding subtasks to unlock hints.
8.  **Final Merge**: Combine hints with the outdoor clue to reveal the victory phrase.

## 📂 Project Structure

```
src/
├── components/   # Reusable UI (Layout, PhaseGuard)
├── contexts/     # GameContext (State & Logic)
├── data/         # JSON Configuration (Questions, Team Orders)
├── pages/        # Individual Phase Pages
├── utils/        # Helpers (Judge0 API, Storage)
└── App.jsx       # Routing
```

## 🧩 Configuration

-   **Team Orders**: `src/data/teamPhaseOrder.json`
-   **Questions**: `src/data/*.json`
-   **Judge0 Settings**: `src/utils/judge0.js`

## 🏆 Victory Condition

The final passphrase is: **"RISE TO GLORY FOREVER"**
