"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import { useRouter } from "next/navigation";

function Model() {
  const ref = useRef();
  const { scene, animations } = useGLTF("/outifit.glb");
  const { actions } = useAnimations(animations, ref);
  useFrame(() => {
    if (actions && actions["cube1"]) {
      actions["cube1"].play();
      actions["cube2"].play();
    }
  });
  return (
    <mesh
      ref={ref}
      rotation={[0.7, 0, 0]}
      position={[0, -1.5, 0]}
      scale={[0.8, 0.8, 0.8]}
    >
      <primitive object={scene} />
    </mesh>
  );
}

function Error({ text }) {
  return (
    <div className="w-full h-[100vh] flex flex-col justify-center items-center  h-[100px]">
      <Canvas className="h-[50%]">
        <hemisphereLight intensity={2} color={"orange"} />
        <Model />
      </Canvas>
      <h1 className="font-bold text-4xl text-red-500">OOPS !</h1>
      <h1>
        {text} {":("}
      </h1>
    </div>
  );
}

export default Error;
