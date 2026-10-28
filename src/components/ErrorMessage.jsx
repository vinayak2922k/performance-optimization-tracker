/**
 * ErrorMessage component displaying error status and retry action button.
 *
 * @param {{ message?: string, onRetry?: () => void }} props
 */
export function ErrorMessage({ message = 'Failed to load entries', onRetry }) {
  // Ensure the error text clearly identifies as an error if not already phrased as one
  const displayMessage =
    message.toLowerCase().includes('error') ||
    message.toLowerCase().includes('failed')
      ? message
      : `Error: ${message}`

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="error-state"
      style={{
        padding: 'var(--space-16)',
        border: '1px solid var(--color-error)',
        borderRadius: 'var(--radius-sm)',
        background: 'var(--color-bg-secondary)',
        margin: 'var(--space-16) 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 'var(--space-16)',
      }}
    >
      <p style={{ margin: 0, color: 'var(--color-error)', fontSize: 'var(--font-sm)' }}>
        {displayMessage}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          aria-label="Retry loading performance entries"
          style={{
            borderColor: 'var(--color-error)',
            color: 'var(--color-error)',
            padding: 'var(--space-8) var(--space-16)',
            fontSize: 'var(--font-sm)',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          Retry
        </button>
      )}
    </div>
  )
}

export default ErrorMessage
