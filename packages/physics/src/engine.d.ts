import type { BallState, Spin } from './types';
export declare const checkCollisions: (balls: BallState[]) => void;
export declare const checkCushions: (ball: BallState) => void;
export declare const checkPockets: (ball: BallState) => void;
export declare const simulateShot: (initialBalls: BallState[], cuePower: number, angle: number, spin: Spin) => BallState[][];
//# sourceMappingURL=engine.d.ts.map