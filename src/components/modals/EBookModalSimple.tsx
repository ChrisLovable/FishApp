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
      <div className="relative w-full h-full max-w-4xl mx-4">
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
          <div className="flex-1 overflow-hidden">
            <iframe
              src={`${pdfFile}#page=${currentPage}&toolbar=0&navpanes=0&scrollbar=0`}
              className="w-full h-full border-0"
              title="Fishing E-book"
            />
          </div>

          {/* Controls */}
          <div className="p-4 border-t border-gray-600 bg-gray-800">
            <div className="flex items-center justify-between">
              {/* Navigation Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage <= 1}
                  className="px-3 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 disabled:opacity-50 text-white rounded transition-colors"
                >
                  ← Prev
                </button>
                
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
                    className="w-16 px-2 py-1 bg-gray-700 text-white rounded border border-gray-600 text-center text-sm"
                  />
                  <span className="text-gray-300 text-sm">of {totalPages}</span>
                </div>
                
                <button
                  onClick={goToNextPage}
                  disabled={currentPage >= totalPages}
                  className="px-3 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 disabled:opacity-50 text-white rounded transition-colors"
                >
                  Next →
                </button>
              </div>

              {/* Quick Jump Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(1)}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors text-sm"
                >
                  Start
                </button>
                <button
                  onClick={() => goToPage(25)}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors text-sm"
                >
                  Ch.2
                </button>
                <button
                  onClick={() => goToPage(50)}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors text-sm"
                >
                  Mid
                </button>
                <button
                  onClick={() => goToPage(75)}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors text-sm"
                >
                  Ch.4
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EBookModal
