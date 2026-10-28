import { memo } from 'react'

/**
 * SummaryStats component displaying aggregate metrics: entry count, average score, and top performer.
 * Wrapped in React.memo to prevent re-renders when parent state updates but stats remain unchanged.
 *
 * @param {{ entryCount: number, averageScore: number, topPerformer: string }} props
 */
export const SummaryStats = memo(function SummaryStats({
  entryCount,
  averageScore,
  topPerformer,
}) {
  return (
    <section
      aria-label="Summary Statistics"
      className="summary-stats"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 'var(--space-16)',
        margin: 'var(--space-16) 0',
      }}
    >
      <div
        className="stat-card"
        style={{
          padding: 'var(--space-16)',
          backgroundColor: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
        }}
      >
        <span
          style={{
            display: 'block',
            fontSize: 'var(--font-xs)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--color-text-muted)',
            marginBottom: 'var(--space-8)',
          }}
        >
          Entry Count
        </span>
        <span
          style={{
            fontSize: 'var(--font-xl)',
            fontWeight: 700,
            color: 'var(--color-text-contrast)',
          }}
        >
          {entryCount}
        </span>
      </div>

      <div
        className="stat-card"
        style={{
          padding: 'var(--space-16)',
          backgroundColor: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
        }}
      >
        <span
          style={{
            display: 'block',
            fontSize: 'var(--font-xs)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--color-text-muted)',
            marginBottom: 'var(--space-8)',
          }}
        >
          Average Score
        </span>
        <span
          style={{
            fontSize: 'var(--font-xl)',
            fontWeight: 700,
            color: 'var(--color-text-contrast)',
          }}
        >
          {averageScore}
        </span>
      </div>

      <div
        className="stat-card"
        style={{
          padding: 'var(--space-16)',
          backgroundColor: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
        }}
      >
        <span
          style={{
            display: 'block',
            fontSize: 'var(--font-xs)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--color-text-muted)',
            marginBottom: 'var(--space-8)',
          }}
        >
          Top Performer
        </span>
        <span
          style={{
            fontSize: 'var(--font-base)',
            fontWeight: 600,
            color: 'var(--color-text-contrast)',
          }}
        >
          {topPerformer}
        </span>
      </div>
    </section>
  )
})

export default SummaryStats
