interface TideAndMoonButtonProps {
  onClick: () => void
}

const TideAndMoonButton = ({ onClick }: TideAndMoonButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="feature-button w-full h-8 rounded-xl flex items-center justify-start p-2 text-white hover:scale-105 active:scale-95"
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
