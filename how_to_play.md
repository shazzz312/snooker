# How to Play & Run Snooker 20XX Locally

Welcome to Snooker 20XX! This document explains how to set up and run the multi-agent snooker project on your local machine.

## Prerequisites
- **Node.js**: Make sure you have Node.js installed (v18 or higher is recommended).
- **npm**: Node Package Manager (comes with Node.js).

## Installation
The project is built as a monorepo utilizing npm workspaces.

1. Open your terminal.
2. Navigate to the root directory of this repository (the folder containing `index.html` and `package.json`).
3. Run the following command to install dependencies across all sub-packages:
   ```bash
   npm install
   ```

## Starting the Game

### 1. Start the Multiplayer Server
The game uses a Colyseus server for networking. You must start the server so the clients can connect.
1. Open a new terminal window/tab.
2. Navigate to the networking package:
   ```bash
   cd packages/network
   ```
3. Start the server (depending on the package's configuration, you can typically run the index file or the package script):
   ```bash
   npm start
   ```
   *(Note: The server will run on port 2567 by default.)*

### 2. Start the Game Client (Frontend)
The frontend connects the UI, Renderer, Physics, and Audio.
1. Go back to your first terminal window (in the root directory).
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Your terminal will output a local URL (e.g., `http://localhost:3000/index.html` or `http://localhost:5173/index.html`).
4. Open that URL in your web browser.

Alternatively, if you're using live preview extensions, you can open `index.html` directly or let Vite handle the routing. Enjoy the high-fidelity immersive snooker experience!
