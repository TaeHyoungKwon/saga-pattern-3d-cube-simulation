import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import type { Mesh } from 'three'
import type { SagaPattern } from '../../types'
import { useStore } from '../../store/useStore'

type Props = {
  pattern: SagaPattern
}

export default function PatternNode({ pattern }: Props) {
  const meshRef = useRef<Mesh>(null!)
  const selectPattern = useStore((s) => s.selectPattern)
  const hoverPattern = useStore((s) => s.hoverPattern)
  const selectedId = useStore((s) => s.selectedPatternId)
  const hoveredId = useStore((s) => s.hoveredPatternId)
  const theme = useStore((s) => s.theme)

  const myColor = theme === 'dark' ? '#FFFFFF' : '#1E293B'

  const isSelected = selectedId === pattern.id
  const isHovered = hoveredId === pattern.id
  const hasSelection = selectedId !== null
  const isDimmed = hasSelection && !isSelected && !isHovered

  const isActive = isSelected || isHovered
  const targetScale = isSelected ? 1.8 : isHovered ? 1.4 : isDimmed ? 0.7 : 1.0
  const targetOpacity = isDimmed ? 0.25 : isActive ? 1.0 : 0.7

  const sphereColor = isSelected || isHovered ? myColor : '#9CA3AF'

  useFrame(() => {
    if (meshRef.current) {
      const s = meshRef.current.scale.x
      const next = s + (targetScale - s) * 0.12
      meshRef.current.scale.setScalar(next)

      const mat = meshRef.current.material as any
      if (mat && mat.opacity !== undefined) {
        mat.opacity += (targetOpacity - mat.opacity) * 0.12
      }
    }
  })

  const labelBg = theme === 'dark' ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.7)'

  return (
    <group position={pattern.position}>
      {/* Main sphere */}
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation()
          hoverPattern(pattern.id)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          hoverPattern(null)
          document.body.style.cursor = 'auto'
        }}
        onClick={(e) => {
          e.stopPropagation()
          selectPattern(pattern.id)
        }}
      >
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={sphereColor}
          transparent
          opacity={targetOpacity}
          emissive={isActive ? myColor : '#000000'}
          emissiveIntensity={isSelected ? 0.4 : isHovered ? 0.2 : 0}
        />
      </mesh>

      {/* Label */}
      <Html
        distanceFactor={8}
        style={{
          pointerEvents: 'none',
          transition: 'opacity 0.3s',
          opacity: isDimmed ? 0.15 : 1,
        }}
      >
        <div className="whitespace-nowrap text-center" style={{ transform: 'translateY(-4px)' }}>
          <span
            style={{
              color: myColor,
              fontSize: isSelected ? '13px' : isHovered ? '11px' : '9px',
              fontWeight: isSelected ? 700 : isHovered ? 600 : 500,
              background: isDimmed ? 'transparent' : labelBg,
              padding: '1px 4px',
              borderRadius: '3px',
              opacity: isDimmed ? 0.3 : isActive ? 1 : 0.75,
              textShadow: isSelected ? `0 0 8px ${myColor}60` : 'none',
            }}
          >
            {pattern.name}
          </span>
        </div>
      </Html>
    </group>
  )
}
