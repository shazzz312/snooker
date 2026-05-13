import React from 'react';
import { Environment } from '@react-three/drei';

export const Lighting: React.FC = () => {
  return (
    <>
      {/* Base ambient lighting */}
      <ambientLight intensity={0.2} color="#ffffff" />

      {/* Main overhead lights typical in snooker/pool halls */}
      <spotLight
        position={[0, 2, 0]}
        intensity={2.5}
        angle={Math.PI / 3}
        penumbra={0.5}
        castShadow
        color="#fff5e6"
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />

      {/* Some peripheral/fill lights to mimic room bounce */}
      <pointLight position={[-3, 2, -3]} intensity={0.5} color="#4455aa" />
      <pointLight position={[3, 2, 3]} intensity={0.5} color="#aa5544" />

      {/*
        Using an Environment gives us nice PBR reflections on the balls
        without needing explicit custom reflection maps
      */}
      <Environment preset="city" />
    </>
  );
};
