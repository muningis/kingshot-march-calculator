import type { Result } from '@/modules/calculator'

interface ResultsTableRowProps {
  result: Result
  index: number
  formatTime: (seconds: number) => string
}

export function ResultsTableRow({ result, index, formatTime }: ResultsTableRowProps) {
  return (
    <div className="grid grid-cols-4 gap-4 p-4 border-b border-slate-200 hover:bg-slate-50 transition-colors last:border-b-0">
      <span className="font-bold text-slate-600">{index + 1}.</span>
      <span className="font-medium text-slate-900">{result.name}</span>
      <span className="font-mono text-sm font-medium text-blue-600">
        {formatTime(result.startTime)}
      </span>
      <span className="font-mono text-sm font-medium text-emerald-600">
        {formatTime(result.arrivalTime)}
      </span>
    </div>
  )
}
