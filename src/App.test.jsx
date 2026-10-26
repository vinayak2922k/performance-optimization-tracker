import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import App from './App'

describe('Performance Optimization Tracker', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('1. EntryForm', () => {
    it('ensures all input fields have associated accessible labels', () => {
      render(<App />)
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/metric/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/score/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/notes/i)).toBeInTheDocument()
    })

    it('blocks submit and marks invalid fields (aria-invalid="true") when data is missing or malformed', async () => {
      const user = userEvent.setup()
      render(<App />)

      const submitButton = screen.getByRole('button', { name: /add entry|submit|save/i })
      await user.click(submitButton)

      const nameInput = screen.getByLabelText(/name/i)
      const metricInput = screen.getByLabelText(/metric/i)
      const scoreInput = screen.getByLabelText(/score/i)

      // Required fields must be marked aria-invalid="true" on empty submission
      expect(nameInput).toHaveAttribute('aria-invalid', 'true')
      expect(metricInput).toHaveAttribute('aria-invalid', 'true')
      expect(scoreInput).toHaveAttribute('aria-invalid', 'true')

      // Malformed inputs: name too short (<2 chars) and score non-numeric "abc"
      await user.type(nameInput, 'A')
      await user.type(scoreInput, 'abc')
      await user.click(submitButton)

      expect(nameInput).toHaveAttribute('aria-invalid', 'true')
      expect(scoreInput).toHaveAttribute('aria-invalid', 'true')
    })

    it('submits valid data when form is properly filled', async () => {
      const user = userEvent.setup()
      render(<App />)

      const nameInput = screen.getByLabelText(/name/i)
      const metricInput = screen.getByLabelText(/metric/i)
      const scoreInput = screen.getByLabelText(/score/i)
      const notesInput = screen.getByLabelText(/notes/i)
      const submitButton = screen.getByRole('button', { name: /add entry|submit|save/i })

      await user.type(nameInput, 'Page Load Time')
      await user.type(metricInput, 'latency_ms')
      await user.type(scoreInput, '85')
      await user.type(notesInput, 'Optimized bundle size')
      await user.click(submitButton)

      expect(nameInput).not.toHaveAttribute('aria-invalid', 'true')
      expect(await screen.findByText('Page Load Time')).toBeInTheDocument()
    })
  })

  describe('2. EntryList', () => {
    it('shows "No data found" when empty', async () => {
      render(<App />)
      expect(await screen.findByText(/no data found/i)).toBeInTheDocument()
    })

    it('shows items otherwise when data is present', async () => {
      const user = userEvent.setup()
      render(<App />)

      await user.type(screen.getByLabelText(/name/i), 'Server Response Time')
      await user.type(screen.getByLabelText(/metric/i), 'ttfb_ms')
      await user.type(screen.getByLabelText(/score/i), '92')
      await user.click(screen.getByRole('button', { name: /add entry|submit|save/i }))

      expect(await screen.findByText('Server Response Time')).toBeInTheDocument()
      expect(screen.getByText('ttfb_ms')).toBeInTheDocument()
      expect(screen.queryByText(/no data found/i)).not.toBeInTheDocument()
    })
  })

  describe('3. Search', () => {
    it('shows "No data found" when filtering with no matches', async () => {
      const user = userEvent.setup()
      render(<App />)

      const searchInput = screen.getByPlaceholderText(/search/i)
      await user.type(searchInput, 'NonExistentQueryXYZ999')

      expect(await screen.findByText(/no data found/i)).toBeInTheDocument()
    })
  })

  describe('4. Loading', () => {
    it('displays a visible loading indicator (role="status") during async fetch and disappears after', async () => {
      render(<App />)

      const loadingIndicator = screen.getByRole('status')
      expect(loadingIndicator).toBeInTheDocument()
      expect(loadingIndicator).toBeVisible()

      await waitForElementToBeRemoved(() => screen.queryByRole('status'))
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })
  })

  describe('5. Error state', () => {
    it('shows an error message with a Retry button when simulated fetch fails', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Simulated network failure'))

      render(<App />)

      expect(await screen.findByText(/error|failed to load|failed to fetch/i)).toBeInTheDocument()
      const retryButton = screen.getByRole('button', { name: /retry/i })
      expect(retryButton).toBeInTheDocument()
    })
  })

  describe('6. Analytics', () => {
    it('calls console.log with "[Analytics] User interacted with Performance Optimization" after a successful add', async () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const user = userEvent.setup()
      render(<App />)

      await user.type(screen.getByLabelText(/name/i), 'LCP Optimization')
      await user.type(screen.getByLabelText(/metric/i), 'lcp_seconds')
      await user.type(screen.getByLabelText(/score/i), '95')
      await user.type(screen.getByLabelText(/notes/i), 'Hero image preloaded')
      await user.click(screen.getByRole('button', { name: /add entry|submit|save/i }))

      expect(logSpy).toHaveBeenCalledWith('[Analytics] User interacted with Performance Optimization')
      logSpy.mockRestore()
    })
  })

  describe('7. Keyboard', () => {
    it('allows form completion using Tab and submission with Enter', async () => {
      const user = userEvent.setup()
      render(<App />)

      await user.tab()
      expect(document.activeElement).toBe(screen.getByLabelText(/name/i))
      await user.keyboard('Cumulative Layout Shift')

      await user.tab()
      expect(document.activeElement).toBe(screen.getByLabelText(/metric/i))
      await user.keyboard('cls_score')

      await user.tab()
      expect(document.activeElement).toBe(screen.getByLabelText(/score/i))
      await user.keyboard('99')

      await user.tab()
      expect(document.activeElement).toBe(screen.getByLabelText(/notes/i))
      await user.keyboard('Added explicit image dimensions')

      await user.keyboard('{Enter}')

      expect(await screen.findByText('Cumulative Layout Shift')).toBeInTheDocument()
    })
  })
})
