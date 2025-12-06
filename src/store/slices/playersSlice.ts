import { StateCreator } from 'zustand'
import type { Player, MoveDirection } from '@/modules/players'
import * as playerOps from '@/modules/players'

export interface PlayersSlice {
  players: Player[]
  addPlayer: (name: string, marchTime: number) => void
  removePlayer: (id: number) => void
  movePlayer: (index: number, direction: MoveDirection) => void
  updatePlayerMarchTime: (id: number, marchTime: number) => void
  updatePlayerName: (id: number, name: string) => void
}

export const createPlayersSlice: StateCreator<PlayersSlice> = (set) => ({
  players: [],

  addPlayer: (name: string, marchTime: number) =>
    set((state) => ({
      players: playerOps.addPlayer(state.players, name, marchTime)
    })),

  removePlayer: (id: number) =>
    set((state) => ({
      players: playerOps.removePlayer(state.players, id)
    })),

  movePlayer: (index: number, direction: MoveDirection) =>
    set((state) => ({
      players: playerOps.movePlayer(state.players, index, direction)
    })),

  updatePlayerMarchTime: (id: number, marchTime: number) =>
    set((state) => ({
      players: playerOps.updatePlayerMarchTime(state.players, id, marchTime)
    })),

  updatePlayerName: (id: number, name: string) =>
    set((state) => ({
      players: playerOps.updatePlayerName(state.players, id, name)
    }))
})
