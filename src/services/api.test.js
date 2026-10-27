import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  fetchEntries,
  addEntry,
  deleteEntry,
  setApiDelay,
  setFailureRate,
} from './api'

describe('Mock API (src/services/api.js)', () => {
  beforeEach(() => {
    localStorage.clear()
    setApiDelay(10, 20)
    setFailureRate(0)
  })

  afterEach(() => {
    localStorage.clear()
    setFailureRate(0)
  })

  it('fetches empty list when localStorage is empty', async () => {
    const entries = await fetchEntries()
    expect(entries).toEqual([])
  })

  it('adds an entry and persists it to localStorage', async () => {
    const newEntry = await addEntry({
      name: 'Server Response Time',
      metric: 'ttfb_ms',
      score: 90,
      notes: 'Initial measurement',
    })

    expect(newEntry.id).toBeDefined()
    expect(newEntry.name).toBe('Server Response Time')
    expect(newEntry.metric).toBe('ttfb_ms')
    expect(newEntry.score).toBe(90)
    expect(newEntry.createdAt).toBeDefined()

    const fetched = await fetchEntries()
    expect(fetched).toHaveLength(1)
    expect(fetched[0]).toEqual(newEntry)
  })

  it('deletes an entry from localStorage by ID', async () => {
    const entry1 = await addEntry({ name: 'Metric 1', metric: 'm1', score: 80 })
    const entry2 = await addEntry({ name: 'Metric 2', metric: 'm2', score: 85 })

    let fetched = await fetchEntries()
    expect(fetched).toHaveLength(2)

    await deleteEntry(entry1.id)

    fetched = await fetchEntries()
    expect(fetched).toHaveLength(1)
    expect(fetched[0].id).toBe(entry2.id)
  })

  it('simulates network failure when failure rate is set to 100%', async () => {
    setFailureRate(1.0)
    await expect(fetchEntries()).rejects.toThrow(/network error/i)
  })

  it('respects artificial delay configuration', async () => {
    setApiDelay(100, 100)
    const start = Date.now()
    await fetchEntries()
    const elapsed = Date.now() - start
    expect(elapsed).toBeGreaterThanOrEqual(90)
  })
})
