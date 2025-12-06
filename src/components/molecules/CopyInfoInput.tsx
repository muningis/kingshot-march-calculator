import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'

interface CopyInfoInputProps {
  onCopy: (baseTime: string) => void
  disabled: boolean
}

export function CopyInfoInput({ onCopy, disabled }: CopyInfoInputProps) {
  const [baseTime, setBaseTime] = useState('')
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (baseTime.trim()) {
      onCopy(baseTime.trim())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !disabled && baseTime.trim()) {
      handleCopy()
    }
  }

  return (
    <div className="flex gap-2">
      <Input
        type="text"
        placeholder="Base time (HH:MM:SS)"
        value={baseTime}
        onChange={(e) => setBaseTime(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className="flex-1"
      />
      <Button
        onClick={handleCopy}
        disabled={disabled || !baseTime.trim()}
        variant="secondary"
        className="min-w-[100px]"
      >
        {copied ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </>
        )}
      </Button>
    </div>
  )
}
