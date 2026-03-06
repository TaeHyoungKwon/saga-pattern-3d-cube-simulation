import { useEffect, useRef, useState, useCallback } from 'react'
import mermaid from 'mermaid'
import { useStore } from '../../store/useStore'
import { scenarios } from '../../data/scenarios'
import { generateMermaidDiagram } from '../../utils/mermaid'
import type { ViewMode } from '../../types'

function initMermaid(isDark: boolean) {
  mermaid.initialize({
    startOnLoad: false,
    theme: isDark ? 'dark' : 'default',
    securityLevel: 'strict',
    sequence: {
      actorMargin: 30,
      messageFontSize: 12,
      actorFontSize: 13,
    },
    themeVariables: isDark
      ? {
          primaryColor: '#1E293B',
          primaryTextColor: '#E2E8F0',
          primaryBorderColor: '#475569',
          lineColor: '#64748B',
          secondaryColor: '#1E293B',
          tertiaryColor: '#0F172A',
        }
      : {
          primaryColor: '#FFFFFF',
          primaryTextColor: '#1E293B',
          primaryBorderColor: '#CBD5E1',
          lineColor: '#94A3B8',
          secondaryColor: '#F1F5F9',
          tertiaryColor: '#F8FAFC',
        },
  })
}

const viewModes: { key: ViewMode; label: string }[] = [
  { key: 'happy', label: 'Happy Path' },
  { key: 'failure', label: 'Failure' },
  { key: 'combined', label: 'Combined' },
]

