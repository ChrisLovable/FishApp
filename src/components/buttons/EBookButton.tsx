interface EBookButtonProps {
  onClick: () => void
}

const EBookButton = ({ onClick }: EBookButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="feature-button w-full h-8 rounded-xl flex items-center justify-start p-2 text-white hover:scale-105 active:scale-95"
      aria-label="E-book"
    >
      <div className="text-2xl mr-3">📚</div>
      <div className="text-base font-semibold">
        E-book
      </div>
    </button>
  )
}

export default EBookButton
