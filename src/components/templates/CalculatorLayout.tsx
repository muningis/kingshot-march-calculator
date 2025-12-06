import type { ReactNode } from 'react'

interface CalculatorLayoutProps {
  leftPanel: ReactNode
  rightPanel: ReactNode
}

export function CalculatorLayout({ leftPanel, rightPanel }: CalculatorLayoutProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
      {leftPanel}
      {rightPanel}
    </div>
  )
}
