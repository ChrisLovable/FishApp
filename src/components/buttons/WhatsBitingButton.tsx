interface WhatsBitingButtonProps {
  onClick: () => void
}

const WhatsBitingButton = ({ onClick }: WhatsBitingButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="feature-button w-full h-8 rounded-xl flex items-center justify-start p-2 text-white hover:scale-105 active:scale-95"
      aria-label="What's biting where?"
    >
      <div className="text-2xl mr-3">🎣</div>
      <div className="text-base font-semibold">
        What's biting where?
      </div>
    </button>
  )
}

export default WhatsBitingButton
