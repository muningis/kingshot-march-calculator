import type { ArrivalMode } from '@/modules/calculator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

interface ArrivalModeSelectProps {
  value: ArrivalMode
  onValueChange: (value: ArrivalMode) => void
}

export function ArrivalModeSelect({ value, onValueChange }: ArrivalModeSelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor="arrival-mode"
        className="text-sm font-medium text-slate-700"
      >
        Arrival timing
      </label>
      <Select
        value={value}
        onValueChange={(v) => onValueChange(v as ArrivalMode)}
      >
        <SelectTrigger id="arrival-mode" className="w-[200px] bg-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="sequential">Second after second</SelectItem>
          <SelectItem value="simultaneous">At same second</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
