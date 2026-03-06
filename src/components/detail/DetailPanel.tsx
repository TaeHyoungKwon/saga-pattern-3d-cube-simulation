import { useStore } from '../../store/useStore'
import { getPatternById } from '../../data/patterns'
import PatternInfo from './PatternInfo'
import SequenceDiagram from './SequenceDiagram'
import FailureInjector from './FailureInjector'

export default function DetailPanel() {
  const selectedPatternId = useStore((s) => s.selectedPatternId)
  const pattern = selectedPatternId ? getPatternById(selectedPatternId) : null

  if (!pattern) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-gray-500 px-8 text-center">
        <div className="text-4xl mb-4 opacity-30">&#9632;</div>
        <p className="text-sm">Click a pattern node on the cube to view details</p>
        <p className="text-xs mt-2 text-slate-300 dark:text-gray-600">
          Drag to rotate &middot; Scroll to zoom
        </p>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto p-4 space-y-6">
      <PatternInfo pattern={pattern} />
      <SequenceDiagram patternId={pattern.id} />
      <FailureInjector />
    </div>
  )
}
