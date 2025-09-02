interface CompetitionPointsButtonProps {
  onClick: () => void
}

const CompetitionPointsButton = ({ onClick }: CompetitionPointsButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="feature-button w-full rounded-xl flex items-center justify-start p-3 text-white hover:scale-105 active:scale-95"
      style={{minHeight: '44px'}}
      aria-label="Competition Points Calculator"
    >
      <div className="text-2xl mr-3">🏆</div>
      <div className="text-base font-semibold">
        Competition Points Calculator
      </div>
    </button>
  )
}

export default CompetitionPointsButton
