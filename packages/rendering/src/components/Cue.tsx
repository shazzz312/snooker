import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface CueProps {
  position: [number, number, number];
  rotation: [number, number, number];
  isStriking?: boolean;
}

export const Cue: React.FC<CueProps> = ({ position, rotation, isStriking = false }) => {
  const cueRef = useRef<THREE.Group>(null);

  // Simple strike animation simulation
  useFrame((state) => {
    if (isStriking && cueRef.current) {
      const time = state.clock.getElapsedTime();
      // Animate stroke back and forth based on time if striking
      cueRef.current.position.z = position[2] + Math.sin(time * 10) * 0.1;
    } else if (cueRef.current) {
      cueRef.current.position.z = position[2];
    }
  });

  return (
    <group ref={cueRef} position={position} rotation={rotation}>
      <mesh castShadow receiveShadow position={[0, 0, 0.75]}>
        {/* Cue is roughly 1.5m long, tapered */}
        <cylinderGeometry args={[0.015, 0.005, 1.5, 16]} />
        <meshStandardMaterial color="#8b5a2b" roughness={0.6} metalness={0.1} />
      </mesh>
      {/* Cue tip */}
      <mesh position={[0, -0.75, 0.75]}>
        <cylinderGeometry args={[0.005, 0.005, 0.01, 16]} />
        <meshStandardMaterial color="#33aaff" roughness={0.9} />
      </mesh>
    </group>
  );
};
