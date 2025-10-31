import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

interface CarProps {
  isLoggingIn: boolean;
}

function Car({ isLoggingIn }: CarProps) {
  const carRef = useRef<THREE.Group>(null);
  const initialPosition = -15;
  const parkingPosition = -3;

  useEffect(() => {
    if (carRef.current) {
      carRef.current.position.x = initialPosition;
    }
  }, []);

  useFrame(() => {
    if (carRef.current) {
      if (isLoggingIn) {
        // Drive forward into the distance
        if (carRef.current.position.z < 50) {
          carRef.current.position.z += 0.5;
          carRef.current.position.y -= 0.01;
        }
      } else {
        // Drive in from the side to parking position
        if (carRef.current.position.x < parkingPosition) {
          carRef.current.position.x += 0.08;
        }
      }
    }
  });

  return (
    <group ref={carRef}>
      {/* Car body */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[2, 1, 4]} />
        <meshStandardMaterial color="#ff6b6b" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Car cabin */}
      <mesh position={[0, 1.3, -0.5]} castShadow>
        <boxGeometry args={[1.8, 0.8, 2]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Wheels */}
      <mesh position={[-1, 0, 1.2]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[1, 0, 1.2]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[-1, 0, -1.2]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[1, 0, -1.2]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Headlights */}
      <pointLight position={[0.8, 0.5, 2.1]} intensity={2} color="#ffff00" distance={10} />
      <pointLight position={[-0.8, 0.5, 2.1]} intensity={2} color="#ffff00" distance={10} />
    </group>
  );
}

function Road() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[50, 100]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      
      {/* Road lines */}
      {[...Array(10)].map((_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.48, -10 + i * 10]}>
          <planeGeometry args={[0.3, 3]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}
    </>
  );
}

export function CarAnimation({ isLoggingIn }: { isLoggingIn: boolean }) {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-40">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[8, 5, 10]} />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
        
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-10, 10, -10]} intensity={0.5} color="#4a90e2" />
        
        <Car isLoggingIn={isLoggingIn} />
        <Road />
        
        <fog attach="fog" args={["#0a0a0a", 10, 50]} />
      </Canvas>
    </div>
  );
}
