import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useEntries } from './useEntries'
import * as api from '../services/api'

describe('useEntries hook', () => {
  beforeEach(() => {
    localStorage.clear()
    api.setApiDelay(10, 20)
    api.setFailureRate(0)
    vi.restoreAllMocks()
  })

  afterEach(() => {
    localStorage.clear()
    api.setFailureRate(0)
    vi.restoreAllMocks()
  })

  it('exposes initial loading state and loads empty entries', async () => {
    const { result } = renderHook(() => useEntries())

    expect(result.current.loading).toBe(true)
    expect(result.current.entries).toEqual([])
    expect(result.current.error).toBeNull()

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.entries).toEqual([])
  })

  it('adds an entry and updates the entries list', async () => {
    const { result } = renderHook(() => useEntries())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await act(async () => {
      await result.current.add({
        name: 'First Contentful Paint',
        metric: 'fcp_ms',
        score: 88,
      })
    })

    expect(result.current.entries).toHaveLength(1)
    expect(result.current.entries[0].name).toBe('First Contentful Paint')
  })

  it('removes an entry by ID', async () => {
    const { result } = renderHook(() => useEntries())

    let added
    await act(async () => {
      added = await result.current.add({
        name: 'Cumulative Layout Shift',
        metric: 'cls',
        score: 95,
      })
    })

    expect(result.current.entries).toHaveLength(1)

    await act(async () => {
      await result.current.remove(added.id)
    })

    expect(result.current.entries).toHaveLength(0)
  })

  it('captures fetch errors and recovers with retry', async () => {
    vi.spyOn(api, 'fetchEntries').mockRejectedValueOnce(new Error('Simulated network timeout'))

    const { result } = renderHook(() => useEntries())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Simulated network timeout')

    // Retry should trigger refetch
    await act(async () => {
      await result.current.retry()
    })

    expect(result.current.error).toBeNull()
    expect(result.current.entries).toEqual([])
  })

  it('maintains stable handler references across re-renders (useCallback)', async () => {
    const { result, rerender } = renderHook(() => useEntries())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const initialAdd = result.current.add
    const initialRemove = result.current.remove
    const initialRetry = result.current.retry

    rerender()

    expect(result.current.add).toBe(initialAdd)
    expect(result.current.remove).toBe(initialRemove)
    expect(result.current.retry).toBe(initialRetry)
  })
})
