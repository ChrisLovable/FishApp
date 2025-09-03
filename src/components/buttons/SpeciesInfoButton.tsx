interface SpeciesInfoButtonProps {
  onClick: () => void
}

const SpeciesInfoButton = ({ onClick }: SpeciesInfoButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-xl flex items-center justify-start p-3 text-white hover:scale-105 active:scale-95 transition-all duration-300"
              style={{height: '41px', background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%)'}}
      aria-label="Species Information"
    >
      <div className="text-2xl mr-3">🐠</div>
              <div className="text-lg font-semibold">
        Species Information
      </div>
    </button>
  )
}

export default SpeciesInfoButton
