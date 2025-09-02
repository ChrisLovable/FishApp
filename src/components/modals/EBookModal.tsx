import { useState } from 'react'

interface EBookModalProps {
  isOpen: boolean
  onClose: () => void
}

const EBookModal = ({ isOpen, onClose }: EBookModalProps) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages] = useState(100) // Adjust based on your PDF
  
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay">
      <div className="relative w-full h-full max-w-4xl mx-6">
        <div className="modal-content rounded-2xl h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-600">
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

          {/* PDF Viewer - Using iframe as fallback */}
          <div className="flex-1 overflow-hidden p-2">
            <iframe
              src={`${pdfFile}#page=${currentPage}&toolbar=0&navpanes=0&scrollbar=0`}
              className="w-full h-full border-0 rounded"
              title="Fishing E-book"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default EBookModal
