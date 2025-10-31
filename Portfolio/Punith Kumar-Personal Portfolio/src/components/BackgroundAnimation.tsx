import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const FloatingShape = ({ position, color, speed }: { position: [number, number, number], color: string, speed: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01 * speed;
      meshRef.current.rotation.y += 0.01 * speed;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <octahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial color={color} wireframe opacity={0.3} transparent />
    </mesh>
  );
};

const ParticleField = () => {
  const particlesRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  const particleCount = 100;
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="hsl(var(--primary))" transparent opacity={0.6} />
    </points>
  );
};

const BackgroundAnimation = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <ParticleField />
        
        <FloatingShape position={[-3, 2, -2]} color="hsl(var(--primary))" speed={0.5} />
        <FloatingShape position={[3, -2, -3]} color="hsl(var(--accent))" speed={0.7} />
        <FloatingShape position={[0, 3, -4]} color="hsl(var(--secondary))" speed={0.6} />
        <FloatingShape position={[-4, -3, -2]} color="hsl(var(--primary))" speed={0.4} />
        <FloatingShape position={[4, 1, -5]} color="hsl(var(--accent))" speed={0.8} />
      </Canvas>
    </div>
  );
};

export default BackgroundAnimation;
