import '@testing-library/jest-dom/vitest'
import { beforeEach } from 'vitest'

// Ensure clean state isolation across test suites
beforeEach(() => {
  if (typeof localStorage !== 'undefined') {
    localStorage.clear()
  }
})
