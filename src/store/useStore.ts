import { create } from 'zustand'
import type { ViewMode, FailurePoint } from '../types'

type Theme = 'light' | 'dark'

type AppState = {
  selectedPatternId: string | null
  selectPattern: (id: string | null) => void

  hoveredPatternId: string | null
  hoverPattern: (id: string | null) => void

  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void

  failurePoint: FailurePoint
  setFailurePoint: (point: FailurePoint) => void

  diagramFullscreen: boolean
  setDiagramFullscreen: (v: boolean) => void

  theme: Theme
  toggleTheme: () => void
}

function getInitialTheme(): Theme {
  const stored = localStorage.getItem('theme')
  if (stored === 'dark' || stored === 'light') return stored
  return 'light'
}

export const useStore = create<AppState>((set) => ({
  selectedPatternId: null,
  selectPattern: (id) =>
    set({ selectedPatternId: id, viewMode: 'happy', failurePoint: 'payment' }),

  hoveredPatternId: null,
  hoverPattern: (id) => set({ hoveredPatternId: id }),

  viewMode: 'happy',
  setViewMode: (mode) => set({ viewMode: mode }),

  failurePoint: 'payment',
  setFailurePoint: (point) => set({ failurePoint: point }),

  diagramFullscreen: false,
  setDiagramFullscreen: (v) => set({ diagramFullscreen: v }),

  theme: getInitialTheme(),
  toggleTheme: () =>
    set((state) => {
      const next = state.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', next)
      return { theme: next }
    }),
}))
