// Safe localStorage utilities to prevent quota exceeded errors

export const safeLocalStorage = {
  setItem: (key: string, value: string): boolean => {
    try {
      localStorage.setItem(key, value)
      return true
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.warn(`⚠️ LocalStorage quota exceeded for key: ${key}`, error)
        // Try to clear some space by removing old entries
        try {
          // Remove some common cache keys that might be large
          const keysToRemove = ['secondHandItems', 'competitionPointsEntries', 'publicGalleryItems']
          keysToRemove.forEach(k => {
            if (k !== key && localStorage.getItem(k)) {
              localStorage.removeItem(k)
            }
          })
          // Try again
          localStorage.setItem(key, value)
          return true
        } catch (retryError) {
          console.error(`❌ Failed to save to localStorage after cleanup: ${key}`, retryError)
          return false
        }
      } else {
        console.error(`❌ LocalStorage error for key: ${key}`, error)
        return false
      }
    }
  },

  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.error(`❌ Error reading from localStorage: ${key}`, error)
      return null
    }
  },

  removeItem: (key: string): boolean => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`❌ Error removing from localStorage: ${key}`, error)
      return false
    }
  },

  clear: (): boolean => {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error('❌ Error clearing localStorage', error)
      return false
    }
  },

  // Get current localStorage usage (approximate)
  getUsage: (): { used: number; available: number } => {
    try {
      let used = 0
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          used += localStorage[key].length + key.length
        }
      }
      // Most browsers have 5-10MB limit, we'll estimate 5MB
      const available = 5 * 1024 * 1024 - used
      return { used, available }
    } catch (error) {
      console.error('❌ Error calculating localStorage usage', error)
      return { used: 0, available: 0 }
    }
  }
}

// Helper function to log localStorage usage
export const logStorageUsage = () => {
  const usage = safeLocalStorage.getUsage()
  const usedMB = (usage.used / 1024 / 1024).toFixed(2)
  const availableMB = (usage.available / 1024 / 1024).toFixed(2)
  console.log(`📊 LocalStorage usage: ${usedMB}MB used, ${availableMB}MB available`)
}
