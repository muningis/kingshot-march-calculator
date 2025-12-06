import type { Player } from '@/modules/players'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ArrowUp, ArrowDown, X } from 'lucide-react'

interface PlayerListItemProps {
  player: Player
  index: number
  isFirst: boolean
  isLast: boolean
  isEditing: boolean
  isEditingName: boolean
  editingValue: string
  editingNameValue: string
  onEditStart: () => void
  onEditStartName: () => void
  onEditChange: (value: string) => void
  onEditChangeName: (value: string) => void
  onEditSave: () => void
  onEditSaveName: () => void
  onEditCancel: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onRemove: () => void
}

export function PlayerListItem({
  player,
  index,
  isFirst,
  isLast,
  isEditing,
  isEditingName,
  editingValue,
  editingNameValue,
  onEditStart,
  onEditStartName,
  onEditChange,
  onEditChangeName,
  onEditSave,
  onEditSaveName,
  onEditCancel,
  onMoveUp,
  onMoveDown,
  onRemove
}: PlayerListItemProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onEditSave()
    } else if (e.key === 'Escape') {
      onEditCancel()
    }
  }

  return (
    <div className="flex justify-between items-center p-3 bg-white border border-slate-200 rounded-lg hover:shadow-md transition-all">
      <div className="flex gap-3 items-center flex-1">
        <span className="font-bold text-slate-600 min-w-[1.5rem]">
          {index + 1}.
        </span>
        {isEditingName ? (
          <Input
            type="text"
            value={editingNameValue}
            onChange={(e) => onEditChangeName(e.target.value)}
            onBlur={onEditSaveName}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onEditSaveName()
              else if (e.key === 'Escape') onEditCancel()
            }}
            className="flex-1 h-8 text-sm"
            autoFocus
          />
        ) : (
          <span
            className="font-medium text-slate-900 flex-1 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={onEditStartName}
          >
            {player.name}
          </span>
        )}
        {isEditing ? (
          <Input
            type="number"
            value={editingValue}
            onChange={(e) => onEditChange(e.target.value)}
            onBlur={onEditSave}
            onKeyDown={handleKeyDown}
            className="w-20 h-8 text-sm"
            min="1"
            autoFocus
          />
        ) : (
          <Badge
            className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200 cursor-pointer transition-colors"
            onClick={onEditStart}
          >
            {player.marchTime}sec
          </Badge>
        )}
      </div>
      <div className="flex gap-1 ml-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMoveUp}
          disabled={isFirst}
          className="h-8 w-8"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onMoveDown}
          disabled={isLast}
          className="h-8 w-8"
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          onClick={onRemove}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
