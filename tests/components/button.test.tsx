import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  it('debe renderizar correctamente', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeDefined()
  })

  it('debe aceptar variantes', () => {
    render(<Button variant="destructive">Delete</Button>)
    const button = screen.getByText('Delete')
    expect(button).toBeDefined()
  })

  it('debe aceptar tamaño', () => {
    render(<Button size="lg">Large Button</Button>)
    const button = screen.getByText('Large Button')
    expect(button).toBeDefined()
  })

  it('debe aceptar asChild prop', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    )
    const link = screen.getByText('Link Button')
    expect(link.tagName).toBe('A')
  })

  it('debe aceptar todas las variantes', () => {
    const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const
    variants.forEach((variant) => {
      const { unmount } = render(<Button variant={variant}>Test</Button>)
      expect(screen.getByText('Test')).toBeDefined()
      unmount()
    })
  })
})

