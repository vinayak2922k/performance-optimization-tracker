import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App Component', () => {
  it('renders the initial heading and handles click counter', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByText(/Get started/i)).toBeInTheDocument()

    const counterButton = screen.getByRole('button', { name: /Count is 0/i })
    expect(counterButton).toBeInTheDocument()

    await user.click(counterButton)
    expect(screen.getByRole('button', { name: /Count is 1/i })).toBeInTheDocument()
  })
})
