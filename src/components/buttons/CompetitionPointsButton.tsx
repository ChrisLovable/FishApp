interface CompetitionPointsButtonProps {
  onClick: () => void
}

const CompetitionPointsButton = ({ onClick }: CompetitionPointsButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-xl flex items-center justify-start p-3 text-white hover:scale-105 active:scale-95 transition-all duration-300"
              style={{height: '41px', background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 50%, #1e293b 100%)'}}
      aria-label="Competition Points Calculator"
    >
      <div className="text-2xl mr-3">🏆</div>
              <div className="text-lg font-semibold">
        Points Calculator
      </div>
    </button>
  )
}

export default CompetitionPointsButton
