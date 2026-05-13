import React from 'react';
import { Vector3 } from 'three';

export interface BallProps {
  id: string;
  position: [number, number, number];
  color: string;
}

export const Ball: React.FC<BallProps> = ({ position, color }) => {
  return (
    <mesh castShadow receiveShadow position={position}>
      {/* Standard snooker ball radius is 52.5mm / 2 = 26.25mm = 0.02625m */}
      <sphereGeometry args={[0.02625, 32, 32]} />
      <meshStandardMaterial
        color={color}
        roughness={0.1} // shiny
        metalness={0.1} // slight specular highlight
        envMapIntensity={1.0} // good reflection
      />
    </mesh>
  );
};
