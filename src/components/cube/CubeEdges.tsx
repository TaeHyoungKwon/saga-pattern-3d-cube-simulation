import { useMemo } from 'react'
import { Line } from '@react-three/drei'
import { useStore } from '../../store/useStore'
import { getPatternById } from '../../data/patterns'

type Edge = {
  start: [number, number, number]
  end: [number, number, number]
  axis: 'x' | 'y' | 'z'
}

// Build all 12 edges of the cube (vertices at +/-1)
const allEdges: Edge[] = []

// X-axis edges (vary x, fixed y,z)
for (const y of [-1, 1]) {
  for (const z of [-1, 1]) {
    allEdges.push({ start: [-1, y, z], end: [1, y, z], axis: 'x' })
  }
}
// Y-axis edges (vary y, fixed x,z)
for (const x of [-1, 1]) {
  for (const z of [-1, 1]) {
    allEdges.push({ start: [x, -1, z], end: [x, 1, z], axis: 'y' })
  }
}
// Z-axis edges (vary z, fixed x,y)
for (const x of [-1, 1]) {
  for (const y of [-1, 1]) {
    allEdges.push({ start: [x, y, -1], end: [x, y, 1], axis: 'z' })
  }
}

function edgeTouchesVertex(edge: Edge, v: [number, number, number]): boolean {
  const [vx, vy, vz] = v
  const { start: s, end: e } = edge
  return (
    (s[0] === vx && s[1] === vy && s[2] === vz) ||
    (e[0] === vx && e[1] === vy && e[2] === vz)
  )
}

export default function CubeEdges() {
  const selectedId = useStore((s) => s.selectedPatternId)
  const theme = useStore((s) => s.theme)
  const pattern = selectedId ? getPatternById(selectedId) : null
  const vertex = pattern?.position ?? null

  const edgeColor = theme === 'dark' ? '#D1D5DB' : '#94A3B8'
  const highlightColor = theme === 'dark' ? '#FFFFFF' : '#1E293B'

  const edgeStates = useMemo(() => {
    return allEdges.map((edge) => {
      const highlighted = vertex !== null && edgeTouchesVertex(edge, vertex as [number, number, number])
      return { ...edge, highlighted }
    })
  }, [vertex])

  const hasSelection = vertex !== null

  return (
    <group>
      {edgeStates.map((edge, i) => (
        <Line
          key={i}
          points={[edge.start, edge.end]}
          color={edge.highlighted ? highlightColor : edgeColor}
          lineWidth={edge.highlighted ? 4 : 1}
          opacity={edge.highlighted ? 1 : hasSelection ? 0.12 : 0.5}
          transparent
        />
      ))}
    </group>
  )
}
