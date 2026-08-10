import LoadingSpinner from './LoadingSpinner'
import ErrorBanner from './ErrorBanner'
import EmptyState from './EmptyState'
export default function StateView({ loading, error, data, emptyMessage, emptyActionLabel, emptyActionTo, onRetry, children }) {
  if (loading) return <LoadingSpinner />
  if (error) return <ErrorBanner message={error} onRetry={onRetry} />
  if (!data || (Array.isArray(data) && data.length === 0)) return <EmptyState message={emptyMessage} actionLabel={emptyActionLabel} actionTo={emptyActionTo} />
  return <>{children(data)}</>
}
