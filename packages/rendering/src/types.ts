export interface PhysicsUpdate {
  balls: {
    id: string;
    position: [number, number, number];
    velocity: [number, number, number];
    color: string;
  }[];
}

export interface GameState {
  currentPlayerId: string;
  viewMode: 'overhead' | 'cue' | 'cinematic';
  activeTargetBallId?: string;
  isCueStriking: boolean;
  cueRotation: [number, number, number];
}
