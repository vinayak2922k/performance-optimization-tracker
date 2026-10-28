import { useState, useRef, memo } from 'react'
import { sanitizeInput } from '../utils/sanitizeInput'
import { validateEntry } from '../utils/validateEntry'

/**
 * EntryForm component allowing users to add performance optimization tracker records.
 * Wrapped in React.memo to prevent re-rendering on parent updates (e.g. typing in search).
 *
 * Enforces:
 * - Sanitizing inputs before updating state.
 * - Field-level validation on submission.
 * - aria-invalid and aria-describedby for accessible error linkage.
 * - Focus management on validation failure and successful submit.
 * - Live region feedback for assistive technologies.
 * - Logging analytics event on successful creation.
 *
 * @param {{ onAdd: (entry: object) => void }} props
 */
export const EntryForm = memo(function EntryForm({ onAdd }) {
  const [name, setName] = useState('')
  const [metric, setMetric] = useState('')
  const [score, setScore] = useState('')
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState({})
  const [statusMessage, setStatusMessage] = useState('')

  const nameInputRef = useRef(null)
  const metricInputRef = useRef(null)
  const scoreInputRef = useRef(null)

  const handleNameChange = (e) => {
    // Sanitize input before state while preserving whitespace during typing
    setName(sanitizeInput(e.target.value, { trim: false }))
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: undefined }))
    }
  }

  const handleMetricChange = (e) => {
    setMetric(sanitizeInput(e.target.value, { trim: false }))
    if (errors.metric) {
      setErrors((prev) => ({ ...prev, metric: undefined }))
    }
  }

  const handleScoreChange = (e) => {
    setScore(sanitizeInput(e.target.value, { trim: false }))
    if (errors.score) {
      setErrors((prev) => ({ ...prev, score: undefined }))
    }
  }

  const handleNotesChange = (e) => {
    setNotes(sanitizeInput(e.target.value, { trim: false }))
    if (errors.notes) {
      setErrors((prev) => ({ ...prev, notes: undefined }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Parse score to feed into validateEntry
    const rawScore = score.trim()
    let parsedScore
    if (rawScore === '') {
      parsedScore = undefined
    } else {
      const num = Number(rawScore)
      parsedScore = Number.isNaN(num) ? rawScore : num
    }

    const validationErrors = validateEntry({
      name,
      metric,
      score: parsedScore,
      notes: notes || undefined,
    })

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      // Focus the first invalid field for seamless keyboard accessibility
      if (validationErrors.name) {
        nameInputRef.current?.focus()
      } else if (validationErrors.metric) {
        metricInputRef.current?.focus()
      } else if (validationErrors.score) {
        scoreInputRef.current?.focus()
      }
      return
    }

    setErrors({})

    const newEntry = {
      name: sanitizeInput(name),
      metric: sanitizeInput(metric),
      score: Number(score),
      notes: notes ? sanitizeInput(notes) : '',
    }

    onAdd(newEntry)

    // Analytics interaction logging
    console.log('[Analytics] User interacted with Performance Optimization')

    // Reset inputs
    setName('')
    setMetric('')
    setScore('')
    setNotes('')
    setStatusMessage(`Entry "${newEntry.name}" added successfully.`)

    // Focus management: return focus to the first form input after submission
    nameInputRef.current?.focus()
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="entry-form"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-16)',
        padding: 'var(--space-16)',
        backgroundColor: 'var(--color-bg-secondary)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        marginBottom: 'var(--space-32)',
      }}
    >
      <h2 style={{ fontSize: 'var(--font-lg)', margin: '0 0 var(--space-8)' }}>
        Add Optimization Entry
      </h2>

      {/* Accessible Live Feedback Announcement */}
      {statusMessage && (
        <div role="status" aria-live="polite" className="sr-only">
          {statusMessage}
        </div>
      )}

      {/* Name Field */}
      <div className="form-group">
        <label
          htmlFor="entry-name"
          style={{
            display: 'block',
            marginBottom: 'var(--space-8)',
            fontSize: 'var(--font-sm)',
            fontWeight: 600,
            color: 'var(--color-text-contrast)',
          }}
        >
          Name
        </label>
        <input
          ref={nameInputRef}
          id="entry-name"
          name="name"
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="e.g. Page Load Time"
          aria-invalid={errors.name ? 'true' : undefined}
          aria-describedby={errors.name ? 'entry-name-error' : undefined}
        />
        {errors.name && (
          <span id="entry-name-error" className="error-message" role="alert">
            {errors.name}
          </span>
        )}
      </div>

      {/* Metric Field */}
      <div className="form-group">
        <label
          htmlFor="entry-metric"
          style={{
            display: 'block',
            marginBottom: 'var(--space-8)',
            fontSize: 'var(--font-sm)',
            fontWeight: 600,
            color: 'var(--color-text-contrast)',
          }}
        >
          Metric
        </label>
        <input
          ref={metricInputRef}
          id="entry-metric"
          name="metric"
          type="text"
          value={metric}
          onChange={handleMetricChange}
          placeholder="e.g. latency_ms"
          aria-invalid={errors.metric ? 'true' : undefined}
          aria-describedby={errors.metric ? 'entry-metric-error' : undefined}
        />
        {errors.metric && (
          <span id="entry-metric-error" className="error-message" role="alert">
            {errors.metric}
          </span>
        )}
      </div>

      {/* Score Field */}
      <div className="form-group">
        <label
          htmlFor="entry-score"
          style={{
            display: 'block',
            marginBottom: 'var(--space-8)',
            fontSize: 'var(--font-sm)',
            fontWeight: 600,
            color: 'var(--color-text-contrast)',
          }}
        >
          Score (0-100)
        </label>
        <input
          ref={scoreInputRef}
          id="entry-score"
          name="score"
          type="text"
          value={score}
          onChange={handleScoreChange}
          placeholder="e.g. 85"
          aria-invalid={errors.score ? 'true' : undefined}
          aria-describedby={errors.score ? 'entry-score-error' : undefined}
        />
        {errors.score && (
          <span id="entry-score-error" className="error-message" role="alert">
            {errors.score}
          </span>
        )}
      </div>

      {/* Notes Field */}
      <div className="form-group">
        <label
          htmlFor="entry-notes"
          style={{
            display: 'block',
            marginBottom: 'var(--space-8)',
            fontSize: 'var(--font-sm)',
            fontWeight: 600,
            color: 'var(--color-text-contrast)',
          }}
        >
          Notes (Optional)
        </label>
        <input
          id="entry-notes"
          name="notes"
          type="text"
          value={notes}
          onChange={handleNotesChange}
          placeholder="e.g. Monitored across all read replicas"
          aria-invalid={errors.notes ? 'true' : undefined}
          aria-describedby={errors.notes ? 'entry-notes-error' : undefined}
        />
        {errors.notes && (
          <span id="entry-notes-error" className="error-message" role="alert">
            {errors.notes}
          </span>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        style={{
          marginTop: 'var(--space-8)',
          background: 'var(--color-text-contrast)',
          color: 'var(--color-white)',
          borderColor: 'var(--color-text-contrast)',
        }}
      >
        Add Entry
      </button>
    </form>
  )
})

export default EntryForm
