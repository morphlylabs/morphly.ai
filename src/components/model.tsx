"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { type BufferGeometry, type Mesh } from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";

type ModelProps = { buffer: ArrayBuffer | null };

export default function Model({ buffer }: ModelProps) {
  const meshRef = useRef<Mesh>(null!);
  const [geometry, setGeometry] = useState<BufferGeometry | null>(null);

  useFrame(() => {
    if (buffer && !geometry) {
      const loader = new STLLoader();
      const geom = loader.parse(buffer);
      setGeometry(geom);
    }
  });

  if (!geometry) return null;

  return (
    <mesh ref={meshRef} geometry={geometry} rotation-x={-Math.PI / 2}>
      <meshStandardMaterial color="silver" />
    </mesh>
  );
}
