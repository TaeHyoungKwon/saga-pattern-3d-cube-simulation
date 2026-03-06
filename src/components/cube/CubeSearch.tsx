import { useState, useRef, useEffect } from 'react'
import { patterns } from '../../data/patterns'
import { useStore } from '../../store/useStore'

export default function CubeSearch() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const selectPattern = useStore((s) => s.selectPattern)
  const inputRef = useRef<HTMLInputElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const filtered = query.trim()
    ? patterns.filter((p) => {
        const q = query.toLowerCase()
        return (
          p.name.toLowerCase().includes(q) ||
          p.communication.includes(q) ||
          p.consistency.includes(q) ||
          p.coordination.includes(q) ||
          p.id.includes(q)
        )
      })
    : patterns

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Keyboard shortcut: / to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault()
        inputRef.current?.focus()
        setOpen(true)
      }
      if (e.key === 'Escape') {
        inputRef.current?.blur()
        setOpen(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div ref={wrapperRef} className="absolute top-3 left-3 z-10 w-56">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search patterns..."
          className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm text-sm text-slate-800 dark:text-gray-200 placeholder-slate-400 dark:placeholder-gray-500 border border-slate-300 dark:border-gray-700 rounded-lg px-3 py-1.5 pr-8 outline-none focus:border-slate-500 dark:focus:border-gray-500"
        />
        <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 dark:text-gray-600 bg-slate-100 dark:bg-gray-800 px-1 py-0.5 rounded">
          /
        </kbd>
      </div>

      {open && (
        <ul className="mt-1 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-slate-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-xl max-h-64 overflow-y-auto">
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-xs text-slate-400 dark:text-gray-500">No results</li>
          ) : (
            filtered.map((p) => (
              <li key={p.id}>
                <button
                  className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => {
                    selectPattern(p.id)
                    setOpen(false)
                    setQuery('')
                  }}
                >
                  <div className="text-sm text-slate-800 dark:text-gray-200">{p.name}</div>
                  <div className="flex gap-1.5 mt-0.5">
                    <span className="text-[10px] text-blue-400">{p.communication}</span>
                    <span className="text-[10px] text-emerald-400">{p.consistency}</span>
                    <span className="text-[10px] text-purple-400">{p.coordination}</span>
                  </div>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
