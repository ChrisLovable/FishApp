interface LengthToWeightButtonProps {
  onClick: () => void
}

const LengthToWeightButton = ({ onClick }: LengthToWeightButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="feature-button w-full h-8 rounded-xl flex items-center justify-start p-2 text-white hover:scale-105 active:scale-95"
      aria-label="Length to Weight Calculator"
    >
      <div className="text-2xl mr-3">📏</div>
      <div className="text-base font-semibold">
        Length-to-Weight
      </div>
    </button>
  )
}

export default LengthToWeightButton
