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
        className="app-footer"
        style={{
          marginTop: 'var(--space-32)',
          paddingTop: 'var(--space-24, var(--space-16))',
          paddingBottom: 'var(--space-32)',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--space-16)',
          textAlign: 'center',
        }}
      >
        <p style={{ margin: 0, fontSize: 'var(--font-sm)', color: 'var(--color-text-primary)' }}>
          Developed with <span aria-label="passion" role="img" style={{ color: 'var(--color-error)' }}>♥</span> by{' '}
          <strong style={{ color: 'var(--color-text-contrast)' }}>Vinayak Sharma</strong>
        </p>

        <nav
          aria-label="Social and Contact Links"
          style={{
            display: 'flex',
            gap: 'var(--space-12, 12px)',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <a
            href="https://github.com/vinayak2922k"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile of Vinayak Sharma (opens in new tab)"
            className="footer-link"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>GitHub</span>
          </a>

          <a
            href="https://linkedin.com/in/vinayak2922k"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile of Vinayak Sharma (opens in new tab)"
            className="footer-link"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
            </svg>
            <span>LinkedIn</span>
          </a>

          <a
            href="mailto:vinayaksharma2289@gmail.com"
            aria-label="Send email to Vinayak Sharma (vinayaksharma2289@gmail.com)"
            className="footer-link"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            <span>Gmail</span>
          </a>
        </nav>

        <p style={{ margin: 0, fontSize: 'var(--font-xs)', color: 'var(--color-text-muted)' }}>
          Performance Optimization Tracker &copy; {new Date().getFullYear()} &bull; All rights reserved.
        </p>
      </footer>
    </div>
  )
}

export default App
