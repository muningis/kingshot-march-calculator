import { useState } from 'react'
import { useStore } from '@/store'
import { formatTime } from '@/modules/formatting'
import { parseTimeString, generateCopyText } from '@/modules/copyFormatter'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ResultsTableHeader } from '@/components/molecules/ResultsTableHeader'
import { ResultsTableRow } from '@/components/molecules/ResultsTableRow'
import { CopyInfoInput } from '@/components/molecules/CopyInfoInput'

export function ResultsTable() {
  const results = useStore((state) => state.results)
  const autoUpdate = useStore((state) => state.autoUpdate)
  const [error, setError] = useState<string | null>(null)

  const handleCopy = async (baseTime: string) => {
    if (!results || results.length === 0) return

    try {
      // Parse the base time
      const baseTimeSeconds = parseTimeString(baseTime)

      // Generate copy text
      const copyText = generateCopyText(baseTimeSeconds, results)

      // Copy to clipboard
      await navigator.clipboard.writeText(copyText)

      // Clear any previous errors
      setError(null)
    } catch (err) {
      // Handle errors (invalid time format, clipboard failure, etc.)
      setError(err instanceof Error ? err.message : 'Failed to copy')
      setTimeout(() => setError(null), 3000)
    }
  }

  return (
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
          <>
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
              <ResultsTableHeader />
              {results.map((result, index) => (
                <ResultsTableRow
                  key={index}
                  result={result}
                  index={index}
                  formatTime={formatTime}
                />
              ))}
            </div>

            {/* Copy Info Section */}
            <div className="mt-4 p-4 bg-white border border-slate-200 rounded-lg">
              <h4 className="text-sm font-medium text-slate-700 mb-2">
                Copy to Clipboard
              </h4>
              <p className="text-xs text-slate-500 mb-3">
                Enter a base time to copy formatted start times for all players
              </p>
              <CopyInfoInput
                onCopy={handleCopy}
                disabled={!results || results.length === 0}
              />
              {error && (
                <p className="text-xs text-rose-600 mt-2">
                  {error}
                </p>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
