import { useState, useEffect, useCallback } from 'react'
import { fetchEntries, addEntry, deleteEntry } from '../services/api'

/**
 * Custom hook to manage performance optimization tracker entries.
 *
 * Exposes:
 * - entries: Array of current entries.
 * - loading: Boolean indicating whether an async operation is currently in flight.
 * - error: Error message string or null.
 * - add: Function to persist a new entry.
 * - remove: Function to delete an entry by ID.
 * - retry: Function to re-trigger fetching entries after a failure.
 *
 * All mutator/action handlers are wrapped in useCallback for stable references.
 */
export function useEntries() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch entries from mock API, updating state accordingly
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchEntries()
      setEntries(data)
      return data
    } catch (err) {
      const message = err?.message || 'Failed to fetch entries'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial data load on mount (loading is initialized to true in useState)
  useEffect(() => {
    let ignore = false

    async function initialFetch() {
      try {
        const data = await fetchEntries()
        if (!ignore) {
          setEntries(data)
        }
      } catch (err) {
        if (!ignore) {
          setError(err?.message || 'Failed to fetch entries')
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    initialFetch()

    return () => {
      ignore = true
    }
  }, [])

  // Handler to add a new entry
  const add = useCallback(async (entryData) => {
    setLoading(true)
    setError(null)
    try {
      const created = await addEntry(entryData)
      setEntries((prev) => [created, ...prev])
      return created
    } catch (err) {
      const message = err?.message || 'Failed to add entry'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Handler to remove an entry by ID
  const remove = useCallback(async (id) => {
    setLoading(true)
    setError(null)
    try {
      await deleteEntry(id)
      setEntries((prev) => prev.filter((item) => String(item.id) !== String(id)))
      return id
    } catch (err) {
      const message = err?.message || 'Failed to delete entry'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Handler to retry fetching entries
  const retry = useCallback(() => {
    return fetchData()
  }, [fetchData])

  return {
    entries,
    loading,
    error,
    add,
    remove,
    retry,
  }
}

export default useEntries
