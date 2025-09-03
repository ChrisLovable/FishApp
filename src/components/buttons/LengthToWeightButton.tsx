interface LengthToWeightButtonProps {
  onClick: () => void
}

const LengthToWeightButton = ({ onClick }: LengthToWeightButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-xl flex items-center justify-start p-3 text-white hover:scale-105 active:scale-95 transition-all duration-300"
              style={{height: '41px', background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 50%, #a16207 100%)'}}
      aria-label="Length to Weight Calculator"
    >
      <div className="text-2xl mr-3">📏</div>
              <div className="text-lg font-semibold">
        Length-to-Weight
      </div>
    </button>
  )
}

export default LengthToWeightButton
