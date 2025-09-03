interface PublicGalleryButtonProps {
  onClick: () => void
}

const PublicGalleryButton = ({ onClick }: PublicGalleryButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-xl flex items-center justify-start p-3 text-white hover:scale-105 active:scale-95 transition-all duration-300"
              style={{height: '41px', background: 'linear-gradient(135deg, #64748b 0%, #475569 50%, #334155 100%)'}}
      aria-label="Public Gallery"
    >
      <div className="text-2xl mr-3">🌐</div>
              <div className="text-2xl font-semibold">
        Public Gallery
      </div>
    </button>
  )
}

export default PublicGalleryButton
