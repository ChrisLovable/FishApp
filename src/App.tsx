import { useState, useEffect } from 'react'
import MainModal from './components/MainModal'
import OnboardingFlow from './components/OnboardingFlow'
import { setupGlobalErrorHandling, logger } from './utils/logger'
import { ErrorBoundary } from './components/ErrorBoundary'
import { logVersionInfo, APP_VERSION } from './constants/version'
import './App.css'

function App() {
  const [isMainModalOpen, setIsMainModalOpen] = useState(true)

  // Setup error logging and service worker
  useEffect(() => {
    // Log app version for debugging - v0.3.2
    logVersionInfo()
    
    // Setup global error handling
    setupGlobalErrorHandling()
    
    // Force-capture ALL JS failures (adapted for Vite/React)
    if (typeof window !== "undefined") {
      // Sync errors
      window.addEventListener("error", (event) => {
        console.error("⚠️ Global JS Error:", event.message, event.error)
        logger.logError({
          message: event.message,
          stack: event.error?.stack,
          url: event.filename,
          errorType: 'JavaScript',
          component: 'Global'
        })
      })

      // Async errors
      window.addEventListener("unhandledrejection", (event) => {
        console.error("⚠️ Unhandled Promise:", event.reason)
        logger.logError({
          message: `Unhandled Promise Rejection: ${String(event.reason)}`,
          stack: event.reason?.stack,
          errorType: 'Promise',
          component: 'Global'
        })
      })
    }
    
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration)
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError)
          // Log service worker registration errors
          logger.logError({
            message: `Service Worker registration failed: ${registrationError.message}`,
            stack: registrationError.stack,
            errorType: 'ServiceWorker',
            component: 'App'
          })
        })
    }
  }, [])

  return (
    <ErrorBoundary>
      <OnboardingFlow>
        <div className="min-h-screen w-full flex items-center justify-center p-4">
          <div className="w-full max-w-4xl">
            <h1 className="text-4xl font-bold text-white mb-8 text-center">
              🐟 FishApp
            </h1>
            
            {!isMainModalOpen && (
              <div className="space-y-3">
                <button
                  onClick={() => setIsMainModalOpen(true)}
                  className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Open FishApp Menu
                </button>
                
                {/* Test Error Logging Button - Remove after testing */}
                <button
                  onClick={() => {
                    console.log("🧪 Testing error logging...")
                    // Trigger a test error
                    throw new Error("🧪 TEST ERROR: This is a controlled test error to verify logging system")
                  }}
                  className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors text-sm"
                >
                  🧪 Test Error Logging
                </button>
              </div>
            )}

            <MainModal 
              isOpen={isMainModalOpen}
              onClose={() => setIsMainModalOpen(false)}
            />
          </div>
        </div>
      </OnboardingFlow>
    </ErrorBoundary>
  )
}

export default App
