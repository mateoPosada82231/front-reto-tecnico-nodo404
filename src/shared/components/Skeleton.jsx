import useContent from '../hooks/useContent'

function Skeleton({ className = '' }) {
  const { content } = useContent('common')

  return (
    <div
      role="status"
      aria-label={content.loading_aria}
      className={`animate-pulse rounded-xl bg-surface ${className}`}
    />
  )
}

export default Skeleton
