import { sanitizeInput } from '../utils/sanitizeInput'

/**
 * SearchBar component to filter performance tracker entries.
 *
 * @param {{ value: string, onChange: (value: string) => void }} props
 */
export function SearchBar({ value, onChange }) {
  const handleChange = (e) => {
    // Sanitize input before passing to state while preserving space during typing
    const sanitized = sanitizeInput(e.target.value, { trim: false })
    onChange(sanitized)
  }

  return (
    <div
      className="search-bar-container"
      style={{
        margin: 'var(--space-16) 0',
      }}
    >
      <label
        htmlFor="search-input"
        style={{
          display: 'block',
          marginBottom: 'var(--space-8)',
          fontSize: 'var(--font-sm)',
          fontWeight: 600,
          color: 'var(--color-text-contrast)',
        }}
      >
        Search Entries
      </label>
      <input
        id="search-input"
        type="search"
        placeholder="Search entries..."
        value={value}
        onChange={handleChange}
        style={{
          width: '100%',
          boxSizing: 'border-box',
        }}
      />
    </div>
  )
}

export default SearchBar
