const namespace = 'onebe-price-simulator'

export const storageKeys = {
  draft: `${namespace}:draft`,
  savedQuotes: `${namespace}:saved-quotes`,
  recentServices: `${namespace}:recent-services`,
  uiSettings: `${namespace}:ui-settings`,
}

export const localStorageAdapter = {
  read<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : fallback
    } catch {
      return fallback
    }
  },
  write<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value))
  },
  remove(key: string) {
    localStorage.removeItem(key)
  },
}
