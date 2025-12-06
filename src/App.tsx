import { useEffect } from 'react'
import { useStore } from '@/store'
import { AppHeader } from '@/components/structures/AppHeader'
import { PlayerList } from '@/components/structures/PlayerList'
import { ResultsTable } from '@/components/structures/ResultsTable'
import { CalculatorLayout } from '@/components/templates/CalculatorLayout'

function App() {
  const players = useStore((state) => state.players)
  const autoUpdate = useStore((state) => state.autoUpdate)
  const calculateResults = useStore((state) => state.calculateResults)

  // Auto-calculate when players change and auto-update is enabled
  useEffect(() => {
    if (autoUpdate && players.length > 0) {
      calculateResults()
    }
  }, [players, autoUpdate, calculateResults])

  return (
    <div className="max-w-7xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      <AppHeader />
      <CalculatorLayout
        leftPanel={<PlayerList />}
        rightPanel={<ResultsTable />}
      />
    </div>
  )
}

export default App
