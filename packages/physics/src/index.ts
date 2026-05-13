import { EventEmitter } from 'events';
import { simulateShot } from './engine';
import type { GameState, PhysicsUpdate, PlayerAction, Spin } from './types';

export const physicsEventEmitter = new EventEmitter();

// Listen for CUE_STRIKE event emitted by UI/Network
physicsEventEmitter.on('CUE_STRIKE', (payload: { gameState: GameState, action: PlayerAction }) => {
  const { gameState, action } = payload;

  // Run pure deterministic physics simulation
  const trajectories = simulateShot(
    gameState.balls,
    action.cuePower,
    action.angle,
    action.spin
  );

  // Construct standard event response
  const update: PhysicsUpdate = {
    trajectories,
  };

  // Broadcast the result
  physicsEventEmitter.emit('PHYSICS_UPDATE', update);
});
