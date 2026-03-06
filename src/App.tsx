import { useState, useEffect } from 'react'
import Header from './components/layout/Header'
import Legend from './components/layout/Legend'
import CubeScene from './components/cube/CubeScene'
import CubeSearch from './components/cube/CubeSearch'
import DetailPanel from './components/detail/DetailPanel'
import { useStore } from './store/useStore'

export default function App() {
  const selectedPatternId = useStore((s) => s.selectedPatternId)
  const diagramFullscreen = useStore((s) => s.diagramFullscreen)
  const theme = useStore((s) => s.theme)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Sync dark class on <html>
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  // Auto-open drawer on mobile when pattern selected
  useEffect(() => {
    if (selectedPatternId) setDrawerOpen(true)
  }, [selectedPatternId])

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-saga-bg">
      <Header />
      <main className="flex flex-col lg:flex-row flex-1 min-h-0 relative">
        {/* 3D Cube - hidden when diagram is fullscreen */}
        {!diagramFullscreen && (
          <div className="flex-1 lg:w-[60%] lg:flex-none min-h-0 h-full max-lg:h-1/2 relative">
            <CubeSearch />
            <CubeScene />
          </div>
        )}

        {/* Detail Panel - lg+ side panel */}
        <div className="hidden lg:block lg:w-[40%] h-full border-l border-slate-200 dark:border-gray-700/50 overflow-y-auto">
          <DetailPanel />
        </div>

        {/* Detail Panel - below lg: bottom half or drawer */}
        <div className="lg:hidden h-1/2 border-t border-slate-200 dark:border-gray-700/50 overflow-y-auto hidden md:block">
          <DetailPanel />
        </div>

        {/* Mobile drawer (<md) */}
        <div className="md:hidden">
          {selectedPatternId && (
            <button
              onClick={() => setDrawerOpen(!drawerOpen)}
              className="fixed bottom-12 right-4 z-20 bg-saga-flow text-white px-3 py-2 rounded-lg text-xs shadow-lg"
            >
              {drawerOpen ? 'Close' : 'Details'}
            </button>
          )}
          {drawerOpen && selectedPatternId && (
            <div className="fixed inset-x-0 bottom-9 top-12 z-10 bg-slate-50/95 dark:bg-saga-bg/95 backdrop-blur-sm overflow-y-auto">
              <DetailPanel />
            </div>
          )}
        </div>
      </main>
      <Legend />
    </div>
  )
}
