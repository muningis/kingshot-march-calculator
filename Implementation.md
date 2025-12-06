# Implementation Guide

## Overview

This document provides domain-specific implementation details for refactoring the March Time Calculator application according to the patterns defined in Architecture.md.

---

## Current State Analysis

### Existing File: `src/App.tsx` (314 lines)

**Current responsibilities:**
- Player form input handling
- Player list management (add, remove, move, edit)
- March time calculation logic
- Results display
- Auto-update toggle with localStorage persistence
- All UI rendering

**Problems:**
- Single file doing too much
- Business logic mixed with UI
- Difficult to test calculation logic
- No separation of concerns

---

## Module Breakdown

### Module 1: `modules/formatting/`

**Purpose:** Time formatting utilities

#### Files to Create

**`types.ts`**
```typescript
// No types needed - uses primitives
```

**`time.ts`**
```typescript
/**
 * Formats seconds to MM:SS format
 * @param seconds - Number of seconds to format
 * @returns Formatted time string (e.g., "02:05")
 * @example formatTime(125) // "02:05"
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}
```

**`time.test.ts`**
Test cases:
- `formatTime(0)` → `"00:00"`
- `formatTime(5)` → `"00:05"`
- `formatTime(60)` → `"01:00"`
- `formatTime(125)` → `"02:05"`
- `formatTime(3661)` → `"61:01"` (handles hours as minutes)

**`index.ts`**
```typescript
export { formatTime } from './time'
```

---

### Module 2: `modules/players/`

**Purpose:** Player management operations

**Current logic location:** App.tsx lines 62-97, 99-116

#### Files to Create

**`types.ts`**
```typescript
export interface Player {
  id: number
  name: string
  marchTime: number
}

export type MoveDirection = 'up' | 'down'
```

**`players.ts`**
```typescript
import type { Player, MoveDirection } from './types'

/**
 * Generates a unique player ID using timestamp
 */
export function generatePlayerId(): number {
  return Date.now()
}

/**
 * Adds a new player to the list
 */
export function addPlayer(
  players: Player[],
  name: string,
  marchTime: number
): Player[] {
  return [
    ...players,
    {
      id: generatePlayerId(),
      name: name.trim(),
      marchTime
    }
  ]
}

/**
 * Removes a player by ID
 */
export function removePlayer(
  players: Player[],
  id: number
): Player[] {
  return players.filter(p => p.id !== id)
}

/**
 * Moves a player up or down in the list
 */
export function movePlayer(
  players: Player[],
  index: number,
  direction: MoveDirection
): Player[] {
  const newIndex = direction === 'up' ? index - 1 : index + 1

  // Check bounds
  if (newIndex < 0 || newIndex >= players.length) {
    return players
  }

  const newPlayers = [...players]
  ;[newPlayers[index], newPlayers[newIndex]] = [newPlayers[newIndex], newPlayers[index]]
  return newPlayers
}

/**
 * Updates a player's march time
 */
export function updatePlayerMarchTime(
  players: Player[],
  id: number,
  marchTime: number
): Player[] {
  return players.map(p =>
    p.id === id ? { ...p, marchTime } : p
  )
}
```

**`players.test.ts`**
Test cases:
- Add player with valid data
- Add player trims whitespace from name
- Remove existing player
- Remove non-existent player (no change)
- Move player up from middle position
- Move player up from first position (no change)
- Move player down from middle position
- Move player down from last position (no change)
- Update march time for existing player
- Update march time for non-existent player (no change)

**`index.ts`**
```typescript
export type { Player, MoveDirection } from './types'
export {
  generatePlayerId,
  addPlayer,
  removePlayer,
  movePlayer,
  updatePlayerMarchTime
} from './players'
```

---

### Module 3: `modules/calculator/`

**Purpose:** Start time calculation logic

**Current logic location:** App.tsx lines 29-48

#### Files to Create

**`types.ts`**
```typescript
export interface CalculationInput {
  marchTime: number
  index: number
}

export interface CalculationResult {
  startTime: number
  arrivalTime: number
}

export interface Result {
  name: string
  marchTime: number
  startTime: number
  arrivalTime: number
  order: number
}
```

