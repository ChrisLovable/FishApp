import { useState } from 'react'
import LengthToWeightButton from './buttons/LengthToWeightButton'
import SpeciesInfoButton from './buttons/SpeciesInfoButton'
import PersonalGalleryButton from './buttons/PersonalGalleryButton'

import PublicGalleryButton from './buttons/PublicGalleryButton'
import SecondHandStoreButton from './buttons/SecondHandStoreButton'
import IdentifyFishButton from './buttons/IdentifyFishButton'
import EBookButton from './buttons/EBookButton'
import TideAndMoonButton from './buttons/TideAndMoonButton'
import WhatsBitingButton from './buttons/WhatsBitingButton'
import CompetitionPointsButton from './buttons/CompetitionPointsButton'
import LengthToWeightModal from './modals/LengthToWeightModal'
import SpeciesInfoModal from './modals/SpeciesInfoModal'
import PersonalGalleryModal from './modals/PersonalGalleryModal'
import PublicGalleryModal from './modals/PublicGalleryModal'
import SecondHandStoreModal from './modals/SecondHandStoreModal'
import IdentifyFishModal from './modals/IdentifyFishModal'
import TideAndMoonModal from './modals/TideAndMoonModal'
import EBookModal from './modals/EBookModal'
import WhatsBitingModal from './modals/WhatsBitingModal'
import CompetitionPointsModal from './modals/CompetitionPointsModal'

interface MainModalProps {
  isOpen: boolean
  onClose: () => void
}

const MainModal = ({ isOpen, onClose }: MainModalProps) => {
  const [activeModal, setActiveModal] = useState<string | null>(null)

  if (!isOpen) return null

  const handleButtonClick = (modalType: string) => {
    setActiveModal(modalType)
    // Each button will handle opening its own modal
    console.log(`Opening ${modalType} modal`)
  }

  const closeActiveModal = () => {
    setActiveModal(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay p-4">
      <div className="relative w-full max-w-full" style={{maxWidth: '414px', maxHeight: '800px'}}>
        {/* Main Modal Content */}
        <div className="modal-content rounded-2xl p-4 flex flex-col" style={{height: '800px'}}>
          {/* Header */}
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <h2 className="text-xl font-bold text-white">FishApp Menu</h2>
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

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            <div className="space-y-2">
              <LengthToWeightButton onClick={() => handleButtonClick('length-to-weight')} />
              <SpeciesInfoButton onClick={() => handleButtonClick('species-info')} />
              <IdentifyFishButton onClick={() => handleButtonClick('identify-fish')} />
              <WhatsBitingButton onClick={() => handleButtonClick('whats-biting')} />
              <CompetitionPointsButton onClick={() => handleButtonClick('competition-points')} />
              <PersonalGalleryButton onClick={() => handleButtonClick('personal-gallery')} />

              <PublicGalleryButton onClick={() => handleButtonClick('public-gallery')} />
              <SecondHandStoreButton onClick={() => handleButtonClick('second-hand-store')} />
              <TideAndMoonButton onClick={() => handleButtonClick('tide-and-moon')} />
              <EBookButton onClick={() => handleButtonClick('e-book')} />
            </div>
          </div>


        </div>
      </div>

      {/* Feature Modals */}
      <LengthToWeightModal 
        isOpen={activeModal === 'length-to-weight'} 
        onClose={closeActiveModal} 
      />
      <SpeciesInfoModal 
        isOpen={activeModal === 'species-info'} 
        onClose={closeActiveModal} 
      />
      <PersonalGalleryModal 
        isOpen={activeModal === 'personal-gallery'} 
        onClose={closeActiveModal} 
      />
      <PublicGalleryModal 
        isOpen={activeModal === 'public-gallery'} 
        onClose={closeActiveModal} 
      />
      <SecondHandStoreModal 
        isOpen={activeModal === 'second-hand-store'} 
        onClose={closeActiveModal} 
      />
      <IdentifyFishModal 
        isOpen={activeModal === 'identify-fish'} 
        onClose={closeActiveModal} 
      />
      <TideAndMoonModal 
        isOpen={activeModal === 'tide-and-moon'} 
        onClose={closeActiveModal} 
      />
      <EBookModal 
        isOpen={activeModal === 'e-book'} 
        onClose={closeActiveModal} 
      />
      <WhatsBitingModal 
        isOpen={activeModal === 'whats-biting'} 
        onClose={closeActiveModal} 
      />
      <CompetitionPointsModal 
        isOpen={activeModal === 'competition-points'} 
        onClose={closeActiveModal} 
      />
    </div>
  )
}

export default MainModal
