// App version tracking
export const APP_VERSION = "0.3.2"
export const VERSION_NOTES = "crash fix: logo path + Supabase error logging + comprehensive error capture"

// Version info for debugging
export const getVersionInfo = () => ({
  version: APP_VERSION,
  notes: VERSION_NOTES,
  timestamp: new Date().toISOString(),
  userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'server',
  url: typeof window !== 'undefined' ? window.location.href : 'server'
})

// Log version info to console
export const logVersionInfo = () => {
  const info = getVersionInfo()
  console.log(`🐟 FishApp v${info.version} - ${info.notes}`)
  console.log(`📱 User Agent: ${info.userAgent}`)
  console.log(`🌐 URL: ${info.url}`)
  console.log(`⏰ Timestamp: ${info.timestamp}`)
}
