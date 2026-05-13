import { simulateShot } from '../src/engine';
import type { BallState, Spin } from '../src/types';
import { physicsEventEmitter } from '../src/index';

describe('Physics Engine', () => {
  it('should simulate a basic shot and return a trajectory array', () => {
    const initialBalls: BallState[] = [
      { id: 'cue', position: { x: 500, y: 500 }, velocity: { x: 0, y: 0 }, active: true },
    ];
    const spin: Spin = { top: 0, side: 0 };

    // Hit cue left along the x-axis (rotate(0, 100) by PI/2 = (-100, 0))
    const trajectories = simulateShot(initialBalls, 100, Math.PI / 2, spin);

    expect(trajectories.length).toBeGreaterThan(0);
    // Initial position
    expect(trajectories[0][0].position.y).toBe(500);
    expect(trajectories[0][0].position.x).toBe(500);
    // Position x should decrease over time due to impulse moving left
    expect(trajectories[trajectories.length - 1][0].position.x).toBeLessThan(500);
  });

  it('should be deterministic given the same inputs', () => {
     const initialBalls: BallState[] = [
      { id: 'cue', position: { x: 500, y: 500 }, velocity: { x: 0, y: 0 }, active: true },
      { id: 'red_1', position: { x: 500, y: 1000 }, velocity: { x: 0, y: 0 }, active: true },
    ];
    const spin: Spin = { top: 0, side: 0 };

    const trajectories1 = simulateShot(initialBalls, 500, Math.PI / 2, spin);
    const trajectories2 = simulateShot(initialBalls, 500, Math.PI / 2, spin);

    expect(trajectories1).toEqual(trajectories2);
  });
});

describe('Event Listener', () => {
  it('should listen to CUE_STRIKE and emit PHYSICS_UPDATE with trajectories', (done) => {
    const payload = {
        gameState: {
            balls: [{ id: 'cue', position: { x: 500, y: 500 }, velocity: { x: 0, y: 0 }, active: true }],
            currentPlayer: 'player1'
        },
        action: {
            cuePower: 100,
            angle: Math.PI / 2,
            spin: { top: 0, side: 0 }
        }
    };

    physicsEventEmitter.once('PHYSICS_UPDATE', (update) => {
        expect(update).toHaveProperty('trajectories');
        expect(update.trajectories.length).toBeGreaterThan(0);
        done();
    });

    physicsEventEmitter.emit('CUE_STRIKE', payload);
  });
});
