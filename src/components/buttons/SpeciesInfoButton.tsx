interface SpeciesInfoButtonProps {
  onClick: () => void
}

const SpeciesInfoButton = ({ onClick }: SpeciesInfoButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="feature-button w-full rounded-xl flex items-center justify-start p-3 text-white hover:scale-105 active:scale-95"
      style={{minHeight: '44px'}}
      aria-label="Species Information"
    >
      <div className="text-2xl mr-3">🐠</div>
      <div className="text-base font-semibold">
        Species Information
      </div>
    </button>
  )
}

export default SpeciesInfoButton
