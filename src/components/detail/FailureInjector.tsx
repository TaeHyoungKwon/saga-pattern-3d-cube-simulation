import { useStore } from '../../store/useStore'
import type { FailurePoint } from '../../types'

const failureButtons: { key: FailurePoint; label: string; description: string }[] = [
  {
    key: 'payment',
    label: 'Payment',
    description: 'Order → Cancel Order',
  },
  {
    key: 'inventory',
    label: 'Inventory',
    description: 'Payment → Cancel Payment → Cancel Order',
  },
  {
    key: 'shipping',
    label: 'Shipping',
    description: 'Inventory → Release Stock → Cancel Payment → Cancel Order',
  },
]

export default function FailureInjector() {
  const viewMode = useStore((s) => s.viewMode)
  const failurePoint = useStore((s) => s.failurePoint)
  const setFailurePoint = useStore((s) => s.setFailurePoint)

  if (viewMode === 'happy') return null

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-600 dark:text-gray-300">Failure Injection</h3>
      <div className="flex gap-2">
        {failureButtons.map((fb) => (
          <button
            key={fb.key}
            onClick={() => setFailurePoint(fb.key)}
            className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
              failurePoint === fb.key
                ? 'bg-saga-failure/20 border-saga-failure text-saga-failure'
                : 'bg-slate-100 border-slate-300 text-slate-500 hover:text-slate-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            {fb.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-slate-400 dark:text-gray-500">
        Compensation: {failureButtons.find((f) => f.key === failurePoint)?.description}
      </p>
    </div>
  )
}
