"use client";

import { useState, type ChangeEvent } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Model from "./model";

export default function Scene() {
  const [buffer, setBuffer] = useState<ArrayBuffer | null>(null);

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const buffer = await file.arrayBuffer();
    setBuffer(buffer);
  };

  return (
    <div>
      <input type="file" accept=".stl" onChange={handleUpload} />
      <div style={{ width: "100%", height: "600px" }}>
        <Canvas camera={{ position: [0, 0, 100] }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[0, 0, 1]} />
          <Model buffer={buffer} />
          <OrbitControls />
        </Canvas>
      </div>
    </div>
  );
}
