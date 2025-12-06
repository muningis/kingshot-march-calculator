import { StateCreator, StoreMutatorIdentifier } from 'zustand'

type LocalStorageMiddleware = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
  config: StateCreator<T, Mps, Mcs>
) => StateCreator<T, Mps, Mcs>

export const persistAutoUpdate: LocalStorageMiddleware = (config) => (set, get, api) => {
  // Load from localStorage on init
  const saved = localStorage.getItem('autoUpdate')
  const initialAutoUpdate = saved ? JSON.parse(saved) : false

  const store = config(
    (partial) => {
      set(partial)

      // Save to localStorage whenever autoUpdate changes
      const state = get()
      if (typeof state === 'object' && state !== null && 'autoUpdate' in state) {
        localStorage.setItem('autoUpdate', JSON.stringify(state.autoUpdate))
      }
    },
    get,
    api
  )

  // Override initial autoUpdate value
  if (typeof store === 'object' && store !== null && 'autoUpdate' in store) {
    return {
      ...store,
      autoUpdate: initialAutoUpdate
    }
  }

  return store
}
