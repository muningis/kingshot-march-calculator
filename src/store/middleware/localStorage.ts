import { StateCreator, StoreMutatorIdentifier } from 'zustand'

type LocalStorageMiddleware = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
  config: StateCreator<T, Mps, Mcs>
) => StateCreator<T, Mps, Mcs>

// Keys whose values should be persisted to localStorage
const PERSISTED_KEYS = ['autoUpdate', 'arrivalMode'] as const

export const persistAutoUpdate: LocalStorageMiddleware = (config) => (set, get, api) => {
  // Load persisted values on init
  const loadPersisted = (key: string): unknown => {
    const saved = localStorage.getItem(key)
    if (saved === null) return undefined
    try {
      return JSON.parse(saved)
    } catch {
      return undefined
    }
  }

  const store = config(
    (partial) => {
      set(partial)

      // Save persisted keys to localStorage whenever state changes
      const state = get()
      if (typeof state === 'object' && state !== null) {
        for (const key of PERSISTED_KEYS) {
          if (key in state) {
            localStorage.setItem(
              key,
              JSON.stringify((state as Record<string, unknown>)[key])
            )
          }
        }
      }
    },
    get,
    api
  )

  // Override initial values with anything persisted
  if (typeof store === 'object' && store !== null) {
    const overrides: Record<string, unknown> = {}
    for (const key of PERSISTED_KEYS) {
      const value = loadPersisted(key)
      if (value !== undefined) {
        overrides[key] = value
      }
    }
    return {
      ...store,
      ...overrides
    }
  }

  return store
}
