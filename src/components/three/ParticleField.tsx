import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Particles({ count = 500 }) {
  const mesh = useRef<THREE.Points>(null!)
  
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20
      
      // Teal to purple gradient for light theme
      const t = Math.random()
      colors[i * 3] = 0.0 + t * 0.4     // R
      colors[i * 3 + 1] = 0.6 - t * 0.2  // G
      colors[i * 3 + 2] = 0.6 + t * 0.2   // B
    }
    
    return [positions, colors]
  }, [count])

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = state.clock.elapsedTime * 0.02
      mesh.current.rotation.y = state.clock.elapsedTime * 0.03
    }
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

function FloatingOrbs() {
  const group = useRef<THREE.Group>(null!)
  
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <group ref={group}>
      {[...Array(5)].map((_, i) => {
        const angle = (i / 5) * Math.PI * 2
        const radius = 3 + Math.random() * 2
        return (
          <mesh key={i} position={[Math.cos(angle) * radius, Math.sin(angle * 0.5) * 1.5, Math.sin(angle) * radius]}>
            <sphereGeometry args={[0.08 + Math.random() * 0.05, 16, 16]} />
            <meshBasicMaterial color={i % 2 === 0 ? '#00cccc' : '#8855cc'} transparent opacity={0.6} />
          </mesh>
        )
      })}
    </group>
  )
}

export default function ParticleField({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: false }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.2} />
        <Particles count={400} />
        <FloatingOrbs />
      </Canvas>
    </div>
  )
}
