import React from 'react';
import * as THREE from 'three';

export const Table: React.FC = () => {
  return (
    <group>
      {/* Table Bed (Baize) */}
      <mesh receiveShadow position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.778, 3.569]} /> {/* Standard snooker table inner dimensions roughly 6ft x 12ft -> 1.778m x 3.569m */}
        <meshStandardMaterial
          color="#1e592f"
          roughness={0.9}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Cushions (simplified as borders) */}
      <mesh receiveShadow castShadow position={[0, 0.05, -1.8345]}>
        <boxGeometry args={[1.878, 0.1, 0.1]} />
        <meshStandardMaterial color="#1a4d29" roughness={0.8} />
      </mesh>
      <mesh receiveShadow castShadow position={[0, 0.05, 1.8345]}>
        <boxGeometry args={[1.878, 0.1, 0.1]} />
        <meshStandardMaterial color="#1a4d29" roughness={0.8} />
      </mesh>
      <mesh receiveShadow castShadow position={[-0.939, 0.05, 0]}>
        <boxGeometry args={[0.1, 0.1, 3.769]} />
        <meshStandardMaterial color="#1a4d29" roughness={0.8} />
      </mesh>
      <mesh receiveShadow castShadow position={[0.939, 0.05, 0]}>
        <boxGeometry args={[0.1, 0.1, 3.769]} />
        <meshStandardMaterial color="#1a4d29" roughness={0.8} />
      </mesh>
    </group>
  );
};
