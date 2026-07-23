function Skeleton({ className = '' }) {
  return (
    <div
      role="status"
      aria-label="Cargando"
      className={`animate-pulse rounded-xl bg-surface ${className}`}
    />
  )
}

export default Skeleton
