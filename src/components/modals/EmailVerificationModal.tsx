import { useState, useEffect } from 'react'

interface EmailCaptureModalProps {
  isOpen: boolean
  onVerified: (email: string) => void
  onClose: () => void
}

export default function EmailVerificationModal({ isOpen, onVerified, onClose }: EmailCaptureModalProps) {
  const [step, setStep] = useState<'email' | 'success'>('email')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')



  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    setIsLoading(true)

    try {
      // Simply store the email and proceed - no verification needed
      localStorage.setItem('userEmail', email)
      localStorage.setItem('userRegistered', 'true')
      
      setStep('success')
      setSuccess('Welcome to FishApp!')
      
      // Proceed to app after a short delay
      setTimeout(() => {
        onVerified(email)
      }, 2000)
      
    } catch (error) {
      console.error('Error:', error)
      setError('Network error. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }



  const handleClose = () => {
    if (step === 'success') return // Don't allow closing during success
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay p-4">
      <div className="relative w-full max-w-sm mx-auto" style={{maxWidth: '414px', maxHeight: '800px'}}>
        <div className="modal-content rounded-2xl p-6 flex flex-col overflow-y-auto" style={{height: '800px'}}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6 flex-shrink-0">
            <h2 className="text-2xl font-bold text-white">
              {step === 'email' && '🎣 Welcome to FishApp!'}
              {step === 'success' && '✅ Welcome to FishApp!'}
            </h2>
            {step !== 'success' && (
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-white transition-colors p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-center">
            {step === 'email' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl mb-4">🐟</div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Get Started with FishApp
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Enter your email to access all fishing features, track your catches, 
                    and connect with the fishing community.
                  </p>
                </div>

                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  {error && (
                    <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="bg-green-900/30 border border-green-500 text-green-200 px-4 py-3 rounded-lg text-sm">
                      {success}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    {isLoading ? 'Getting Started...' : 'Get Started'}
                  </button>
                </form>
              </div>
            )}



            {step === 'success' && (
              <div className="text-center space-y-6">
                <div className="text-8xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Welcome to FishApp!
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  You're all set! You now have access to all fishing features and can install the app on your device.
                </p>
                <div className="bg-green-900/30 border border-green-500 text-green-200 px-4 py-3 rounded-lg text-sm">
                  Redirecting to the app...
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-xs text-gray-400 flex-shrink-0">
            {step === 'email' && 'Your email is safe with us. We only use it for app access.'}
            {step === 'success' && 'Ready to start fishing!'}
          </div>
        </div>
      </div>
    </div>
  )
}
