'use client';

import {
  Grid,
  Html,
  OrbitControls,
  Stage,
  useProgress,
} from '@react-three/drei';
import { Canvas, useLoader } from '@react-three/fiber';
import { Suspense } from 'react';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';

function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress.toFixed(2)}%</Html>;
}

function AssetMesh({ src }: { src: string }) {
  const geometry = useLoader(STLLoader, src).center();

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color="silver" />
    </mesh>
  );
}

interface AssetProps {
  src: string;
}

export default function Asset({ src }: AssetProps) {
  return (
    <div className="h-full w-full">
      <Canvas camera={{ position: [45, 45, 45] }}>
        <Stage
          preset="rembrandt"
          intensity={1}
          environment="studio"
          adjustCamera={1.5}
        >
          <Suspense fallback={<Loader />}>
            <AssetMesh src={src} />
          </Suspense>
        </Stage>
        <Grid infiniteGrid />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
