import { useState, useMemo } from 'react'
import { useEntries } from './hooks/useEntries'
import { EntryForm } from './components/EntryForm'
import { EntryList } from './components/EntryList'
import { SearchBar } from './components/SearchBar'
import { LoadingSpinner } from './components/LoadingSpinner'
import { ErrorMessage } from './components/ErrorMessage'
import './styles/base.css'

export function App() {
  const { entries, loading, error, add, remove, retry } = useEntries()
  const [searchQuery, setSearchQuery] = useState('')

  // Filter entries based on search input
  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return entries
    const q = searchQuery.toLowerCase()
    return entries.filter(
      (entry) =>
        entry.name?.toLowerCase().includes(q) ||
        entry.metric?.toLowerCase().includes(q) ||
        entry.notes?.toLowerCase().includes(q)
    )
  }, [entries, searchQuery])

  return (
    <div className="container">
      <header style={{ marginBottom: 'var(--space-32)' }}>
        <h1 style={{ marginBottom: 'var(--space-8)' }}>
          Performance Optimization Tracker
        </h1>
        <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
          Monitor, record, and track web performance metrics across releases.
        </p>
      </header>

      <main>
        {/* Entry form placed first to preserve accessible tab order */}
        <section className="form-section">
          <EntryForm onAdd={add} />
        </section>

        {/* Search filter bar */}
        <section className="search-section">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </section>

        {/* Status / Error feedback */}
        {error && <ErrorMessage message={error} onRetry={retry} />}

        {/* Entries display section */}
        <section className="entries-section" style={{ marginTop: 'var(--space-16)' }}>
          <h2 style={{ fontSize: 'var(--font-lg)' }}>
            Entries
          </h2>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <EntryList entries={filteredEntries} onDelete={remove} />
          )}
        </section>
      </main>
    </div>
  )
}

export default App
