import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html } from '@react-three/drei';

export interface ModelViewer3DProps {
  modelUrl: string; // Path or URL to your .glb/.gltf model
  className?: string;
  cameraX?: number;
  cameraY?: number;
  cameraZ?: number;
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

const ModelViewer3D: React.FC<ModelViewer3DProps> = ({ modelUrl, className = '', cameraX = 0, cameraY = 0, cameraZ = 5 }) => {
  return (
    <div className={className} style={{ width: '100%', height: '500px' }}>
      <Canvas camera={{ position: [cameraX, cameraY, cameraZ], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Suspense fallback={<Html center>Loading...</Html>}>
          <Model url={modelUrl} />
        </Suspense>
        <OrbitControls enablePan enableZoom enableRotate />
      </Canvas>
    </div>
  );
};

export default ModelViewer3D;