**`calculator.ts`**
```typescript
import type { CalculationInput, CalculationResult } from './types'

/**
 * Calculates the minimum arrival time for the first player
 * Formula: max(marchTime[i] - i) for all players
 * This ensures all start times are non-negative
 */
export function calculateMinArrivalTime(
  inputs: CalculationInput[]
): number {
  if (inputs.length === 0) return 0

  return Math.max(...inputs.map(input => input.marchTime - input.index))
}

/**
 * Calculates start and arrival times for all players
 * Each player arrives exactly 1 second after the previous one
 * All start times must be non-negative (at or after 00:00)
 */
export function calculateStartTimes(
  inputs: CalculationInput[]
): CalculationResult[] {
  if (inputs.length === 0) return []

  const minArrivalTime = calculateMinArrivalTime(inputs)

  return inputs.map(input => {
    const arrivalTime = minArrivalTime + input.index
    const startTime = arrivalTime - input.marchTime

    return {
      startTime,
      arrivalTime
    }
  })
}
```

**`calculator.test.ts`**
Test cases:
- Empty input returns empty array
- Single player: `[{marchTime: 100, index: 0}]` → `[{startTime: 0, arrivalTime: 100}]`
- Two players same march time: verify 1-second arrival interval
- Three players different march times: verify all start times ≥ 0
- Edge case: player with marchTime = index
- Edge case: player with large march time difference
- Verify arrival times are 1 second apart
- Verify no start time is negative

**`index.ts`**
```typescript
export type { CalculationInput, CalculationResult, Result } from './types'
export {
  calculateMinArrivalTime,
  calculateStartTimes
} from './calculator'
```

---

## Store Implementation

### Store Slices

#### `store/slices/playersSlice.ts`

**State:**
- `players: Player[]` - Array of players in arrival order

**Actions:**
- `addPlayer(name, marchTime)` - Uses `players.addPlayer`
- `removePlayer(id)` - Uses `players.removePlayer`
- `movePlayer(index, direction)` - Uses `players.movePlayer`
- `updatePlayerMarchTime(id, marchTime)` - Uses `players.updatePlayerMarchTime`

---

#### `store/slices/resultsSlice.ts`

**State:**
- `results: Result[] | null` - Calculated results or null

**Actions:**
- `calculateResults()` - Uses `calculator.calculateStartTimes` with player data
- `clearResults()` - Sets results to null

**Logic:**
```typescript
calculateResults: () => {
  const { players } = get()

  if (players.length === 0) {
    set({ results: null })
    return
  }

  const inputs = players.map((p, i) => ({
    marchTime: p.marchTime,
    index: i
  }))

  const calculations = calculateStartTimes(inputs)

  const results = players.map((player, index) => ({
    name: player.name,
    marchTime: player.marchTime,
    startTime: calculations[index].startTime,
    arrivalTime: calculations[index].arrivalTime,
    order: index + 1
  }))

  // Sort by start time for display
  const sorted = [...results].sort((a, b) => a.startTime - b.startTime)

  set({ results: sorted })
}
```

---

#### `store/slices/uiSlice.ts`

**State:**
- `editingPlayerId: number | null` - ID of player being edited
- `autoUpdate: boolean` - Whether to auto-calculate on changes

**Actions:**
- `startEditing(playerId)` - Set editingPlayerId
- `stopEditing()` - Clear editingPlayerId
- `toggleAutoUpdate()` - Toggle autoUpdate boolean

---

#### `store/middleware/localStorage.ts`

**Purpose:** Persist autoUpdate preference

```typescript
import { StateCreator } from 'zustand'

export const persistAutoUpdate = <T extends { autoUpdate: boolean }>(
  config: StateCreator<T>
) => (set, get, api) => {
  // Load from localStorage on init
  const saved = localStorage.getItem('autoUpdate')
  const initialAutoUpdate = saved ? JSON.parse(saved) : false

  const store = config(
    (partial) => {
      set(partial)

      // Save to localStorage whenever autoUpdate changes
      const state = get()
      if ('autoUpdate' in state) {
        localStorage.setItem('autoUpdate', JSON.stringify(state.autoUpdate))
      }
    },
    get,
    api
  )

  // Override initial autoUpdate value
  return {
    ...store,
    autoUpdate: initialAutoUpdate
  }
}
```

