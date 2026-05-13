import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Table } from './components/Table';
import { Ball } from './components/Ball';
import { Cue } from './components/Cue';
import { Lighting } from './components/Lighting';
import { PostProcessing } from './components/PostProcessing';
import { DirectorCamera } from './components/DirectorCamera';
import { GameState, PhysicsUpdate } from './types';

export interface SceneProps {
  gameState: GameState;
  physicsState: PhysicsUpdate;
}

export const Scene: React.FC<SceneProps> = ({ gameState, physicsState }) => {
  const cueBall = physicsState.balls.find((b) => b.color === 'white' || b.id === 'cueball');
  const targetBall = gameState.activeTargetBallId
    ? physicsState.balls.find((b) => b.id === gameState.activeTargetBallId)
    : undefined;

  return (
    <Canvas shadows dpr={[1, 2]} gl={{ antialias: false, powerPreference: "high-performance" }}>
      <color attach="background" args={['#050505']} />

      <Lighting />

      <DirectorCamera
        viewMode={gameState.viewMode}
        cueBallPosition={cueBall?.position}
        targetBallPosition={targetBall?.position}
      />

      <group>
        <Table />

        {physicsState.balls.map((ball) => (
          <Ball
            key={ball.id}
            id={ball.id}
            position={ball.position}
            color={ball.color}
          />
        ))}

        {cueBall && (
          <Cue
            position={cueBall.position}
            rotation={gameState.cueRotation}
            isStriking={gameState.isCueStriking}
          />
        )}
      </group>

      <PostProcessing />
    </Canvas>
  );
};

export * from './types';
export * from './components/Table';
export * from './components/Ball';
export * from './components/Cue';
export * from './components/Lighting';
export * from './components/PostProcessing';
export * from './components/DirectorCamera';
