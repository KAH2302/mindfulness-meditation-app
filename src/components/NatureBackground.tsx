interface NatureBackgroundProps {
  image: string
  video?: string
  className?: string
}

export function NatureBackground({ image, video, className = '' }: NatureBackgroundProps) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {video ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={image}
        >
          <source src={video} type="video/mp4" />
        </video>
      ) : (
        <img
          src={image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover scale-105"
        />
      )}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(8,14,11,0.35) 0%, rgba(8,14,11,0.55) 45%, rgba(8,14,11,0.78) 100%)',
        }}
      />
    </div>
  )
}
