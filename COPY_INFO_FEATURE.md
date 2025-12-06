# Copy Info Feature Plan

## Overview

Add functionality to copy player start/arrival times with an absolute start time offset, formatted for external use (e.g., pasting into game chat or coordination tools).

---

## Feature Requirements

### Input
- Time input field accepting HH:MM:SS format (e.g., "13:10:00")
- Copy button to format and copy to clipboard

### Output Format
Ordered by start time (earliest first):
```
{startTime} {arriveTime} {playerName}
```

**Example:**
If base time is `13:10:00` and results are:
- Alice: starts 0s, arrives 100s
- Bob: starts 11s, arrives 101s
- Charlie: starts 22s, arrives 102s

Output:
```
13:10:00 13:11:40 Alice
13:10:11 13:11:41 Bob
13:10:22 13:11:42 Charlie
```

---

## Architecture

Following the established pattern:

### 1. Module: `modules/copyFormatter/`

Pure business logic for formatting copy text.

**Files:**
- `types.ts` - Type definitions
- `copyFormatter.ts` - Formatting logic
- `copyFormatter.test.ts` - Unit tests (3+ test cases)
- `index.ts` - Public exports

**Functions:**
```typescript
// Parse time string to seconds since midnight
parseTimeString(time: string): number

// Format seconds to HH:MM:SS
formatTimeToHHMMSS(seconds: number): string

// Generate copy text from results with base time offset
generateCopyText(baseTimeSeconds: number, results: Result[]): string
```

### 2. UI Components

**Molecule:** `components/molecules/CopyInfoInput.tsx`
- Time input field (HH:MM:SS)
- Copy button
- Props:
  - `onCopy: (text: string) => void`
  - `disabled: boolean` (no results)

**Integration:** Add to `ResultsTable` structure
- Show below results when results exist
- Use store to get results
- Call copyFormatter module
- Copy to clipboard using Clipboard API

---

## Implementation Steps

### Phase 1: Module + Tests (Start Here)
1. Create `modules/copyFormatter/types.ts`
2. Create `modules/copyFormatter/copyFormatter.ts`
3. **Create `modules/copyFormatter/copyFormatter.test.ts` with 3 test cases**
4. Create `modules/copyFormatter/index.ts`
5. Verify tests pass

### Phase 2: UI Components
1. Create `CopyInfoInput.tsx` molecule
2. Update `ResultsTable.tsx` to include copy feature
3. Wire up to store and clipboard

### Phase 3: Validation
1. Test with various time formats
2. Test edge cases (empty results, midnight times, etc.)
3. Verify clipboard functionality

---

## Test Cases (To Be Implemented)

### Test Case 1: Normal case with multiple players
- Base time: "13:10:00"
- 3 players with different start/arrival times
- Verify correct HH:MM:SS formatting
- Verify correct ordering by start time

### Test Case 2: Edge case - midnight crossing
- Base time: "23:59:50"
- Players with times that cross midnight
- Verify times like "00:00:05" are handled correctly

### Test Case 3: Empty or single player
- Empty results array
- Single player
- Verify output format

---

## Module API

```typescript
// modules/copyFormatter/types.ts
export interface CopyFormatterInput {
  baseTimeSeconds: number
  results: Result[]  // from calculator module
}

// modules/copyFormatter/copyFormatter.ts
export function parseTimeString(time: string): number
export function formatTimeToHHMMSS(seconds: number): string
export function generateCopyText(
  baseTimeSeconds: number,
  results: Result[]
): string
```

---

## UI Integration Points

### ResultsTable.tsx
Add after results table:
```tsx
{results && results.length > 0 && (
  <div className="mt-4">
    <CopyInfoInput
      onCopy={handleCopy}
      disabled={false}
    />
  </div>
)}
```

### Clipboard Handling
```typescript
const handleCopy = (text: string) => {
  navigator.clipboard.writeText(text)
  // Optional: Show toast notification
}
```

---

## Edge Cases to Handle

1. **Invalid time format:** "25:00:00", "12:60:00"
2. **Midnight crossing:** Times that go past 23:59:59
3. **Empty results:** No players to format
4. **Very large times:** Multi-day durations (handle as 24h+ format)

---

## Dependencies

None required - uses built-in Clipboard API.

---

## Success Criteria

✅ All unit tests pass (3+ test cases)
✅ parseTimeString correctly handles HH:MM:SS
✅ formatTimeToHHMMSS produces correct format
✅ generateCopyText produces correctly ordered output
✅ Results sorted by start time
✅ Clipboard copy functionality works
✅ UI disabled when no results available
✅ Edge cases handled gracefully
