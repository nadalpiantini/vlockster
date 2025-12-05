import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrandHeader } from '@/components/BrandHeader'

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}))

// Mock next/link
vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

describe('BrandHeader', () => {
  it('debe renderizar el logo y texto por defecto', () => {
    render(<BrandHeader />)
    
    const link = screen.getByLabelText(/vlockster.*ir al inicio/i)
    expect(link).toBeDefined()
    expect(link).toHaveAttribute('href', '/')
    
    expect(screen.getByText('VLOCKSTER')).toBeDefined()
    expect(screen.getByAltText('VLOCKSTER Logo')).toBeDefined()
  })

  it('debe renderizar solo el logo cuando showText es false', () => {
    render(<BrandHeader showText={false} />)
    
    const link = screen.getByLabelText(/vlockster.*ir al inicio/i)
    expect(link).toBeDefined()
    
    expect(screen.queryByText('VLOCKSTER')).toBeNull()
    expect(screen.getByAltText('VLOCKSTER Logo')).toBeDefined()
  })

  it('debe aplicar tamaño pequeño cuando size es sm', () => {
    render(<BrandHeader size="sm" />)
    
    const link = screen.getByLabelText(/vlockster.*ir al inicio/i)
    const image = screen.getByAltText('VLOCKSTER Logo')
    
    expect(link).toBeDefined()
    expect(image).toBeDefined()
    // Verificar que tiene las clases de tamaño pequeño
    expect(image.closest('div')).toHaveClass('w-8', 'h-8')
  })

  it('debe aplicar tamaño mediano cuando size es md (default)', () => {
    render(<BrandHeader size="md" />)
    
    const image = screen.getByAltText('VLOCKSTER Logo')
    expect(image.closest('div')).toHaveClass('w-10', 'h-10')
  })

  it('debe aplicar tamaño grande cuando size es lg', () => {
    render(<BrandHeader size="lg" />)
    
    const image = screen.getByAltText('VLOCKSTER Logo')
    expect(image.closest('div')).toHaveClass('w-12', 'h-12')
  })

  it('debe tener aria-label accesible', () => {
    render(<BrandHeader />)
    
    const link = screen.getByLabelText(/vlockster.*ir al inicio/i)
    expect(link).toBeDefined()
  })

  it('debe tener link al inicio', () => {
    render(<BrandHeader />)
    
    const link = screen.getByLabelText(/vlockster.*ir al inicio/i)
    expect(link).toHaveAttribute('href', '/')
  })
})
