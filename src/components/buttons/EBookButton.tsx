interface EBookButtonProps {
  onClick: () => void
}

const EBookButton = ({ onClick }: EBookButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-xl flex items-center justify-start p-3 text-white hover:scale-105 active:scale-95 transition-all duration-300"
              style={{height: '41px', background: 'linear-gradient(135deg, #64748b 0%, #475569 50%, #334155 100%)'}}
      aria-label="E-book"
    >
      <div className="text-2xl mr-3">📚</div>
              <div className="text-lg font-semibold">
        E-book
      </div>
    </button>
  )
}

export default EBookButton