export default function SequenceDiagram({ patternId }: { patternId: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [svgHtml, setSvgHtml] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [zoom, setZoom] = useState(100)
  const fullscreen = useStore((s) => s.diagramFullscreen)
  const setFullscreen = useStore((s) => s.setDiagramFullscreen)
  const viewMode = useStore((s) => s.viewMode)
  const setViewMode = useStore((s) => s.setViewMode)
  const failurePoint = useStore((s) => s.failurePoint)
  const theme = useStore((s) => s.theme)

  const scenario = scenarios[patternId]

  // ESC key to close fullscreen
  useEffect(() => {
    if (!fullscreen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFullscreen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [fullscreen])

  // Lock body scroll in fullscreen
  useEffect(() => {
    if (fullscreen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [fullscreen])

  useEffect(() => {
    if (!scenario) return

    let cancelled = false
    const isDark = theme === 'dark'
    initMermaid(isDark)

    const diagramDef = generateMermaidDiagram(scenario, viewMode, failurePoint)

    const tempEl = document.createElement('div')
    tempEl.style.position = 'absolute'
    tempEl.style.left = '-9999px'
    tempEl.style.top = '-9999px'
    const preEl = document.createElement('pre')
    preEl.className = 'mermaid'
    preEl.textContent = diagramDef
    tempEl.appendChild(preEl)
    document.body.appendChild(tempEl)

    mermaid
      .run({ nodes: [preEl] })
      .then(() => {
        if (!cancelled) {
          setSvgHtml(preEl.innerHTML)
          setError(null)
        }
      })
      .catch((e) => {
        if (!cancelled) {
          console.error('Mermaid error:', e)
          setError(String(e))
        }
      })
      .finally(() => {
        tempEl.remove()
      })

    return () => {
      cancelled = true
    }
  }, [scenario, viewMode, failurePoint, theme])

  const openFullscreen = useCallback(() => setFullscreen(true), [])
  const closeFullscreen = useCallback(() => setFullscreen(false), [])

  if (!scenario) return null

  const zoomControls = (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setZoom((z) => Math.max(50, z - 25))}
        className="w-7 h-7 flex items-center justify-center rounded bg-slate-200 text-slate-600 hover:bg-slate-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 text-sm font-bold"
      >
        −
      </button>
      <input
        type="range"
        min={50}
        max={250}
        step={10}
        value={zoom}
        onChange={(e) => setZoom(Number(e.target.value))}
        className="flex-1 h-1 accent-saga-flow cursor-pointer"
      />
      <button
        onClick={() => setZoom((z) => Math.min(250, z + 25))}
        className="w-7 h-7 flex items-center justify-center rounded bg-slate-200 text-slate-600 hover:bg-slate-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 text-sm font-bold"
      >
        +
      </button>
      <span className="text-xs text-slate-500 dark:text-gray-400 w-10 text-right">{zoom}%</span>
      <button
        onClick={() => setZoom(100)}
        className="text-xs text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300 ml-1"
      >
        Reset
      </button>
    </div>
  )

  const diagramContent = error ? (
    <p className="text-red-400 text-sm">{error}</p>
  ) : svgHtml ? (
    <div
      ref={containerRef}
      style={{
        transform: `scale(${zoom / 100})`,
        transformOrigin: 'top left',
        width: `${10000 / zoom}%`,
      }}
      className="[&_svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svgHtml }}
    />
  ) : (
    <div className="text-slate-400 dark:text-gray-500 text-sm p-4">Loading diagram...</div>
  )

  const viewModeButtons = (
    <div className="flex rounded-md overflow-hidden border border-slate-300 dark:border-gray-600">
      {viewModes.map((vm) => (
        <button
          key={vm.key}
          onClick={() => setViewMode(vm.key)}
          className={`px-3 py-1 text-xs transition-colors ${
            viewMode === vm.key
              ? 'bg-saga-flow text-white'
              : 'bg-slate-100 text-slate-500 hover:text-slate-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          {vm.label}
        </button>
      ))}
    </div>
  )

  return (
    <>
      {/* Inline view */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-600 dark:text-gray-300">Sequence Diagram</h3>
          <div className="flex items-center gap-2">
            {viewModeButtons}
            <button
              onClick={openFullscreen}
              className="w-7 h-7 flex items-center justify-center rounded bg-slate-200 text-slate-600 hover:bg-slate-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 text-sm"
              title="Fullscreen"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 3 21 3 21 9" />
                <polyline points="9 21 3 21 3 15" />
                <line x1="21" y1="3" x2="14" y2="10" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
            </button>
          </div>
        </div>

        <div
          className="overflow-auto bg-slate-100/50 dark:bg-gray-900/50 rounded-lg p-2"
          style={{ maxHeight: '60vh' }}
        >
          {error ? (
            <p className="text-red-400 text-sm">{error}</p>
          ) : svgHtml ? (
            <div
              className="[&_svg]:max-w-full"
              dangerouslySetInnerHTML={{ __html: svgHtml }}
            />
          ) : (
            <div className="text-slate-400 dark:text-gray-500 text-sm p-4">Loading diagram...</div>
          )}
        </div>
      </div>

      {/* Fullscreen modal */}
      {fullscreen && (
        <div
          className="fixed inset-0 z-50 flex flex-col"
          style={{ background: 'var(--color-overlay)' }}
        >
          {/* Header bar */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 dark:border-gray-700/50">
            <div className="flex items-center gap-4">
              <h2 className="text-base font-semibold text-slate-700 dark:text-gray-200">Sequence Diagram</h2>
              {viewModeButtons}
            </div>
            <div className="flex items-center gap-3">
              {zoomControls}
              <button
                onClick={closeFullscreen}
                className="w-8 h-8 flex items-center justify-center rounded bg-slate-200 text-slate-600 hover:bg-red-100 hover:text-red-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-red-900/50 dark:hover:text-red-300 text-lg transition-colors ml-2"
                title="Close (ESC)"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Diagram area */}
          <div className="flex-1 overflow-auto p-6">
            {diagramContent}
          </div>

          {/* ESC hint */}
          <div className="text-center py-2 text-xs text-slate-400 dark:text-gray-600">
            Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-500 dark:bg-gray-800 dark:text-gray-400 text-[10px]">ESC</kbd> to close
          </div>
        </div>
      )}
    </>
  )
}
