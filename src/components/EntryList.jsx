import { memo } from 'react'
import { EmptyState } from './EmptyState'

/**
 * EntryList component rendering tabular entries or an EmptyState placeholder.
 * Wrapped in React.memo to skip re-rendering when entries and onDelete are unchanged.
 *
 * @param {{ entries: Array<object>, onDelete?: (id: string|number) => void }} props
 */
export const EntryList = memo(function EntryList({ entries = [], onDelete }) {
  if (!entries || entries.length === 0) {
    return <EmptyState message="No data found" />
  }

  return (
    <div className="entry-list-container" style={{ overflowX: 'auto' }}>
      <table aria-label="Performance Optimization Entries">
        <caption className="sr-only">Performance Optimization Entries</caption>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Metric</th>
            <th scope="col">Score</th>
            <th scope="col">Notes</th>
            {onDelete && <th scope="col">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id || `${entry.name}-${entry.metric}`}>
              <td style={{ fontWeight: 600 }}>{entry.name}</td>
              <td>
                <code
                  style={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    padding: '2px var(--space-8)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 'var(--font-sm)',
                  }}
                >
                  {entry.metric}
                </code>
              </td>
              <td>{entry.score}</td>
              <td style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-sm)' }}>
                {entry.notes || '—'}
              </td>
              {onDelete && (
                <td>
                  <button
                    type="button"
                    onClick={() => onDelete(entry.id)}
                    style={{
                      padding: 'var(--space-8)',
                      fontSize: 'var(--font-xs)',
                    }}
                    aria-label={`Delete entry ${entry.name}`}
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
})

export default EntryList
