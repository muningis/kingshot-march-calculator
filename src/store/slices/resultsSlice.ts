import { StateCreator } from 'zustand'
import type { Result } from '@/modules/calculator'
import { calculateStartTimes } from '@/modules/calculator'
import type { PlayersSlice } from './playersSlice'

export interface ResultsSlice {
  results: Result[] | null
  calculateResults: () => void
  clearResults: () => void
}

export const createResultsSlice: StateCreator<
  PlayersSlice & ResultsSlice,
  [],
  [],
  ResultsSlice
> = (set, get) => ({
  results: null,

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
  },

  clearResults: () => set({ results: null })
})
