import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Globe() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const wireRef = useRef<THREE.LineSegments>(null!)
  const dotsRef = useRef<THREE.Points>(null!)

  // Create dots on sphere surface
  const dotPositions = useMemo(() => {
    const positions = new Float32Array(200 * 3)
    for (let i = 0; i < 200; i++) {
      const phi = Math.acos(2 * Math.random() - 1)
      const theta = Math.random() * Math.PI * 2
      const r = 1.5
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
    }
    return positions
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (wireRef.current) {
      wireRef.current.rotation.y = t * 0.1
      wireRef.current.rotation.x = Math.sin(t * 0.05) * 0.1
    }
    if (dotsRef.current) {
      dotsRef.current.rotation.y = t * 0.1
      dotsRef.current.rotation.x = Math.sin(t * 0.05) * 0.1
    }
  })

  return (
    <group>
      {/* Wireframe globe */}
      <lineSegments ref={wireRef}>
        <edgesGeometry args={[new THREE.IcosahedronGeometry(1.5, 2)]} />
        <lineBasicMaterial color="#00aaaa" transparent opacity={0.15} />
      </lineSegments>
      
      {/* Dots on surface */}
      <points ref={dotsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={200}
            array={dotPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          color="#00dddd"
          transparent
          opacity={0.7}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.7, 1.75, 64]} />
        <meshBasicMaterial color="#00aaaa" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

export default function GlobeScene({ className = '' }: { className?: string }) {
  return (
    <div className={`${className}`}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={0.5} color="#00cccc" />
        <Globe />
      </Canvas>
    </div>
  )
}
