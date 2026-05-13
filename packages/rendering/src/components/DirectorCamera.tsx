import React, { useRef, useEffect } from 'react';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface DirectorCameraProps {
  viewMode: 'overhead' | 'cue' | 'cinematic';
  targetBallPosition?: [number, number, number];
  cueBallPosition?: [number, number, number];
}

export const DirectorCamera: React.FC<DirectorCameraProps> = ({
  viewMode,
  targetBallPosition,
  cueBallPosition
}) => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  useEffect(() => {
    if (!cameraRef.current) return;

    // Jump cuts for camera positions based on mode
    if (viewMode === 'overhead') {
      cameraRef.current.position.set(0, 4, 0);
      cameraRef.current.lookAt(0, 0, 0);
    }
  }, [viewMode]);

  useFrame(() => {
    if (!cameraRef.current) return;

    if (viewMode === 'cue' && cueBallPosition && targetBallPosition) {
      // Position camera behind the cue ball looking at the target
      const cuePos = new THREE.Vector3(...cueBallPosition);
      const targetPos = new THREE.Vector3(...targetBallPosition);
      const dir = targetPos.clone().sub(cuePos).normalize();

      const camPos = cuePos.clone().sub(dir.multiplyScalar(0.5)).add(new THREE.Vector3(0, 0.2, 0));

      cameraRef.current.position.lerp(camPos, 0.1);
      cameraRef.current.lookAt(targetPos);
    } else if (viewMode === 'cinematic' && cueBallPosition) {
      // Dynamic circling
      const time = Date.now() * 0.0005;
      const radius = 1.5;
      const x = cueBallPosition[0] + Math.cos(time) * radius;
      const z = cueBallPosition[2] + Math.sin(time) * radius;

      cameraRef.current.position.lerp(new THREE.Vector3(x, 1, z), 0.05);
      cameraRef.current.lookAt(new THREE.Vector3(...cueBallPosition));
    }
  });

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        fov={45}
        near={0.01}
        far={100}
      />
      {viewMode === 'overhead' && <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />}
    </>
  );
};
