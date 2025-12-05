import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrandHeader } from '@/components/BrandHeader'

describe('BrandHeader', () => {
  it('should render with default props', () => {
    render(<BrandHeader />)
    const link = screen.getByRole('link', { name: /vlockster.*ir al inicio/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/')
  })

  it('should render with text when showText is true', () => {
    render(<BrandHeader showText={true} />)
    const text = screen.getByText('VLOCKSTER')
    expect(text).toBeInTheDocument()
  })

  it('should not render text when showText is false', () => {
    render(<BrandHeader showText={false} />)
    const text = screen.queryByText('VLOCKSTER')
    expect(text).not.toBeInTheDocument()
  })

  it('should have aria-label for accessibility', () => {
    render(<BrandHeader />)
    const link = screen.getByRole('link', { name: /vlockster.*ir al inicio/i })
    expect(link).toHaveAttribute('aria-label')
  })

  it('should render with different sizes', () => {
    const { rerender } = render(<BrandHeader size="sm" />)
    let link = screen.getByRole('link')
    expect(link).toBeInTheDocument()

    rerender(<BrandHeader size="md" />)
    link = screen.getByRole('link')
    expect(link).toBeInTheDocument()

    rerender(<BrandHeader size="lg" />)
    link = screen.getByRole('link')
    expect(link).toBeInTheDocument()
  })
})

