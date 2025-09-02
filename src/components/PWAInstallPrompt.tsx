import { useState, useEffect } from 'react'
import { supabase } from '../config/supabase'

interface PWAInstallPromptProps {
  isOpen: boolean
  onClose: () => void
  onInstalled: () => void
}

export default function PWAInstallPrompt({ isOpen, onClose, onInstalled }: PWAInstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstalling, setIsInstalling] = useState(false)
  const [showManualInstructions, setShowManualInstructions] = useState(false)

  useEffect(() => {
    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    // Listen for the appinstalled event
    const handleAppInstalled = () => {
      console.log('PWA was installed')
      onInstalled()
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [onInstalled])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      setShowManualInstructions(true)
      return
    }

    setIsInstalling(true)

    try {
      // Show the install prompt
      deferredPrompt.prompt()

      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === 'accepted') {
        console.log('User accepted the install prompt')
        await updatePWAStatus(true)
        onInstalled()
      } else {
        console.log('User dismissed the install prompt')
        setShowManualInstructions(true)
      }
    } catch (error) {
      console.error('Error during installation:', error)
      setShowManualInstructions(true)
    } finally {
      setIsInstalling(false)
      setDeferredPrompt(null)
    }
  }

  const updatePWAStatus = async (installed: boolean) => {
    try {
      const verifiedEmail = localStorage.getItem('verifiedEmail')
      if (!verifiedEmail) return

      const deviceInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        timestamp: new Date().toISOString()
      }

      const { error } = await supabase.rpc('update_pwa_status', {
        user_email: verifiedEmail,
        installed: installed,
        device_info: deviceInfo
      })

      if (error) {
        console.error('Error updating PWA status:', error)
      }
    } catch (error) {
      console.error('Error updating PWA status:', error)
    }
  }

  const getInstallInstructions = () => {
    const userAgent = navigator.userAgent.toLowerCase()
    
    if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
      return {
        title: 'Install on iOS',
        steps: [
          'Tap the Share button at the bottom of your screen',
          'Scroll down and tap "Add to Home Screen"',
          'Tap "Add" to install FishApp on your home screen'
        ],
        icon: '📱'
      }
    } else if (userAgent.includes('android')) {
      return {
        title: 'Install on Android',
        steps: [
          'Tap the menu button (three dots) in your browser',
          'Select "Add to Home screen" or "Install app"',
          'Tap "Add" or "Install" to add FishApp to your home screen'
        ],
        icon: '🤖'
      }
    } else {
      return {
        title: 'Install on Desktop',
        steps: [
          'Look for the install icon in your browser\'s address bar',
          'Click the install icon or use Ctrl+Shift+A (Chrome)',
          'Click "Install" to add FishApp to your desktop'
        ],
        icon: '💻'
      }
    }
  }

  if (!isOpen) return null

  const instructions = getInstallInstructions()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay p-4">
      <div className="relative w-full max-w-sm mx-auto" style={{maxWidth: '414px', maxHeight: '800px'}}>
        <div className="modal-content rounded-2xl p-6 flex flex-col overflow-y-auto" style={{height: '800px'}}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6 flex-shrink-0">
            <h2 className="text-2xl font-bold text-white">
              {showManualInstructions ? '📱 Install FishApp' : '🚀 Install FishApp'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-center">
            {!showManualInstructions ? (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-8xl mb-4">📱</div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Install FishApp
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Get the full FishApp experience by installing it on your device. 
                    You'll get faster access, offline capabilities, and a native app feel.
                  </p>
                </div>

                <div className="bg-blue-900/30 border border-blue-500 text-blue-200 px-4 py-3 rounded-lg text-sm">
                  <div className="flex items-center mb-2">
                    <span className="text-lg mr-2">✨</span>
                    <span className="font-semibold">Benefits of installing:</span>
                  </div>
                  <ul className="text-xs space-y-1 ml-6">
                    <li>• Faster loading and better performance</li>
                    <li>• Works offline when you're fishing</li>
                    <li>• Native app experience</li>
                    <li>• Easy access from your home screen</li>
                  </ul>
                </div>

                <button
                  onClick={handleInstallClick}
                  disabled={isInstalling}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  {isInstalling ? 'Installing...' : 'Install FishApp'}
                </button>

                <button
                  onClick={() => setShowManualInstructions(true)}
                  className="w-full text-blue-400 hover:text-blue-300 text-sm py-2"
                >
                  Show manual instructions
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl mb-4">{instructions.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {instructions.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Follow these steps to install FishApp on your device:
                  </p>
                </div>

                <div className="space-y-3">
                  {instructions.steps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-yellow-900/30 border border-yellow-500 text-yellow-200 px-4 py-3 rounded-lg text-sm">
                  <div className="flex items-center mb-1">
                    <span className="text-lg mr-2">💡</span>
                    <span className="font-semibold">Tip:</span>
                  </div>
                  <p className="text-xs">
                    After installation, you can access FishApp directly from your home screen or desktop!
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={onClose}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    Skip for Now
                  </button>
                  <button
                    onClick={() => setShowManualInstructions(false)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    Try Auto Install
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-xs text-gray-400 flex-shrink-0">
            {!showManualInstructions 
              ? 'Installation is quick and free!' 
              : 'Need help? Contact us at support@fishapp.com'
            }
          </div>
        </div>
      </div>
    </div>
  )
}
