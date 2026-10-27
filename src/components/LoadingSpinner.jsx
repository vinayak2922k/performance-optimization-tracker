/**
 * LoadingSpinner component displaying an accessible status indicator during async fetches.
 */
export function LoadingSpinner() {
  return (
    <div
      role="status"
      className="loading-spinner"
      aria-live="polite"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-8)',
        padding: 'var(--space-32) var(--space-16)',
        color: 'var(--color-text-muted)',
        fontSize: 'var(--font-base)',
      }}
    >
      <div
        className="spinner-icon"
        aria-hidden="true"
        style={{
          width: '20px',
          height: '20px',
          border: '2px solid var(--color-border)',
          borderTopColor: 'var(--color-text-contrast)',
          borderRadius: 'var(--radius-full)',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <span>Loading entries...</span>
    </div>
  )
}

export default LoadingSpinner
