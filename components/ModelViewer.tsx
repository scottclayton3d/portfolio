/* eslint-disable react/no-unknown-property */
import React, { Suspense, useMemo, useRef, useState } from "react";
import {
  Canvas,
  useFrame,
} from "@react-three/fiber";
import {
  Environment,
  Html,
  Loader as DreiLoader,
  OrbitControls,
  Stage,
  useGLTF,
  useAnimations,
} from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

/* ---------- Public prop types -------------------------------- */
export interface PlasmicHotspot {
  id: string;
  x: number;
  y: number;
  z: number;
  title: string;
  description?: string;
  color?: string;
}

export interface ModelViewerWithHotspotsProps {
  src: string;
  hotspots?: PlasmicHotspot[];
  envPreset?: "studio" | "city" | "sunset" | "dawn" | "night" | "forest";
  autoRotate?: boolean;
  height?: string;          // “500px”, “60vh”, etc.
}

/* ---------- Internal GLTF model ------------------------------ */
const GLTFModel: React.FC<{ src: string }> = ({ src }) => {
  const gltf = useGLTF(src) as unknown as ReturnType<typeof useGLTF> & {
    animations: THREE.AnimationClip[];
  };
  const { scene, animations } = Array.isArray(gltf) ? gltf[0] : gltf;
  const { mixer } = useAnimations(animations, scene);

  React.useEffect(() => {
    if (animations.length) mixer?.clipAction(animations[0])?.play();
  }, [animations, mixer]);

  return <primitive object={scene} dispose={null} />;
};

/* ---------- Hotspot mesh ------------------------------------- */
interface HotspotMeshProps {
  data: PlasmicHotspot;
  isActive: boolean;
  setActive: (id: string | null) => void;
}

const HotspotMesh: React.FC<HotspotMeshProps> = ({
  data,
  isActive,
  setActive,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const toggle = () => setActive(isActive ? null : data.id);

  /* tiny pulse animation */
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const s = isActive ? 1.25 : 1 + Math.sin(clock.getElapsedTime() * 3) * 0.1;
    meshRef.current.scale.setScalar(s);
  });

  return (
    <group position={[data.x, data.y, data.z]}>
      {/* visual sphere */}
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={toggle}
      >
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial
          color={data.color || "#ff4060"}
          emissive={hovered || isActive ? "#ffffff" : "#000000"}
          emissiveIntensity={hovered || isActive ? 0.7 : 0}
        />
      </mesh>

      {/* keyboard-/screen-reader-friendly invisible button */}
      <Html transform occlude>
        <button
          style={{
            all: "unset",
            width: 14,
            height: 14,
            cursor: "pointer",
          }}
          aria-label={data.title}
          onClick={toggle}
          onKeyDown={(e) => e.key === "Enter" && toggle()}
        />
      </Html>

      {/* info panel */}
      <AnimatePresence>
        {isActive && (
          <Html
            transform
            position={[0, 0.15, 0]}
            distanceFactor={8}
            occlude
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 15 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              style={{
                minWidth: 220,
                maxWidth: 300,
                background: "rgba(20,20,20,.95)",
                color: "#fff",
                padding: "1rem 1.5rem 1rem 1rem",
                borderRadius: 8,
                position: "relative",
                fontSize: "0.9rem",
                lineHeight: 1.45,
                boxShadow: "0 6px 20px rgba(0,0,0,.45)",
                backdropFilter: "blur(3px)",
              }}
              role="dialog"
            >
              <h4 style={{ margin: "0 1.5rem 0.5rem 0" }}>{data.title}</h4>
              <div dangerouslySetInnerHTML={{ __html: data.description || "" }} />
              <button
                onClick={() => setActive(null)}
                style={{
                  all: "unset",
                  position: "absolute",
                  top: 6,
                  right: 8,
                  cursor: "pointer",
                  color: "#ccc",
                  fontSize: 16,
                }}
                aria-label="Close"
              >
                ✕
              </button>
            </motion.div>
          </Html>
        )}
      </AnimatePresence>
    </group>
  );
};

/* ---------- Main viewer -------------------------------------- */
export default function ModelViewerWithHotspots({
  src,
  hotspots = [],
  envPreset = "studio",
  autoRotate = true,
  height = "500px",
}: ModelViewerWithHotspotsProps) {
  const style = useMemo(
    () => ({ width: "100%", height, position: "relative" as const }),
    [height]
  );
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div style={style}>
      <Canvas shadows dpr={[1, 2]} camera={{ position: [3, 2, 3], fov: 35 }}>
        <Suspense fallback={null}>
          <Stage
            preset="rembrandt"
            environment={envPreset}
            intensity={1}
            adjustCamera
            shadows
          >
            <GLTFModel src={src} />
            {hotspots.map((h) => (
              <HotspotMesh
                key={h.id}
                data={h}
                isActive={activeId === h.id}
                setActive={setActiveId}
              />
            ))}
          </Stage>

          <OrbitControls
            makeDefault
            enableDamping
            autoRotate={autoRotate}
            autoRotateSpeed={1.4}
          />
          <Environment preset={envPreset} />
        </Suspense>
      </Canvas>
      <DreiLoader />
    </div>
  );
}

/* ---- Preload helper (optional) ------------------------------ */
useGLTF.preload("models/p99.gltf");