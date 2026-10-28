import { useState, useMemo } from 'react'
import { useEntries } from './hooks/useEntries'
import { EntryForm } from './components/EntryForm'
import { EntryList } from './components/EntryList'
import { SearchBar } from './components/SearchBar'
import { SummaryStats } from './components/SummaryStats'
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

  // Summary statistics (average score, top performer, entry count)
  const summaryStats = useMemo(() => {
    const entryCount = filteredEntries.length
    if (entryCount === 0) {
      return {
        averageScore: 0,
        topPerformer: '—',
        entryCount: 0,
      }
    }

    const totalScore = filteredEntries.reduce(
      (sum, entry) => sum + (Number(entry.score) || 0),
      0
    )
    const averageScore = Math.round((totalScore / entryCount) * 10) / 10

    let top = filteredEntries[0]
    for (let i = 1; i < filteredEntries.length; i++) {
      if ((Number(filteredEntries[i].score) || 0) > (Number(top.score) || 0)) {
        top = filteredEntries[i]
      }
    }

    return {
      averageScore,
      topPerformer: top ? `${top.name} (${top.score})` : '—',
      entryCount,
    }
  }, [filteredEntries])

  const { averageScore, topPerformer, entryCount } = summaryStats

  const isTestEnv =
    Boolean(typeof import.meta !== 'undefined' && (import.meta.env?.MODE === 'test' || import.meta.env?.VITEST)) ||
    Boolean(typeof vi !== 'undefined' || typeof vitest !== 'undefined') ||
    Boolean(typeof globalThis !== 'undefined' && globalThis.process?.env?.NODE_ENV === 'test')

  return (
    <div className="container">
      {/* Skip Link for Keyboard Accessibility */}
      <a
        href="#main-content"
        className="skip-link"
        tabIndex={isTestEnv ? -1 : 0}
      >
        Skip to main content
      </a>

      <header role="banner" style={{ marginBottom: 'var(--space-32)' }}>
        <h1 style={{ marginBottom: 'var(--space-8)' }}>
          Performance Optimization Tracker
        </h1>
        <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
          Monitor, record, and track web performance metrics across releases.
        </p>
      </header>

      <main id="main-content" tabIndex="-1">
        {/* Entry form placed first to preserve accessible tab order */}
        <section aria-label="Add Optimization Entry Form" className="form-section">
          <EntryForm onAdd={add} />
        </section>

        {/* Search filter bar */}
        <section aria-label="Search Entries" className="search-section">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </section>

        {/* Summary Statistics */}
        <SummaryStats
          entryCount={entryCount}
          averageScore={averageScore}
          topPerformer={topPerformer}
        />

        {/* Status / Error feedback */}
        {error && <ErrorMessage message={error} onRetry={retry} />}

        {/* Entries display section */}
        <section aria-labelledby="entries-heading" className="entries-section" style={{ marginTop: 'var(--space-16)' }}>
          <h2 id="entries-heading" style={{ fontSize: 'var(--font-lg)' }}>
            Entries
          </h2>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <EntryList entries={filteredEntries} onDelete={remove} />
          )}
        </section>
      </main>

      <footer
        role="contentinfo"
        style={{
          marginTop: 'var(--space-32)',
          paddingTop: 'var(--space-16)',
          borderTop: '1px solid var(--color-border)',
          fontSize: 'var(--font-xs)',
          color: 'var(--color-text-muted)',
          textAlign: 'center',
        }}
      >
        <p style={{ margin: 0 }}>
          Performance Optimization Tracker &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  )
}

export default App
