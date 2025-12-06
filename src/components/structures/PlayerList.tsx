import { useRef, useState } from 'react'
import { useStore } from '@/store'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calculator, Plus } from 'lucide-react'
import { PlayerListItem } from '@/components/molecules/PlayerListItem'
import { AutoUpdateToggle } from '@/components/molecules/AutoUpdateToggle'

export function PlayerList() {
  const players = useStore((state) => state.players)
  const addPlayer = useStore((state) => state.addPlayer)
  const removePlayer = useStore((state) => state.removePlayer)
  const movePlayer = useStore((state) => state.movePlayer)
  const updatePlayerMarchTime = useStore((state) => state.updatePlayerMarchTime)
  const updatePlayerName = useStore((state) => state.updatePlayerName)
  const editingPlayerId = useStore((state) => state.editingPlayerId)
  const editingMarchTime = useStore((state) => state.editingMarchTime)
  const editingPlayerName = useStore((state) => state.editingPlayerName)
  const startEditing = useStore((state) => state.startEditing)
  const startEditingName = useStore((state) => state.startEditingName)
  const stopEditing = useStore((state) => state.stopEditing)
  const setEditingMarchTime = useStore((state) => state.setEditingMarchTime)
  const setEditingPlayerName = useStore((state) => state.setEditingPlayerName)
  const autoUpdate = useStore((state) => state.autoUpdate)
  const toggleAutoUpdate = useStore((state) => state.toggleAutoUpdate)
  const calculateResults = useStore((state) => state.calculateResults)
  const clearResults = useStore((state) => state.clearResults)

  const playerNameInputRef = useRef<HTMLInputElement>(null)
  const [playerName, setPlayerName] = useState('')
  const [marchTime, setMarchTime] = useState('')

  const handleAddPlayer = () => {
    if (playerName.trim() && marchTime && parseInt(marchTime) > 0) {
      addPlayer(playerName.trim(), parseInt(marchTime))
      setPlayerName('')
      setMarchTime('')
      if (!autoUpdate) {
        clearResults()
      }
      playerNameInputRef.current?.focus()
    }
  }

  const handleAddKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && playerName.trim() && marchTime && parseInt(marchTime) > 0) {
      handleAddPlayer()
    }
  }

  const handleRemovePlayer = (id: number) => {
    removePlayer(id)
    if (!autoUpdate) {
      clearResults()
    }
  }

  const handleMovePlayer = (index: number, direction: 'up' | 'down') => {
    movePlayer(index, direction)
    if (!autoUpdate) {
      clearResults()
    }
  }

  const handleSaveMarchTime = (playerId: number) => {
    const newValue = parseInt(editingMarchTime)
    if (newValue > 0) {
      updatePlayerMarchTime(playerId, newValue)
      if (!autoUpdate) {
        clearResults()
      }
    }
    stopEditing()
  }

  const handleSavePlayerName = (playerId: number) => {
    const newValue = editingPlayerName.trim()
    if (newValue) {
      updatePlayerName(playerId, newValue)
      if (!autoUpdate) {
        clearResults()
      }
    }
    stopEditing()
  }

  return (
    <Card className="bg-slate-50">
      <CardHeader>
        <CardTitle className="text-2xl">Add Players</CardTitle>
        <CardDescription>Enter player details to add them to the march order</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-lg font-medium text-slate-700 mb-3">Players (Arrival Order)</h3>
          <div className="space-y-2">
            {players.map((player, index) => (
                <PlayerListItem
                  key={player.id}
                  player={player}
                  index={index}
                  isFirst={index === 0}
                  isLast={index === players.length - 1}
                  isEditing={editingPlayerId === player.id && editingMarchTime !== ''}
                  isEditingName={editingPlayerId === player.id && editingPlayerName !== ''}
                  editingValue={editingMarchTime}
                  editingNameValue={editingPlayerName}
                  onEditStart={() => startEditing(player.id, player.marchTime)}
                  onEditStartName={() => startEditingName(player.id, player.name)}
                  onEditChange={setEditingMarchTime}
                  onEditChangeName={setEditingPlayerName}
                  onEditSave={() => handleSaveMarchTime(player.id)}
                  onEditSaveName={() => handleSavePlayerName(player.id)}
                  onEditCancel={stopEditing}
                  onMoveUp={() => handleMovePlayer(index, 'up')}
                  onMoveDown={() => handleMovePlayer(index, 'down')}
                  onRemove={() => handleRemovePlayer(player.id)}
                />
              ))}

            {/* Add Player Form Row */}
            <div className="flex justify-between items-center p-3 bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg">
              <div className="flex gap-3 items-center flex-1">
                <span className="font-bold text-slate-400 min-w-[1.5rem]">+</span>
                <Input
                  ref={playerNameInputRef}
                  type="text"
                  placeholder="Player name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  onKeyDown={handleAddKeyDown}
                  className="flex-1"
                />
                <Input
                  type="number"
                  placeholder="March time"
                  value={marchTime}
                  onChange={(e) => setMarchTime(e.target.value)}
                  onKeyDown={handleAddKeyDown}
                  className="w-24"
                  min="1"
                />
              </div>
              <Button
                onClick={handleAddPlayer}
                disabled={!playerName.trim() || !marchTime || parseInt(marchTime) <= 0}
                size="icon"
                className="h-8 w-8 ml-2"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg">
          <AutoUpdateToggle
            checked={autoUpdate}
            onCheckedChange={toggleAutoUpdate}
          />
          <Button
            onClick={calculateResults}
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
  )
}