---

## Component Breakdown

### Molecules

#### `PlayerFormInput.tsx`
**Props:**
- `onSubmit: (name: string, marchTime: number) => void`
- `nameInputRef?: RefObject<HTMLInputElement>`

**Local State:**
- `name: string`
- `marchTime: string`

**Behavior:**
- Validates inputs (name not empty, marchTime > 0)
- Calls onSubmit with parsed values
- Clears form after submission

---

#### `PlayerListItem.tsx`
**Props:**
- `player: Player`
- `index: number`
- `isFirst: boolean`
- `isLast: boolean`
- `isEditing: boolean`
- `editingValue: string`
- `onEditStart: () => void`
- `onEditChange: (value: string) => void`
- `onEditSave: () => void`
- `onEditCancel: () => void`
- `onMoveUp: () => void`
- `onMoveDown: () => void`
- `onRemove: () => void`

**No local state** - fully controlled

---

#### `ResultsTableHeader.tsx`
**Props:** None

Renders column headers: "Start Order", "Player", "Start Time", "Arrival Time"

---

#### `ResultsTableRow.tsx`
**Props:**
- `result: Result`
- `index: number`

Displays result data with formatted times

---

#### `AutoUpdateToggle.tsx`
**Props:**
- `checked: boolean`
- `onCheckedChange: (checked: boolean) => void`

Switch component with "Auto Update" label

---

### Structures

#### `AppHeader.tsx`
**Props:** None

Renders title and description (static content from lines 133-139)

---

#### `PlayerList.tsx`
**Props:** None (uses store hooks)

**Store hooks:**
- `useStore(state => state.players)`
- `useStore(state => state.addPlayer)`
- `useStore(state => state.removePlayer)`
- `useStore(state => state.movePlayer)`
- `useStore(state => state.updatePlayerMarchTime)`
- `useStore(state => state.editingPlayerId)`
- `useStore(state => state.startEditing)`
- `useStore(state => state.stopEditing)`
- `useStore(state => state.autoUpdate)`
- `useStore(state => state.toggleAutoUpdate)`
- `useStore(state => state.calculateResults)`
- `useStore(state => state.clearResults)`

**Composition:**
- Card wrapper
- PlayerFormInput
- List of PlayerListItem components
- AutoUpdateToggle
- Calculate button

**Logic:**
- Handles form submission
- Manages editing state
- Clears results when autoUpdate is off

---

#### `ResultsTable.tsx`
**Props:** None (uses store hooks)

**Store hooks:**
- `useStore(state => state.results)`
- `useStore(state => state.autoUpdate)`

**Composition:**
- Card wrapper
- Conditional: empty state or results table
- ResultsTableHeader
- List of ResultsTableRow components

**Uses:** `formatTime` from `modules/formatting`

---

### Templates

#### `CalculatorLayout.tsx`
**Props:**
- `leftPanel: ReactNode`
- `rightPanel: ReactNode`

Renders two-column responsive grid (from line 141)

---

## Final App.tsx Structure

```typescript
import { useEffect } from 'react'
import { useStore } from '@/store'
import { AppHeader } from '@/components/structures/AppHeader'
import { PlayerList } from '@/components/structures/PlayerList'
import { ResultsTable } from '@/components/structures/ResultsTable'
import { CalculatorLayout } from '@/components/templates/CalculatorLayout'

function App() {
  const players = useStore(state => state.players)
  const autoUpdate = useStore(state => state.autoUpdate)
  const calculateResults = useStore(state => state.calculateResults)

  // Auto-calculate when players change and auto-update is enabled
  useEffect(() => {
    if (autoUpdate && players.length > 0) {
      calculateResults()
    }
  }, [players, autoUpdate, calculateResults])

  return (
    <div className="max-w-7xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      <AppHeader />
      <CalculatorLayout
        leftPanel={<PlayerList />}
        rightPanel={<ResultsTable />}
      />
    </div>
  )
}

export default App
```

**Final line count:** ~30 lines

---

## Migration Checklist

