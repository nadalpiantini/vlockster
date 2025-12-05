import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrandHeader } from '@/components/BrandHeader'

// Mock next/link
vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

// Mock next/image
vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}))

describe('BrandHeader', () => {
  it('debe renderizar logo y texto por defecto', () => {
    render(<BrandHeader />)
    
    const link = screen.getByLabelText(/vlockster.*ir al inicio/i)
    expect(link).toBeDefined()
    expect(link).toHaveAttribute('href', '/')
    
    expect(screen.getByText('VLOCKSTER')).toBeDefined()
    expect(screen.getByAltText('VLOCKSTER Logo')).toBeDefined()
  })

  it('debe renderizar solo logo cuando showText es false', () => {
    render(<BrandHeader showText={false} />)
    
    expect(screen.getByAltText('VLOCKSTER Logo')).toBeDefined()
    expect(screen.queryByText('VLOCKSTER')).toBeNull()
  })

  it('debe aplicar tamaño pequeño cuando size="sm"', () => {
    const { container } = render(<BrandHeader size="sm" />)
    
    const imageContainer = container.querySelector('.w-8.h-8')
    expect(imageContainer).toBeDefined()
    
    const text = screen.getByText('VLOCKSTER')
    expect(text).toHaveClass('text-xl')
  })

  it('debe aplicar tamaño mediano cuando size="md" (default)', () => {
    const { container } = render(<BrandHeader size="md" />)
    
    const imageContainer = container.querySelector('.w-10.h-10')
    expect(imageContainer).toBeDefined()
    
    const text = screen.getByText('VLOCKSTER')
    expect(text).toHaveClass('text-2xl')
  })

  it('debe aplicar tamaño grande cuando size="lg"', () => {
    const { container } = render(<BrandHeader size="lg" />)
    
    const imageContainer = container.querySelector('.w-12.h-12')
    expect(imageContainer).toBeDefined()
    
    const text = screen.getByText('VLOCKSTER')
    expect(text).toHaveClass('text-3xl')
  })

  it('debe tener aria-label accesible', () => {
    render(<BrandHeader />)
    
    const link = screen.getByLabelText(/vlockster.*ir al inicio/i)
    expect(link).toBeDefined()
  })

  it('debe tener alt text en la imagen', () => {
    render(<BrandHeader />)
    
    const image = screen.getByAltText('VLOCKSTER Logo')
    expect(image).toBeDefined()
  })

  it('debe usar la ruta correcta del logo', () => {
    render(<BrandHeader />)
    
    const image = screen.getByAltText('VLOCKSTER Logo')
    expect(image).toHaveAttribute('src', '/items/vlockster_logo.jpeg')
  })
})
