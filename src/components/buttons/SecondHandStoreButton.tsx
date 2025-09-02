interface SecondHandStoreButtonProps {
  onClick: () => void
}

const SecondHandStoreButton = ({ onClick }: SecondHandStoreButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="feature-button w-full rounded-xl flex items-center justify-start p-3 text-white hover:scale-105 active:scale-95"
      style={{minHeight: '44px'}}
      aria-label="Second-Hand Store"
    >
      <div className="text-2xl mr-3">🛒</div>
      <div className="text-base font-semibold">
        Second-Hand Store
      </div>
    </button>
  )
}

export default SecondHandStoreButton
