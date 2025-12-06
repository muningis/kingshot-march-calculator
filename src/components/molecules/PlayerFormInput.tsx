import { useState, useRef, useEffect, type RefObject } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface PlayerFormInputProps {
  onSubmit: (name: string, marchTime: number) => void
  nameInputRef?: RefObject<HTMLInputElement | null>
}

export function PlayerFormInput({ onSubmit, nameInputRef }: PlayerFormInputProps) {
  const [name, setName] = useState('')
  const [marchTime, setMarchTime] = useState('')
  const internalRef = useRef<HTMLInputElement>(null)
  const inputRef = nameInputRef || internalRef

  useEffect(() => {
    inputRef.current?.focus()
  }, [inputRef])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && marchTime && parseInt(marchTime) > 0) {
      onSubmit(name.trim(), parseInt(marchTime))
      setName('')
      setMarchTime('')
      inputRef.current?.focus()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        ref={inputRef}
        type="text"
        placeholder="Player name"
        value={name}
        onChange={(e) => setName(e.target.value)}
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
  )
}
