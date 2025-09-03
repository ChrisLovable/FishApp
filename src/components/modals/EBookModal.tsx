import { useState } from 'react'

interface EBookModalProps {
  isOpen: boolean
  onClose: () => void
}

const EBookModal = ({ isOpen, onClose }: EBookModalProps) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages] = useState(100) // Adjust based on your PDF
  const [showPurchaseForm, setShowPurchaseForm] = useState(false)
  const [purchaseType, setPurchaseType] = useState<'ebook' | 'hardcopy'>('ebook')
  const [purchaseData, setPurchaseData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // PDF file path
  const pdfFile = '/fishing-ebook.pdf'

  const goToPrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1))
  }

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1))
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handlePurchaseFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPurchaseData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePurchaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Create email content
      const bookType = purchaseType === 'ebook' ? 'E-book' : 'Hard Copy'
      const price = purchaseType === 'ebook' ? 'R25' : 'R100'
      const emailContent = `
New ${bookType} Purchase Request

Name: ${purchaseData.name}
Email: ${purchaseData.email}
Phone: ${purchaseData.phone}
Book Type: ${bookType}
Price: ${price}
Message: ${purchaseData.message}

Requested at: ${new Date().toLocaleString()}
      `.trim()

      // Create mailto link
      const subject = encodeURIComponent(`${bookType} Purchase Request - Fishing Guide`)
      const body = encodeURIComponent(emailContent)
      const mailtoLink = `mailto:chrisdevries.personal@gmail.com?subject=${subject}&body=${body}`

      // Try to open email client
      try {
        window.open(mailtoLink, '_blank')
        
        // Show success message with instructions
        alert(`Thank you for your interest in the ${bookType} (${price})! 

Your email client should open with a pre-filled message. Please send the email to complete your purchase request.

If your email client doesn't open, you can manually email:
chrisdevries.personal@gmail.com

Subject: ${bookType} Purchase Request - Fishing Guide`)
      } catch (error) {
        // Fallback: Show manual instructions
        const manualInstructions = `
Thank you for your interest in the ${bookType} (${price})!

Please send an email to: chrisdevries.personal@gmail.com

Subject: ${bookType} Purchase Request - Fishing Guide

Message:
${emailContent}

We'll contact you within 24 hours to arrange payment and delivery.
        `.trim()
        
        alert(manualInstructions)
      }

      // Reset form
      setPurchaseData({
        name: '',
        email: '',
        phone: '',
        message: ''
      })
      setShowPurchaseForm(false)
      setPurchaseType('ebook')

    } catch (error) {
      console.error('Error submitting purchase request:', error)
      alert('There was an error processing your request. Please try again or contact us directly at chrisdevries.personal@gmail.com')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay p-4">
      <div className="relative w-full mx-1" style={{maxWidth: '414px', maxHeight: '680px'}}>
        <div className="modal-content rounded-2xl flex flex-col" style={{height: '680px'}}>
          {/* Fixed Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-600 flex-shrink-0">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-white">📚 Fishing E-book</h2>
              <div className="text-sm text-gray-300">
                Page {currentPage} of {totalPages}
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Fixed Purchase Buttons */}
          <div className="p-4 border-b border-gray-600 flex-shrink-0 space-y-3">
            <button
              onClick={() => {
                setPurchaseType('ebook')
                setShowPurchaseForm(true)
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              💳 Buy E-book Version - R25
            </button>
            <button
              onClick={() => {
                setPurchaseType('hardcopy')
                setShowPurchaseForm(true)
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              📖 Buy Hard Copy Version - R100
            </button>
          </div>

          {/* Purchase Form Modal */}
          {showPurchaseForm && (
            <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-50 p-4">
              <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md">
                <h3 className="text-xl font-bold text-white mb-2">
                  Purchase {purchaseType === 'ebook' ? 'E-book' : 'Hard Copy'}
                </h3>
                <p className="text-green-400 font-semibold mb-4">
                  Price: {purchaseType === 'ebook' ? 'R25' : 'R100'}
                </p>
                
                <form onSubmit={handlePurchaseSubmit} className="space-y-4">
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={purchaseData.name}
                      onChange={handlePurchaseFormChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={purchaseData.email}
                      onChange={handlePurchaseFormChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={purchaseData.phone}
                      onChange={handlePurchaseFormChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">Message</label>
                    <textarea
                      name="message"
                      value={purchaseData.message}
                      onChange={handlePurchaseFormChange}
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none resize-none"
                      placeholder="Any specific requests or questions..."
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowPurchaseForm(false)}
                      className="flex-1 py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                    >
                      {isSubmitting ? 'Processing...' : 'Send Request'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Scrollable PDF Viewer */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-2">
            <iframe
              src={`${pdfFile}#page=${currentPage}&toolbar=0&navpanes=0&scrollbar=0`}
              className="w-full h-full min-h-[400px] border-0 rounded"
              title="Fishing E-book"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default EBookModal
