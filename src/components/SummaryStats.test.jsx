import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import SummaryStats from './SummaryStats'

describe('SummaryStats Component', () => {
  it('renders default empty summary metrics properly', () => {
    render(<SummaryStats entryCount={0} averageScore={0} topPerformer="—" />)

    expect(screen.getByText(/entry count/i)).toBeInTheDocument()
    expect(screen.getByText(/average score/i)).toBeInTheDocument()
    expect(screen.getByText(/top performer/i)).toBeInTheDocument()
    expect(screen.getAllByText('0')).toHaveLength(2)
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('renders populated metrics accurately', () => {
    render(
      <SummaryStats
        entryCount={3}
        averageScore={88.5}
        topPerformer="Server Response Time (95)"
      />
    )

    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('88.5')).toBeInTheDocument()
    expect(screen.getByText('Server Response Time (95)')).toBeInTheDocument()
  })
})
