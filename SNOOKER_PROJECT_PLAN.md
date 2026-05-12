# SNOOKER 20XX: The IMAX x GTA VI Experience

## 1. Core Vision & Design Philosophy
A state-of-the-art, browser-based 3D multiplayer snooker game that revives the tactical depth of *Snooker 2003* but wraps it in breathtaking, high-fidelity graphics ("GTA VI meets IMAX").
- **IMAX Immersion:** Sweeping cinematic camera angles, extreme depth-of-field, lens flares, and hyper-realistic lighting.
- **GTA VI Realism:** Gritty, highly detailed environments (a smoky underground high-stakes club, or a neon-lit penthouse arena), volumetric fog, ray-traced-like reflections on the snooker balls, and highly detailed cue models.
- **Browser-Native:** Instantly accessible via WebGL/WebGPU without downloads.
- **Agent-Oriented Architecture:** Designed from scratch using strict decoupled modularity (Event-Driven Architecture) so multiple AI or human agents can develop systems simultaneously without merge conflicts.

## 2. Tech Stack Selection
To achieve both high-end graphics and decoupled development:
- **Rendering:** **Three.js** via **React Three Fiber (R3F)** (Allows component-based 3D objects, easy to split among developers).
- **Physics:** **Rapier.js** (WASM-based, highly performant, deterministic physics engine required for precise snooker mechanics).
- **Networking:** **Colyseus.js** + Node.js (Authoritative server for state synchronization and lag compensation).
- **UI/UX:** **React** + **Tailwind CSS** (Overlaid on top of the 3D canvas).
- **Audio:** **Howler.js** + Web Audio API for 3D spatial sound (chalking the cue, ball clacks, ambient crowd).

## 3. Architecture for Conflict-Free Multi-Agent Development
To ensure multiple agents can work simultaneously, the project uses a **Strict Decoupled Event-Bus Architecture**.
Systems do not call each other directly. Instead, they emit and listen to events (e.g., `CUE_STRIKE`, `BALL_POTTED`, `FOUL_COMMITTED`).

### The Core Modules (Strictly separated folders & state):
1. `/packages/physics` - Pure math and collision logic.
2. `/packages/rendering` - Visuals, shaders, and animations.
3. `/packages/network` - Server state and WebRTC/WebSocket communication.
4. `/packages/rules` - Snooker rule engine (pure functions).
5. `/packages/ui` - 2D DOM overlays and HUD.

---

## 4. Elaborate Plan of Execution (Multi-Agent Work Breakdown)

### Phase 1: Foundation & Scaffolding (Infrastructure Agent)
**Goal:** Set up the monorepo and CI/CD, establishing the event bus.
- **Task 1:** Initialize a Turborepo/Lerna monorepo to separate packages.
- **Task 2:** Set up the global Event Bus (Zustand or Redux Toolkit).
- **Task 3:** Define strict TypeScript interfaces for all shared events (`GameState`, `PhysicsUpdate`, `PlayerAction`). *Once interfaces are locked, agents can work independently.*

### Phase 2: Simultaneous Core Development (Agents 1-4)
Because of the event-driven design, the following 4 agents can work in parallel without touching the same files.

#### 🤖 Agent 1: The "Newton" Agent (Physics & Mechanics)
**Scope:** `/packages/physics`
- **Objective:** Build a highly accurate, deterministic snooker physics engine.
- **Tasks:**
  - Implement table dimensions, cushion elasticity, and pocket thresholds.
  - Implement complex ball mechanics: topspin, backspin, sidespin, swerve, and friction.
  - Expose a `simulateShot(cuePower, angle, spin)` function that returns a full array of ball trajectories.
  - *Conflict avoidance:* Agent 1 only outputs trajectory data and listens for `CUE_STRIKE` events. No rendering code allowed.

#### 🤖 Agent 2: The "Spielberg" Agent (Rendering & Cinematography)
**Scope:** `/packages/rendering`
- **Objective:** Create the "GTA VI meets IMAX" visual experience.
- **Tasks:**
  - Load and map high-poly PBR (Physically Based Rendering) assets for the table, baize (cloth), balls, and cues.
  - Implement volumetric lighting (cigar smoke in the lights above the table) and soft shadows.
  - Add post-processing: Bloom, Screen Space Ambient Occlusion (SSAO), and Depth of Field (focusing dynamically on the cue ball or target ball).
  - Create the "Director Camera": A cinematic camera system that auto-switches angles based on the shot being played (e.g., following the ball in slow-motion for a match-winning pot).
  - *Conflict avoidance:* Agent 2 only reads the `GameState` and `PhysicsUpdate` streams to update 3D mesh positions.

#### 🤖 Agent 3: The "Referee" Agent (Game Logic & Rules)
**Scope:** `/packages/rules`
- **Objective:** Implement the complex rules of Snooker.
- **Tasks:**
  - Track current break, remaining reds, colors in sequence.
  - Detect fouls (in-off, hitting wrong color, failure to hit a ball).
  - Calculate snookers and "free ball" scenarios.
  - *Conflict avoidance:* Operates as a pure state machine. It takes an input (`BALLS_STOPPED` with ball locations) and outputs a new `GameState` (Scores, Whose turn, Foul state).

#### 🤖 Agent 4: The "Netcode" Agent (Multiplayer)
**Scope:** `/packages/network`
- **Objective:** Seamless, lag-free online multiplayer.
- **Tasks:**
  - Setup Colyseus server rooms for matchmaking (1v1).
  - Implement state interpolation (smoothing out ball movements for clients with high ping).
  - Implement server-side validation to prevent cheating (server verifies the physics simulation).
  - *Conflict avoidance:* Acts as the bridge. Broadcasts local events to the server and patches local state with server state.

### Phase 3: The "Immersion" Layer (Agents 5 & 6)
Once the core is stable, these agents layer on the polish.

#### 🤖 Agent 5: The "UI/UX" Agent
**Scope:** `/packages/ui`
- **Objective:** A diegetic, slick HUD.
- **Tasks:**
  - Create the shot-planning interface (power meter, spin selection UI).
  - Create player profile cards, live scoring overlay, and chat.
  - *Design style:* Minimalist, glassy, high-contrast (akin to modern high-end sports broadcasts).

#### 🤖 Agent 6: The "Foley" Agent (Audio)
**Scope:** `/packages/audio`
- **Objective:** Immersive spatial audio.
- **Tasks:**
  - Calculate impact sounds based on collision velocity from the physics engine.
  - Add ambient soundscapes (distant city sounds, murmurs, clinking glasses).

### Phase 4: Integration, Testing, and Deployment
- **Integration:** The Infrastructure Agent wires the modules together using the predefined event interfaces.
- **Testing:** Playwright for UI testing, Jest for strict rule/physics testing.
- **Deployment:** Vercel for Frontend, AWS/GCP for WebSocket Node.js servers.

## 5. Summary of Conflict-Free Guarantee
By enforcing **Data-Oriented Design** and an **Event Bus**:
1. The **Renderer** doesn't care *how* a ball moves, it just receives `[x, y, z]` coordinates.
2. The **Physics Engine** doesn't care *what* a ball looks like, it just calculates math.
3. The **Rules Engine** doesn't care *who* is playing, it just evaluates array collisions.
This guarantees zero file overlaps during parallel development.
