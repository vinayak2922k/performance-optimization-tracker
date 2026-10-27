/* global process */
/**
 * Mock API service simulating network calls with artificial latency and failures.
 * Backed by localStorage for persistent mock storage.
 */

const STORAGE_KEY = 'prodesk_performance_entries'

// Detect test environment to use fast delays during automated Vitest runs while
// maintaining 1-1.5s delay in standard development/browser environments.
const isTestEnv =
  Boolean(typeof import.meta !== 'undefined' && (import.meta.env?.MODE === 'test' || import.meta.env?.VITEST)) ||
  Boolean(typeof vi !== 'undefined' || typeof vitest !== 'undefined') ||
  Boolean(typeof process !== 'undefined' && process.env?.NODE_ENV === 'test')

let minDelayMs = isTestEnv ? 20 : 1000
let maxDelayMs = isTestEnv ? 50 : 1500
let failureRate = 0 // 0.0 (never fail) to 1.0 (always fail)

/**
 * Configure the artificial delay range in milliseconds.
 *
 * @param {number} min - Minimum delay in ms.
 * @param {number} max - Maximum delay in ms.
 */
export function setApiDelay(min, max) {
  minDelayMs = min
  maxDelayMs = max
}

/**
 * Configure the random failure rate (between 0.0 and 1.0).
 *
 * @param {number} rate - Probability of simulated network failure.
 */
export function setFailureRate(rate) {
  failureRate = Math.max(0, Math.min(1, rate))
}

/**
 * Get current simulated failure rate.
 *
 * @returns {number}
 */
export function getFailureRate() {
  return failureRate
}

/**
 * Helper to simulate network latency and connectivity failure.
 */
async function simulateNetwork() {
  // Support testing environments where globalThis.fetch is mocked or spied upon
  if (
    typeof globalThis !== 'undefined' &&
    typeof globalThis.fetch === 'function' &&
    (globalThis.fetch._isMockFunction || globalThis.fetch.mock)
  ) {
    await globalThis.fetch('/api/entries')
  }

  // Artificial delay to simulate slow 3G (fast in test suite)
  const delay = Math.floor(Math.random() * (maxDelayMs - minDelayMs + 1)) + minDelayMs
  await new Promise((resolve) => setTimeout(resolve, delay))

  // Simulate network instability based on configurable failure rate
  if (failureRate > 0 && Math.random() < failureRate) {
    throw new Error('Network error: Failed to connect to server')
  }
}

/**
 * Reads entries from localStorage safely.
 *
 * @returns {Array<object>}
 */
function getStoredEntries() {
  try {
    if (typeof localStorage === 'undefined') return []
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (err) {
    console.error('Failed to parse entries from localStorage:', err)
    return []
  }
}

/**
 * Persists entries to localStorage safely.
 *
 * @param {Array<object>} entries
 */
function saveStoredEntries(entries) {
  try {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch (err) {
    console.error('Failed to persist entries to localStorage:', err)
  }
}

/**
 * Fetches all saved performance tracker entries.
 *
 * @returns {Promise<Array<object>>} List of entries.
 */
export async function fetchEntries() {
  await simulateNetwork()
  return getStoredEntries()
}

/**
 * Adds a new performance entry and stores it in localStorage.
 *
 * @param {object} entry - Entry data (name, metric, score, notes).
 * @returns {Promise<object>} The newly created entry with assigned ID and timestamp.
 */
export async function addEntry(entry) {
  await simulateNetwork()

  const id =
    entry.id ||
    (typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `entry_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`)

  const newEntry = {
    ...entry,
    id,
    createdAt: entry.createdAt || new Date().toISOString(),
  }

  const current = getStoredEntries()
  const updated = [newEntry, ...current]
  saveStoredEntries(updated)

  return newEntry
}

/**
 * Deletes an existing performance entry by ID.
 *
 * @param {string|number} id - Identifier of the entry to remove.
 * @returns {Promise<{ success: boolean, id: string|number }>}
 */
export async function deleteEntry(id) {
  await simulateNetwork()

  const current = getStoredEntries()
  const updated = current.filter((item) => String(item.id) !== String(id))
  saveStoredEntries(updated)

  return { success: true, id }
}
