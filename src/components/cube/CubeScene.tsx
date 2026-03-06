import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import CubeEdges from './CubeEdges'
import AxisLabels from './AxisLabels'
import PatternNode from './PatternNode'
import { patterns } from '../../data/patterns'
import { useStore } from '../../store/useStore'

export default function CubeScene() {
  const selectPattern = useStore((s) => s.selectPattern)
  const theme = useStore((s) => s.theme)

  return (
    <Canvas
      camera={{ position: [4, 3, 4], fov: 50 }}
      onPointerMissed={() => selectPattern(null)}
      style={{ background: theme === 'dark' ? '#0F172A' : '#F8FAFC' }}
    >
      <ambientLight intensity={theme === 'dark' ? 0.5 : 0.7} />
      <pointLight position={[10, 10, 10]} intensity={theme === 'dark' ? 0.8 : 1.0} />
      <OrbitControls enableDamping dampingFactor={0.05} />
      <CubeEdges />
      <AxisLabels />
      {patterns.map((p) => (
        <PatternNode key={p.id} pattern={p} />
      ))}
    </Canvas>
  )
}
