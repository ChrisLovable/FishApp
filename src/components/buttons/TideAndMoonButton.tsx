interface TideAndMoonButtonProps {
  onClick: () => void
}

const TideAndMoonButton = ({ onClick }: TideAndMoonButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="feature-button w-full rounded-xl flex items-center justify-start p-3 text-white hover:scale-105 active:scale-95"
      style={{minHeight: '44px'}}
      aria-label="Tide, Moon & Weather"
    >
      <div className="text-2xl mr-3">🌊🌙</div>
      <div className="text-base font-semibold">
        Tide, Moon & Weather
      </div>
    </button>
  )
}

export default TideAndMoonButton
