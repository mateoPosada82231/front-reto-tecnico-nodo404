function Skeleton({ className = '' }) {
  return <div role="status" aria-label="Cargando" className={`animate-pulse rounded-md bg-slate-200 ${className}`} />
}

export default Skeleton
