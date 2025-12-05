import * as React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Pagination } from '@/components/Pagination'

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

describe('Pagination', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('no debe renderizar cuando hay solo una página', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} basePath="/projects" />
    )
    
    expect(container.firstChild).toBeNull()
  })

  it('debe renderizar navegación cuando hay múltiples páginas', () => {
    render(
      <Pagination currentPage={1} totalPages={5} basePath="/projects" />
    )
    
    expect(screen.getByRole('navigation')).toBeDefined()
    expect(screen.getByLabelText(/navegación de páginas/i)).toBeDefined()
  })

  it('debe mostrar todas las páginas cuando hay 5 o menos', () => {
    render(
      <Pagination currentPage={1} totalPages={5} basePath="/projects" />
    )
    
    expect(screen.getByLabelText(/ir a página 1/i)).toBeDefined()
    expect(screen.getByLabelText(/ir a página 2/i)).toBeDefined()
    expect(screen.getByLabelText(/ir a página 3/i)).toBeDefined()
    expect(screen.getByLabelText(/ir a página 4/i)).toBeDefined()
    expect(screen.getByLabelText(/ir a página 5/i)).toBeDefined()
  })

  it('debe mostrar página actual marcada', () => {
    render(
      <Pagination currentPage={3} totalPages={5} basePath="/projects" />
    )
    
    const currentPageButton = screen.getByLabelText(/página 3.*página actual/i)
    const currentPageLink = currentPageButton.closest('a')
    expect(currentPageLink).toHaveAttribute('aria-current', 'page')
  })

  it('debe deshabilitar botón anterior en primera página', () => {
    render(
      <Pagination currentPage={1} totalPages={5} basePath="/projects" />
    )
    
    const prevButton = screen.getByLabelText(/ir a página anterior/i)
    expect(prevButton).toBeDisabled()
    
    // El Link tiene aria-disabled, verificar que el botón está deshabilitado
    const prevLink = prevButton.closest('a')
    if (prevLink) {
      expect(prevLink).toHaveAttribute('aria-disabled', 'true')
    }
  })

  it('debe deshabilitar botón siguiente en última página', () => {
    render(
      <Pagination currentPage={5} totalPages={5} basePath="/projects" />
    )
    
    const nextButton = screen.getByLabelText(/ir a página siguiente/i)
    expect(nextButton).toBeDisabled()
    
    // El Link tiene aria-disabled, verificar que el botón está deshabilitado
    const nextLink = nextButton.closest('a')
    if (nextLink) {
      expect(nextLink).toHaveAttribute('aria-disabled', 'true')
    }
  })

  it('debe generar URL correcta para primera página (sin query)', () => {
    render(
      <Pagination currentPage={1} totalPages={5} basePath="/projects" />
    )
    
    const page1Link = screen.getByLabelText(/ir a página 1/i).closest('a')
    expect(page1Link).toHaveAttribute('href', '/projects')
  })

  it('debe generar URL correcta para páginas siguientes (con query)', () => {
    render(
      <Pagination currentPage={2} totalPages={5} basePath="/projects" />
    )
    
    const page3Link = screen.getByLabelText(/ir a página 3/i).closest('a')
    expect(page3Link).toHaveAttribute('href', '/projects?page=3')
  })

  it('debe mostrar páginas cercanas cuando está en medio', () => {
    render(
      <Pagination currentPage={5} totalPages={10} basePath="/projects" />
    )
    
    // Debe mostrar páginas 3, 4, 5, 6, 7 (5 páginas alrededor de la actual)
    expect(screen.getByLabelText(/ir a página 3/i)).toBeDefined()
    expect(screen.getByLabelText(/ir a página 4/i)).toBeDefined()
    expect(screen.getByLabelText(/ir a página 5/i)).toBeDefined()
    expect(screen.getByLabelText(/ir a página 6/i)).toBeDefined()
    expect(screen.getByLabelText(/ir a página 7/i)).toBeDefined()
  })

  it('debe mostrar primeras páginas cuando está al inicio', () => {
    render(
      <Pagination currentPage={2} totalPages={10} basePath="/projects" />
    )
    
    // Debe mostrar páginas 1, 2, 3, 4, 5
    expect(screen.getByLabelText(/ir a página 1/i)).toBeDefined()
    expect(screen.getByLabelText(/ir a página 2/i)).toBeDefined()
    expect(screen.getByLabelText(/ir a página 3/i)).toBeDefined()
    expect(screen.getByLabelText(/ir a página 4/i)).toBeDefined()
    expect(screen.getByLabelText(/ir a página 5/i)).toBeDefined()
  })

  it('debe mostrar últimas páginas cuando está al final', () => {
    render(
      <Pagination currentPage={9} totalPages={10} basePath="/projects" />
    )
    
    // Debe mostrar páginas 6, 7, 8, 9, 10
    expect(screen.getByLabelText(/ir a página 6/i)).toBeDefined()
    expect(screen.getByLabelText(/ir a página 7/i)).toBeDefined()
    expect(screen.getByLabelText(/ir a página 8/i)).toBeDefined()
    expect(screen.getByLabelText(/ir a página 9/i)).toBeDefined()
    expect(screen.getByLabelText(/ir a página 10/i)).toBeDefined()
  })

  it('debe mostrar información de página actual', () => {
    render(
      <Pagination currentPage={3} totalPages={10} basePath="/projects" />
    )
    
    const pageInfo = screen.getByText(/página 3 de 10/i)
    expect(pageInfo).toBeDefined()
    expect(pageInfo).toHaveAttribute('aria-live', 'polite')
  })

  it('debe tener aria-labels accesibles', () => {
    render(
      <Pagination currentPage={2} totalPages={5} basePath="/projects" />
    )
    
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveAttribute('aria-label', 'Navegación de páginas')
    
    const list = screen.getByRole('list')
    expect(list).toBeDefined()
  })
})

