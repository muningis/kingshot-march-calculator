import { useState, useRef, useEffect, useCallback } from 'react'
import { Player, Result, MoveDirection } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { ArrowUp, ArrowDown, X, Calculator } from 'lucide-react'

function App() {
  const [players, setPlayers] = useState<Player[]>([])
  const [playerName, setPlayerName] = useState<string>('')
  const [marchTime, setMarchTime] = useState<string>('')
  const [results, setResults] = useState<Result[] | null>(null)
  const [editingPlayerId, setEditingPlayerId] = useState<number | null>(null)
  const [editingMarchTime, setEditingMarchTime] = useState<string>('')
  const [autoUpdate, setAutoUpdate] = useState<boolean>(() => {
    const saved = localStorage.getItem('autoUpdate')
    return saved ? JSON.parse(saved) : false
  })
  const playerNameInputRef = useRef<HTMLInputElement>(null)

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const calculateStartTimes = useCallback(() => {
    if (players.length === 0) return

    const minArrivalTime = Math.max(...players.map((p, i) => p.marchTime - i))

    const calculated = players.map((player, index) => {
      const arrivalTime = minArrivalTime + index
      const startTime = arrivalTime - player.marchTime
      return {
        name: player.name,
        marchTime: player.marchTime,
        startTime: startTime,
        arrivalTime: arrivalTime,
        order: index + 1
      }
    })

    const sorted = [...calculated].sort((a, b) => a.startTime - b.startTime)
    setResults(sorted)
  }, [players])

  // Auto-calculate when players change and auto-update is enabled
  useEffect(() => {
    if (autoUpdate && players.length > 0) {
      calculateStartTimes()
    }
  }, [players, autoUpdate, calculateStartTimes])

  // Persist auto-update preference to localStorage
  useEffect(() => {
    localStorage.setItem('autoUpdate', JSON.stringify(autoUpdate))
  }, [autoUpdate])

  const addPlayer = (e: React.FormEvent) => {
    e.preventDefault()
    if (playerName.trim() && marchTime && parseInt(marchTime) > 0) {
      setPlayers([...players, {
        id: Date.now(),
        name: playerName.trim(),
        marchTime: parseInt(marchTime)
      }])
      setPlayerName('')
      setMarchTime('')
      if (!autoUpdate) {
        setResults(null)
      }
      // Focus back to player name input for quick entry
      playerNameInputRef.current?.focus()
    }
  }

  const removePlayer = (id: number) => {
    setPlayers(players.filter(p => p.id !== id))
    if (!autoUpdate) {
      setResults(null)
    }
  }

  const movePlayer = (index: number, direction: MoveDirection) => {
    const newPlayers = [...players]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex >= 0 && newIndex < players.length) {
      [newPlayers[index], newPlayers[newIndex]] = [newPlayers[newIndex], newPlayers[index]]
      setPlayers(newPlayers)
      if (!autoUpdate) {
        setResults(null)
      }
    }
  }

  const startEditingMarchTime = (playerId: number, currentMarchTime: number) => {
    setEditingPlayerId(playerId)
    setEditingMarchTime(String(currentMarchTime))
  }

  const saveMarchTime = (playerId: number) => {
    const newValue = parseInt(editingMarchTime)
    if (newValue > 0) {
      setPlayers(players.map(p =>
        p.id === playerId ? { ...p, marchTime: newValue } : p
      ))
      if (!autoUpdate) {
        setResults(null)
      }
    }
    setEditingPlayerId(null)
    setEditingMarchTime('')
  }

  const cancelEditingMarchTime = () => {
    setEditingPlayerId(null)
    setEditingMarchTime('')
  }

  const handleMarchTimeKeyDown = (e: React.KeyboardEvent, playerId: number) => {
    if (e.key === 'Enter') {
      saveMarchTime(playerId)
    } else if (e.key === 'Escape') {
      cancelEditingMarchTime()
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">March Time Calculator</h1>
        <p className="text-slate-600">
          Add players in the order they should arrive at their destination.
          Each player will arrive 1 second after the previous one.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* Input Section */}
        <Card className="bg-slate-50">
          <CardHeader>
            <CardTitle className="text-2xl">Add Players</CardTitle>
            <CardDescription>Enter player details to add them to the march order</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={addPlayer} className="space-y-4 mb-6">
              <Input
                ref={playerNameInputRef}
                type="text"
                placeholder="Player name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
              />
              <Input
                type="number"
                placeholder="March time (seconds)"
                value={marchTime}
                onChange={(e) => setMarchTime(e.target.value)}
                min="1"
              />
              <Button type="submit" className="w-full">
                Add Player
              </Button>
            </form>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-slate-700 mb-3">Players (Arrival Order)</h3>
              {players.length === 0 ? (
                <p className="text-slate-400 text-center py-8 italic">No players added yet</p>
              ) : (
                <div className="space-y-2">
                  {players.map((player, index) => (
                    <div
                      key={player.id}
                      className="flex justify-between items-center p-3 bg-white border border-slate-200 rounded-lg hover:shadow-md transition-all"
                    >
                      <div className="flex gap-3 items-center flex-1">
                        <span className="font-bold text-slate-600 min-w-[1.5rem]">
                          {index + 1}.
                        </span>
                        <span className="font-medium text-slate-900 flex-1">
                          {player.name}
                        </span>
                        {editingPlayerId === player.id ? (
                          <Input
                            type="number"
                            value={editingMarchTime}
                            onChange={(e) => setEditingMarchTime(e.target.value)}
                            onBlur={() => saveMarchTime(player.id)}
                            onKeyDown={(e) => handleMarchTimeKeyDown(e, player.id)}
                            className="w-20 h-8 text-sm"
                            min="1"
                            autoFocus
                          />
                        ) : (
                          <Badge
                            className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200 cursor-pointer transition-colors"
                            onClick={() => startEditingMarchTime(player.id, player.marchTime)}
                          >
                            {player.marchTime}sec
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-1 ml-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => movePlayer(index, 'up')}
                          disabled={index === 0}
                          className="h-8 w-8"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => movePlayer(index, 'down')}
                          disabled={index === players.length - 1}
                          className="h-8 w-8"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => removePlayer(player.id)}
                          className="h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Switch
                  id="auto-update"
                  checked={autoUpdate}
                  onCheckedChange={setAutoUpdate}
                />
                <label
                  htmlFor="auto-update"
                  className="text-sm font-medium text-slate-700 cursor-pointer"
                >
                  Auto Update
                </label>
              </div>
              <Button
                onClick={calculateStartTimes}
                disabled={players.length === 0 || autoUpdate}
                size="default"
                variant="secondary"
              >
                <Calculator className="mr-2 h-4 w-4" />
                Calculate
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card className="bg-slate-50">
          <CardHeader>
            <CardTitle className="text-2xl">Results</CardTitle>
            <CardDescription>
              {autoUpdate ? 'Automatically updated' : 'Start times for each player'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!results ? (
              <p className="text-slate-400 text-center py-8 italic">
                Click "Calculate Start Times" to see results
              </p>
            ) : (
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <div className="grid grid-cols-4 gap-4 p-4 bg-indigo-600 text-white font-semibold text-sm">
                  <span>Start Order</span>
                  <span>Player</span>
                  <span>Start Time</span>
                  <span>Arrival Time</span>
                </div>
                {results.map((result, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-4 gap-4 p-4 border-b border-slate-200 hover:bg-slate-50 transition-colors last:border-b-0"
                  >
                    <span className="font-bold text-slate-600">{index + 1}.</span>
                    <span className="font-medium text-slate-900">{result.name}</span>
                    <span className="font-mono text-sm font-medium text-blue-600">
                      {formatTime(result.startTime)}
                    </span>
                    <span className="font-mono text-sm font-medium text-emerald-600">
                      {formatTime(result.arrivalTime)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App
