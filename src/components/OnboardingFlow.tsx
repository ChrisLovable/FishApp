import { useState, useEffect } from 'react'
import EmailVerificationModal from './modals/EmailVerificationModal'
import PWAInstallPrompt from './PWAInstallPrompt'

interface OnboardingFlowProps {
  children: React.ReactNode
}

export default function OnboardingFlow({ children }: OnboardingFlowProps) {
  const [showEmailVerification, setShowEmailVerification] = useState(false)
  const [showPWAInstall, setShowPWAInstall] = useState(false)
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false)
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is already registered
    const userRegistered = localStorage.getItem('userRegistered')
    const email = localStorage.getItem('userEmail')
    
    if (userRegistered === 'true' && email) {
      setVerifiedEmail(email)
      setIsOnboardingComplete(true)
      
      // Check if PWA is already installed
      const pwaInstalled = localStorage.getItem('pwaInstalled')
      if (pwaInstalled !== 'true') {
        // Show PWA install prompt after a delay
        setTimeout(() => {
          setShowPWAInstall(true)
        }, 2000)
      }
    } else {
      // Show email capture for new users
      setShowEmailVerification(true)
    }
  }, [])

  const handleEmailVerified = (email: string) => {
    setVerifiedEmail(email)
    setShowEmailVerification(false)
    setIsOnboardingComplete(true)
    
    // Show PWA install prompt after email verification
    setTimeout(() => {
      setShowPWAInstall(true)
    }, 1000)
  }

  const handlePWAInstalled = () => {
    localStorage.setItem('pwaInstalled', 'true')
    setShowPWAInstall(false)
  }

  const handleCloseEmailVerification = () => {
    // Don't allow closing email verification - it's required
    // User must complete verification to use the app
  }

  const handleClosePWAInstall = () => {
    setShowPWAInstall(false)
    // User can skip PWA installation and use the web version
  }

  // Show loading state while checking onboarding status
  if (!isOnboardingComplete && !showEmailVerification) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-4">🐟</div>
          <div className="text-white text-xl font-semibold">Loading FishApp...</div>
          <div className="text-blue-200 text-sm mt-2">Preparing your fishing experience</div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Main App Content */}
      {children}
      
      {/* Email Verification Modal */}
      <EmailVerificationModal
        isOpen={showEmailVerification}
        onVerified={handleEmailVerified}
        onClose={handleCloseEmailVerification}
      />
      
      {/* PWA Install Prompt */}
      <PWAInstallPrompt
        isOpen={showPWAInstall}
        onClose={handleClosePWAInstall}
        onInstalled={handlePWAInstalled}
      />
    </>
  )
}
