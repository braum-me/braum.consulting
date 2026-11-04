'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import * as THREE from 'three'

/* Deterministischer PRNG (mulberry32) auf Modulebene — Mutation außerhalb
   des Render-Scopes, damit das Partikelfeld stabil und „pure" bleibt. */
function makeRng(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function Particles({ count = 480 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null)
  const reduce = useReducedMotion()

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const rng = makeRng(0x9e3779b9)

    for (let i = 0; i < count; i++) {
      // Radius bewusst kleiner als der Kamera-Abstand (z=7), damit die
      // y-Rotation keine Partikel nah an die Kamera schwenkt → sonst
      // entstehen vereinzelt „Riesen-Pixel" durch sizeAttenuation.
      pos[i * 3]     = (rng() - 0.5) * 8
      pos[i * 3 + 1] = (rng() - 0.5) * 6
      pos[i * 3 + 2] = (rng() - 0.5) * 4

      const isAccent = rng() > 0.78
      col[i * 3]     = isAccent ? 0.78 : 0.95
      col[i * 3 + 1] = isAccent ? 0.38 : 0.94
      col[i * 3 + 2] = isAccent ? 0.16 : 0.92
    }
    return [pos, col]
  }, [count])

  useFrame((state) => {
    if (!mesh.current || reduce) return
    mesh.current.rotation.y = state.clock.elapsedTime * 0.015
    mesh.current.rotation.x = state.clock.elapsedTime * 0.005
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.007}
        vertexColors
        transparent
        opacity={0.55}
        sizeAttenuation
      />
    </points>
  )
}

export default function HeroParticles() {
  // WebGL/Three.js rendert pro Frame (rAF) — auf Mobile teuer (Akku + Jank),
  // und der Hero hat dort ohnehin einen eigenen Brand-Glow. Partikel daher nur
  // auf Desktop mit Maus rendern.
  const [show, setShow] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px) and (pointer: fine)')
    const apply = () => setShow(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  if (!show) return null

  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none z-[1]">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 60 }}
        gl={{ antialias: false, alpha: true }}
        dpr={[1, 1.5]}
      >
        <Particles />
      </Canvas>
    </div>
  )
}
