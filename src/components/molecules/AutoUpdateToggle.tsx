import { Switch } from '@/components/ui/switch'

interface AutoUpdateToggleProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export function AutoUpdateToggle({ checked, onCheckedChange }: AutoUpdateToggleProps) {
  return (
    <div className="flex items-center gap-3">
      <Switch
        id="auto-update"
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
      <label
        htmlFor="auto-update"
        className="text-sm font-medium text-slate-700 cursor-pointer"
      >
        Auto Update
      </label>
    </div>
  )
}
