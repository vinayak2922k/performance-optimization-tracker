/**
 * EmptyState component displayed when entries list is empty or search filters yield no results.
 */
export function EmptyState({ message = 'No data found' }) {
  return (
    <div
      className="empty-state"
      style={{
        textAlign: 'center',
        padding: 'var(--space-32) var(--space-16)',
        color: 'var(--color-text-muted)',
        background: 'var(--color-bg-secondary)',
        border: '1px dashed var(--color-border)',
        borderRadius: 'var(--radius-md)',
        margin: 'var(--space-16) 0',
      }}
    >
      <p style={{ margin: 0, fontSize: 'var(--font-base)' }}>{message}</p>
    </div>
  )
}

export default EmptyState
