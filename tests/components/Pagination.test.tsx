import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Pagination } from '@/components/Pagination'

// Mock next/link
vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

describe('Pagination', () => {
  it('debe renderizar la navegación con role="navigation"', () => {
    render(<Pagination currentPage={1} totalPages={5} basePath="/test" />)
    expect(screen.getByRole('navigation', { name: 'Navegación de páginas' })).toBeDefined()
  })

  it('debe mostrar el número de página actual', () => {
    render(<Pagination currentPage={3} totalPages={5} basePath="/test" />)
    expect(screen.getByLabelText('Página 3, página actual')).toBeDefined()
  })

  it('debe deshabilitar el botón anterior en la primera página', () => {
    render(<Pagination currentPage={1} totalPages={5} basePath="/test" />)
    const prevLink = screen.getByLabelText('Página anterior')
    expect(prevLink).toHaveAttribute('aria-disabled', 'true')
  })

  it('debe deshabilitar el botón siguiente en la última página', () => {
    render(<Pagination currentPage={5} totalPages={5} basePath="/test" />)
    const nextLink = screen.getByLabelText('Página siguiente')
    expect(nextLink).toHaveAttribute('aria-disabled', 'true')
  })

  it('debe mostrar enlaces a todas las páginas', () => {
    render(<Pagination currentPage={3} totalPages={5} basePath="/test" />)
    expect(screen.getByLabelText('Ir a página 1')).toBeDefined()
    expect(screen.getByLabelText('Ir a página 2')).toBeDefined()
    expect(screen.getByLabelText('Ir a página 3')).toBeDefined()
    expect(screen.getByLabelText('Ir a página 4')).toBeDefined()
    expect(screen.getByLabelText('Ir a página 5')).toBeDefined()
  })

  it('debe tener aria-current en la página actual', () => {
    render(<Pagination currentPage={3} totalPages={5} basePath="/test" />)
    const currentPageButton = screen.getByLabelText('Página 3, página actual')
    expect(currentPageButton).toHaveAttribute('aria-current', 'page')
  })

  it('debe tener aria-live para el contador de páginas', () => {
    render(<Pagination currentPage={3} totalPages={5} basePath="/test" />)
    const pageInfo = screen.getByText(/Página 3 de 5/i)
    expect(pageInfo).toHaveAttribute('aria-live', 'polite')
  })
})
