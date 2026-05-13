export interface Vector2D {
    x: number;
    y: number;
}
export interface BallState {
    id: string;
    position: Vector2D;
    velocity: Vector2D;
    active: boolean;
}
export interface Spin {
    top: number;
    side: number;
}
export interface PlayerAction {
    cuePower: number;
    angle: number;
    spin: Spin;
}
export interface PhysicsUpdate {
    trajectories: BallState[][];
}
export interface GameState {
    balls: BallState[];
    currentPlayer: string;
}
//# sourceMappingURL=types.d.ts.map