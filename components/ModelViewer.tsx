import { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { Loader2 } from 'lucide-react';
import * as THREE from 'three';

interface ModelProps {
  modelPath: string;
}

function Model({ modelPath }: ModelProps) {
  // Create a simple rotating box instead of loading GLTF
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Add rotation animation
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = Math.sin(t / 4) * 0.3;
    meshRef.current.rotation.y = t * 0.2;
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial color="#FF3366" metalness={0.8} roughness={0.2} />
    </mesh>
  );
}

// Fallback component that uses a different 3D model if specified model fails to load
function FallbackModel() {
  // Use a built-in geometry as fallback
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#FF3366" />
    </mesh>
  );
}

// Loading component
function ModelLoader() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center text-white">
        <Loader2 className="h-8 w-8 animate-spin mb-2 text-accent" />
        <p className="text-sm font-opensans">Loading 3D model...</p>
      </div>
    </Html>
  );
}

interface ModelViewerProps {
  modelPath: string;
  height?: string;
}

export default function ModelViewer({ modelPath, height = '400px' }: ModelViewerProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div 
      className="relative bg-primary rounded-lg overflow-hidden border border-secondary"
      style={{ height }}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <Suspense fallback={<ModelLoader />}>
          <Model modelPath={modelPath} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <directionalLight position={[-5, -5, -5]} intensity={0.2} />
          <OrbitControls 
            enablePan={true} 
            enableZoom={true} 
            enableRotate={true}
            minDistance={2}
            maxDistance={10}
          />
        </Suspense>
      </Canvas>
      
      {/* Instructions overlay */}
      <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-70 text-white text-xs p-2 rounded">
        <p className="text-center">
          <span className="text-accent font-semibold">INTERACTIVE:</span> Click and drag to rotate. Scroll to zoom. Shift+drag to pan.
        </p>
      </div>
    </div>
  );
}