const axisLegend = [
  { axis: 'X', label: 'Communication', values: 'Sync / Async', color: 'bg-blue-400' },
  { axis: 'Y', label: 'Consistency', values: 'Atomic / Eventual', color: 'bg-emerald-400' },
  { axis: 'Z', label: 'Coordination', values: 'Orchestration / Choreography', color: 'bg-purple-400' },
]

const colorLegend = [
  { label: 'Normal', color: 'bg-saga-default' },
  { label: 'Selected', color: 'bg-saga-selected' },
  { label: 'Compensation', color: 'bg-saga-compensation' },
  { label: 'Failure', color: 'bg-saga-failure' },
]

export default function Legend() {
  return (
    <footer className="flex flex-wrap items-center gap-x-6 gap-y-1 px-6 py-2 border-t border-slate-200 dark:border-gray-700/50 text-xs text-slate-500 dark:text-gray-400">
      {axisLegend.map((a) => (
        <div key={a.axis} className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${a.color}`} />
          <span className="text-slate-700 dark:text-gray-300 font-medium">{a.axis}:</span>
          <span>{a.values}</span>
        </div>
      ))}
      <span className="text-slate-300 dark:text-gray-600">|</span>
      {colorLegend.map((c) => (
        <div key={c.label} className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${c.color}`} />
          <span>{c.label}</span>
        </div>
      ))}
    </footer>
  )
}
