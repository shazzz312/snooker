import * as THREE from 'three';
import React from 'react';
import { EffectComposer, Bloom, SSAO, DepthOfField, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

export const PostProcessing: React.FC = () => {
  return (
    <EffectComposer multisampling={4}>
      {/* SSAO helps with the shadows between balls and cushions */}
      <SSAO
        blendFunction={BlendFunction.MULTIPLY}
        samples={30}
        radius={0.1}
        intensity={20}
        luminanceInfluence={0.5}
        color={new THREE.Color("black")}
      />

      {/* Bloom gives a slight glow to highlights, contributing to the IMAX feel */}
      <Bloom
        intensity={0.5}
        luminanceThreshold={0.8}
        luminanceSmoothing={0.025}
      />

      {/* Depth of Field to give that cinematic look when focused on a ball */}
      <DepthOfField
        focusDistance={0.05}
        focalLength={0.02}
        bokehScale={2}
        height={480}
      />

      {/* Vignette adds to the dramatic cinematic lighting */}
      <Vignette
        eskil={false}
        offset={0.1}
        darkness={1.1}
      />
    </EffectComposer>
  );
};
