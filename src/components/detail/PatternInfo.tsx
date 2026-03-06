import type { SagaPattern } from '../../types'

const commBadge: Record<string, string> = {
  sync: 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700',
  async: 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700',
}

const consBadge: Record<string, string> = {
  atomic: 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-700',
  eventual: 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-700',
}

const coordBadge: Record<string, string> = {
  orchestration: 'bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-700',
  choreography: 'bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-700',
}

const gradeBadge: Record<string, string> = {
  low: 'text-green-600 dark:text-green-400',
  medium: 'text-yellow-600 dark:text-yellow-400',
  high: 'text-red-600 dark:text-red-400',
}

export default function PatternInfo({ pattern }: { pattern: SagaPattern }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800 dark:text-white">{pattern.name}</h2>

      <div className="flex flex-wrap gap-2">
        <span className={`text-xs px-2 py-1 rounded border ${commBadge[pattern.communication]}`}>
          {pattern.communication}
        </span>
        <span className={`text-xs px-2 py-1 rounded border ${consBadge[pattern.consistency]}`}>
          {pattern.consistency}
        </span>
        <span className={`text-xs px-2 py-1 rounded border ${coordBadge[pattern.coordination]}`}>
          {pattern.coordination}
        </span>
      </div>

      <p className="text-sm text-slate-600 dark:text-gray-300">{pattern.description}</p>

      <div>
        <h3 className="text-sm font-semibold text-green-600 dark:text-green-400 mb-1">Advantages</h3>
        <ul className="text-sm text-slate-600 dark:text-gray-300 space-y-0.5">
          {pattern.advantages.map((a, i) => (
            <li key={i} className="flex items-start gap-1.5">
              <span className="text-green-500 mt-0.5">+</span>
              {a}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-1">Disadvantages</h3>
        <ul className="text-sm text-slate-600 dark:text-gray-300 space-y-0.5">
          {pattern.disadvantages.map((d, i) => (
            <li key={i} className="flex items-start gap-1.5">
              <span className="text-red-500 mt-0.5">-</span>
              {d}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-500 dark:text-gray-400 mb-1">Use Cases</h3>
        <ul className="text-sm text-slate-600 dark:text-gray-300 space-y-0.5">
          {pattern.useCases.map((u, i) => (
            <li key={i} className="flex items-start gap-1.5">
              <span className="text-slate-400 dark:text-gray-500 mt-0.5">&bull;</span>
              {u}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-4 text-sm">
        <div>
          <span className="text-slate-400 dark:text-gray-500">Complexity: </span>
          <span className={gradeBadge[pattern.complexity]}>{pattern.complexity}</span>
        </div>
        <div>
          <span className="text-slate-400 dark:text-gray-500">Scalability: </span>
          <span className={gradeBadge[pattern.scalability]}>{pattern.scalability}</span>
        </div>
      </div>
    </div>
  )
}
