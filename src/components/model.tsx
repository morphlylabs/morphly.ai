"use client";

import {
  Grid,
  Html,
  OrbitControls,
  Stage,
  useProgress,
} from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import { Suspense } from "react";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";

function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress.toFixed(2)}%</Html>;
}

function ModelMesh({ src }: { src: string }) {
  const geometry = useLoader(STLLoader, src);
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
    <div className="h-screen w-screen">
      <Canvas>
        <Suspense fallback={<Loader />}>
          <Stage
            preset="rembrandt"
            intensity={1}
            environment="studio"
            adjustCamera={1.5}
          >
            <ModelMesh src={src} />
          </Stage>
          <Grid infiniteGrid />
          <OrbitControls />
        </Suspense>
      </Canvas>
    </div>
  );
}
