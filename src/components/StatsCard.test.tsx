import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatsCard } from './StatsCard'

describe('StatsCard', () => {
  it('should render title and value', () => {
    render(<StatsCard title="Test Title" value={123} />)
    
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('123')).toBeInTheDocument()
  })

  it('should render subtitle when provided', () => {
    render(<StatsCard title="Test Title" value={123} subtitle="Subtitle" />)
    
    expect(screen.getByText('Subtitle')).toBeInTheDocument()
  })

  it('should render icon when provided', () => {
    render(<StatsCard title="Test Title" value={123} icon="🔥" />)
    
    expect(screen.getByText('🔥')).toBeInTheDocument()
  })
})

