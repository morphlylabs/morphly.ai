"use client";

import {
  Grid,
  Html,
  OrbitControls,
  Stage,
  useProgress,
} from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { Box3, Vector3 } from "three";

function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress.toFixed(2)}%</Html>;
}

function ModelMesh({ src }: { src: string }) {
  const geometry = useLoader(STLLoader, src).center();

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color="silver" />
    </mesh>
  );
}

interface Props {
  src: string;
}

export default function Model({ src }: Props) {
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
            <ModelMesh src={src} />
          </Suspense>
        </Stage>
        <Grid infiniteGrid />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
