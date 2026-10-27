/**
 * Validates a performance tracker entry record.
 *
 * Validation rules:
 * - name: required string, between 2 and 50 characters (excluding leading/trailing whitespace).
 * - metric: required non-empty string.
 * - score: required numeric value between 0 and 100 (inclusive, decimals allowed).
 * - notes: optional string, maximum 200 characters if provided.
 *
 * @param {object|null|undefined} entry - The entry object to validate.
 * @returns {Record<string, string>} Object containing validation error messages per field. Empty object if valid.
 */
export function validateEntry(entry) {
  const errors = {}

  // Handle null, undefined, or non-object root inputs gracefully
  if (!entry || typeof entry !== 'object') {
    errors.name = 'Name is required'
    errors.metric = 'Metric is required'
    errors.score = 'Score is required'
    return errors
  }

  // 1. Name validation
  if (entry.name === undefined || entry.name === null) {
    errors.name = 'Name is required'
  } else if (typeof entry.name !== 'string') {
    errors.name = 'Name must be a string'
  } else {
    // Trim before length checks to catch whitespace-only inputs and enforce visible character bounds
    const trimmedName = entry.name.trim()
    if (trimmedName.length < 2) {
      errors.name = 'Name must be at least 2 characters long'
    } else if (trimmedName.length > 50) {
      errors.name = 'Name cannot exceed 50 characters'
    }
  }

  // 2. Metric validation
  if (entry.metric === undefined || entry.metric === null) {
    errors.metric = 'Metric is required'
  } else if (typeof entry.metric !== 'string') {
    errors.metric = 'Metric must be a string'
  } else if (entry.metric.trim().length === 0) {
    errors.metric = 'Metric cannot be empty'
  }

  // 3. Score validation (must explicitly check type because 0 is falsy in JavaScript)
  if (entry.score === undefined || entry.score === null) {
    errors.score = 'Score is required'
  } else if (typeof entry.score !== 'number' || Number.isNaN(entry.score)) {
    errors.score = 'Score must be a number'
  } else if (entry.score < 0 || entry.score > 100) {
    errors.score = 'Score must be between 0 and 100'
  }

  // 4. Notes validation (optional, but if supplied must be a string of at most 200 characters)
  if (entry.notes !== undefined) {
    if (typeof entry.notes !== 'string') {
      errors.notes = 'Notes must be a string'
    } else if (entry.notes.length > 200) {
      errors.notes = 'Notes cannot exceed 200 characters'
    }
  }

  return errors
}

export default validateEntry
