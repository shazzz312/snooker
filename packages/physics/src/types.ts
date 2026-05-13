export interface Vector2D {
  x: number;
  y: number;
}

export interface BallState {
  id: string;
  position: Vector2D;
  velocity: Vector2D;
  active: boolean; // false if potted
}

export interface Spin {
  top: number; // Positive = topspin, negative = backspin
  side: number; // Positive = right, negative = left
}

export interface PlayerAction {
  cuePower: number;
  angle: number;
  spin: Spin;
}

export interface PhysicsUpdate {
  trajectories: BallState[][]; // Array of states over time
}

export interface GameState {
  balls: BallState[];
  currentPlayer: string;
  // Other rules engine logic would go here,
  // but keeping it simple for the physics interface context
}
