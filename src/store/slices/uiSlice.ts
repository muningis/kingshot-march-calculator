import { StateCreator } from 'zustand'
import type { ArrivalMode } from '@/modules/calculator'

export interface UISlice {
  editingPlayerId: number | null
  editingMarchTime: string
  editingPlayerName: string
  autoUpdate: boolean
  arrivalMode: ArrivalMode
  startEditing: (playerId: number, currentMarchTime: number) => void
  startEditingName: (playerId: number, currentName: string) => void
  stopEditing: () => void
  setEditingMarchTime: (value: string) => void
  setEditingPlayerName: (value: string) => void
  toggleAutoUpdate: () => void
  setArrivalMode: (mode: ArrivalMode) => void
}

export const createUISlice: StateCreator<UISlice> = (set) => ({
  editingPlayerId: null,
  editingMarchTime: '',
  editingPlayerName: '',
  autoUpdate: false,
  arrivalMode: 'sequential',

  startEditing: (playerId: number, currentMarchTime: number) =>
    set({
      editingPlayerId: playerId,
      editingMarchTime: String(currentMarchTime)
    }),

  startEditingName: (playerId: number, currentName: string) =>
    set({
      editingPlayerId: playerId,
      editingPlayerName: currentName
    }),

  stopEditing: () =>
    set({
      editingPlayerId: null,
      editingMarchTime: '',
      editingPlayerName: ''
    }),

  setEditingMarchTime: (value: string) =>
    set({ editingMarchTime: value }),

  setEditingPlayerName: (value: string) =>
    set({ editingPlayerName: value }),

  toggleAutoUpdate: () =>
    set((state) => ({ autoUpdate: !state.autoUpdate })),

  setArrivalMode: (mode: ArrivalMode) =>
    set({ arrivalMode: mode })
})
