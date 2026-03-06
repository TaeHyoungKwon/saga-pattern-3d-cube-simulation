import { Html } from '@react-three/drei'
import { useStore } from '../../store/useStore'
import { getPatternById } from '../../data/patterns'

type AxisLabel = {
  position: [number, number, number]
  text: string
  color: string
  // which pattern property value this label represents
  matchValue: string
}

const labels: AxisLabel[] = [
  // X axis - Communication
  { position: [-1.5, 0, 0], text: 'Sync', color: '#60A5FA', matchValue: 'sync' },
  { position: [1.5, 0, 0], text: 'Async', color: '#60A5FA', matchValue: 'async' },
  // Y axis - Consistency
  { position: [0, -1.5, 0], text: 'Atomic', color: '#34D399', matchValue: 'atomic' },
  { position: [0, 1.5, 0], text: 'Eventual', color: '#34D399', matchValue: 'eventual' },
  // Z axis - Coordination
  { position: [0, 0, -1.5], text: 'Orchestration', color: '#A78BFA', matchValue: 'orchestration' },
  { position: [0, 0, 1.5], text: 'Choreography', color: '#A78BFA', matchValue: 'choreography' },
]

export default function AxisLabels() {
  const selectedId = useStore((s) => s.selectedPatternId)
  const pattern = selectedId ? getPatternById(selectedId) : null

  // Which values are active for the selected pattern
  const activeValues = pattern
    ? new Set<string>([pattern.communication, pattern.consistency, pattern.coordination])
    : null

  return (
    <group>
      {labels.map((label) => {
        const isHighlighted = activeValues?.has(label.matchValue) ?? false
        const isDimmed = activeValues !== null && !isHighlighted

        return (
          <Html
            key={label.text}
            position={label.position}
            distanceFactor={8}
            style={{
              pointerEvents: 'none',
              transition: 'opacity 0.3s, transform 0.3s',
            }}
          >
            <span
              className="whitespace-nowrap"
              style={{
                color: label.color,
                opacity: isHighlighted ? 1 : isDimmed ? 0.2 : 0.7,
                fontSize: isHighlighted ? '14px' : '11px',
                fontWeight: isHighlighted ? 800 : 500,
                textShadow: isHighlighted
                  ? `0 0 12px ${label.color}80, 0 0 4px ${label.color}40`
                  : 'none',
                transition: 'all 0.3s',
              }}
            >
              {label.text}
            </span>
          </Html>
        )
      })}
    </group>
  )
}
