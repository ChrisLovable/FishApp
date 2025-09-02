import { useState, useEffect } from 'react'
import MainModal from './components/MainModal'
import OnboardingFlow from './components/OnboardingFlow'
import './App.css'

function App() {
  const [isMainModalOpen, setIsMainModalOpen] = useState(true)

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration)
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError)
        })
    }
  }, [])

  return (
    <OnboardingFlow>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            🐟 FishApp
          </h1>
          
          {!isMainModalOpen && (
            <button
              onClick={() => setIsMainModalOpen(true)}
              className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              Open FishApp Menu
            </button>
          )}

          <MainModal 
            isOpen={isMainModalOpen}
            onClose={() => setIsMainModalOpen(false)}
          />
        </div>
      </div>
    </OnboardingFlow>
  )
}

export default App