### Phase 1: Infrastructure
- [ ] Run `bun add zustand`
- [ ] Create folder structure:
  - [ ] `src/modules/`
  - [ ] `src/modules/formatting/`
  - [ ] `src/modules/players/`
  - [ ] `src/modules/calculator/`
  - [ ] `src/store/`
  - [ ] `src/store/slices/`
  - [ ] `src/store/middleware/`
  - [ ] `src/components/molecules/`
  - [ ] `src/components/structures/`
  - [ ] `src/components/templates/`
- [ ] Add test script to package.json: `"test": "bun test"`

### Phase 2: Modules
- [ ] Create `modules/formatting/` (time.ts, time.test.ts, index.ts)
- [ ] Create `modules/players/` (types.ts, players.ts, players.test.ts, index.ts)
- [ ] Create `modules/calculator/` (types.ts, calculator.ts, calculator.test.ts, index.ts)
- [ ] Run `bun test` - all tests should pass
- [ ] Verify 100% coverage on modules

### Phase 3: Store
- [ ] Create `store/middleware/localStorage.ts`
- [ ] Create `store/slices/playersSlice.ts`
- [ ] Create `store/slices/resultsSlice.ts`
- [ ] Create `store/slices/uiSlice.ts`
- [ ] Create `store/slices/index.ts`
- [ ] Create `store/index.ts`
- [ ] Test store in isolation

### Phase 4: Components
- [ ] Create `components/molecules/ResultsTableHeader.tsx`
- [ ] Create `components/molecules/ResultsTableRow.tsx`
- [ ] Create `components/molecules/AutoUpdateToggle.tsx`
- [ ] Create `components/molecules/PlayerFormInput.tsx`
- [ ] Create `components/molecules/PlayerListItem.tsx`
- [ ] Create `components/structures/AppHeader.tsx`
- [ ] Create `components/structures/ResultsTable.tsx`
- [ ] Create `components/structures/PlayerList.tsx`
- [ ] Create `components/templates/CalculatorLayout.tsx`

### Phase 5: Refactor App
- [ ] Update `App.tsx` to use new components
- [ ] Remove all business logic from App.tsx
- [ ] Keep only auto-update effect and composition
- [ ] Verify App.tsx is ~30 lines

### Phase 6: Cleanup
- [ ] Delete `src/types/index.ts`
- [ ] Remove unused imports from App.tsx
- [ ] Run `bun test` - all tests pass
- [ ] Run `bun run lint` - no errors
- [ ] Run `bun run build` - successful build
- [ ] Test in browser - all functionality works
- [ ] Verify localStorage persistence works

---

## Testing Requirements

### Formatting Module
- 5 test cases minimum
- Edge cases: zero, negative (if applicable), large values

### Players Module
- 10+ test cases
- Cover all CRUD operations
- Test boundary conditions for move operations

### Calculator Module
- 8+ test cases
- Test empty input
- Test single/multiple players
- Verify 1-second intervals
- Verify non-negative start times
- Test edge cases (marchTime = index, etc.)

### Target Coverage
- **Modules:** 100%
- **Overall:** 80%+

---

## Key Algorithms

### Start Time Calculation

**Input:** List of players with march times in desired arrival order

**Algorithm:**
1. Calculate minimum arrival time: `max(marchTime[i] - i)` for all players
2. For each player at position `i`:
   - Arrival time = minArrivalTime + i (ensures 1-second intervals)
   - Start time = arrivalTime - marchTime[i]
3. Sort results by start time for display

**Example:**
```
Players (arrival order):
1. Alice: 100 seconds
2. Bob: 90 seconds
3. Charlie: 80 seconds

Calculation:
minArrivalTime = max(100-0, 90-1, 80-2) = max(100, 89, 78) = 100

Results:
Alice: arrives at 100, starts at 0
Bob: arrives at 101, starts at 11
Charlie: arrives at 102, starts at 22
```

---

## Success Criteria

✅ All tests pass with 100% module coverage
✅ App.tsx reduced from 314 to ~30 lines
✅ Business logic extracted to testable modules
✅ Clear separation of concerns
✅ No functionality lost
✅ Auto-update with localStorage works
✅ Production build succeeds
✅ Lint passes with no errors
