import { create } from 'zustand'
import { createPlayersSlice, createResultsSlice, createUISlice } from './slices'
import type { PlayersSlice, ResultsSlice, UISlice } from './slices'
import { persistAutoUpdate } from './middleware/localStorage'

type StoreState = PlayersSlice & ResultsSlice & UISlice

export const useStore = create<StoreState>()(
  persistAutoUpdate((...args) => ({
    ...createPlayersSlice(...args),
    ...createResultsSlice(...args),
    ...createUISlice(...args)
  }))
)
