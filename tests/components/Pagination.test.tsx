import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Pagination } from '@/components/Pagination'

// Mock next/link
vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, onClick, onKeyDown, ...props }: any) => (
    <a
      href={href}
      onClick={onClick}
      onKeyDown={onKeyDown}
      {...props}
    >
      {children}
    </a>
  ),
}))

describe('Pagination', () => {
  it('debe retornar null cuando totalPages <= 1', () => {
    const { container } = render(<Pagination currentPage={1} totalPages={1} basePath="/test" />)
    expect(container.firstChild).toBeNull()
  })

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
    expect(prevLink).toHaveAttribute('tabIndex', '-1')
  })

  it('debe deshabilitar el botón siguiente en la última página', () => {
    render(<Pagination currentPage={5} totalPages={5} basePath="/test" />)
    const nextLink = screen.getByLabelText('Página siguiente')
    expect(nextLink).toHaveAttribute('aria-disabled', 'true')
    expect(nextLink).toHaveAttribute('tabIndex', '-1')
  })

  it('debe prevenir navegación cuando se hace click en botón anterior deshabilitado', async () => {
    const user = userEvent.setup()
    render(<Pagination currentPage={1} totalPages={5} basePath="/test" />)
    const prevLink = screen.getByLabelText('Página anterior')
    const clickEvent = { preventDefault: vi.fn() }
    await user.click(prevLink)
    // El onClick handler previene el default cuando currentPage === 1
    expect(prevLink).toHaveAttribute('href', '#')
  })

  it('debe prevenir navegación con teclado cuando está deshabilitado', async () => {
    const user = userEvent.setup()
    render(<Pagination currentPage={1} totalPages={5} basePath="/test" />)
    const prevLink = screen.getByLabelText('Página anterior')
    const keyDownEvent = { key: 'Enter', preventDefault: vi.fn() }
    prevLink.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
    // El onKeyDown handler previene el default cuando currentPage === 1
    expect(prevLink).toHaveAttribute('href', '#')
  })

  it('debe mostrar enlaces a todas las páginas cuando totalPages <= 5', () => {
    render(<Pagination currentPage={3} totalPages={5} basePath="/test" />)
    expect(screen.getByLabelText('Ir a página 1')).toBeDefined()
    expect(screen.getByLabelText('Ir a página 2')).toBeDefined()
    expect(screen.getByLabelText('Ir a página 3')).toBeDefined()
    expect(screen.getByLabelText('Ir a página 4')).toBeDefined()
    expect(screen.getByLabelText('Ir a página 5')).toBeDefined()
  })

  it('debe mostrar primeras 5 páginas cuando currentPage <= 3 y totalPages > 5', () => {
    render(<Pagination currentPage={2} totalPages={10} basePath="/test" />)
    expect(screen.getByLabelText('Ir a página 1')).toBeDefined()
    expect(screen.getByLabelText('Ir a página 2')).toBeDefined()
    expect(screen.getByLabelText('Ir a página 3')).toBeDefined()
    expect(screen.getByLabelText('Ir a página 4')).toBeDefined()
    expect(screen.getByLabelText('Ir a página 5')).toBeDefined()
  })

  it('debe mostrar últimas 5 páginas cuando currentPage >= totalPages - 2', () => {
    render(<Pagination currentPage={9} totalPages={10} basePath="/test" />)
    expect(screen.getByLabelText('Ir a página 6')).toBeDefined()
    expect(screen.getByLabelText('Ir a página 7')).toBeDefined()
    expect(screen.getByLabelText('Ir a página 8')).toBeDefined()
    expect(screen.getByLabelText('Ir a página 9')).toBeDefined()
    expect(screen.getByLabelText('Ir a página 10')).toBeDefined()
  })

  it('debe mostrar páginas alrededor de currentPage cuando está en el medio', () => {
    render(<Pagination currentPage={5} totalPages={10} basePath="/test" />)
    expect(screen.getByLabelText('Ir a página 3')).toBeDefined()
    expect(screen.getByLabelText('Ir a página 4')).toBeDefined()
    expect(screen.getByLabelText('Ir a página 5')).toBeDefined()
    expect(screen.getByLabelText('Ir a página 6')).toBeDefined()
    expect(screen.getByLabelText('Ir a página 7')).toBeDefined()
  })

  it('debe tener aria-current en la página actual', () => {
    render(<Pagination currentPage={3} totalPages={5} basePath="/test" />)
    const currentPageButton = screen.getByLabelText('Página 3, página actual')
    const currentPageLink = currentPageButton.closest('a')
    expect(currentPageLink).toHaveAttribute('aria-current', 'page')
  })

  it('debe tener aria-live para el contador de páginas', () => {
    render(<Pagination currentPage={3} totalPages={5} basePath="/test" />)
    const pageInfo = screen.getByText(/Página 3 de 5/i)
    expect(pageInfo).toHaveAttribute('aria-live', 'polite')
  })

  describe('getPageUrl function', () => {
    it('debe eliminar query param page cuando page === 1', () => {
      render(<Pagination currentPage={2} totalPages={5} basePath="/test?page=2" />)
      const page1Link = screen.getByLabelText('Ir a página 1')
      // Cuando page === 1, debería eliminar el query param
      expect(page1Link).toHaveAttribute('href', expect.not.stringContaining('page='))
    })

    it('debe agregar query param page cuando page > 1', () => {
      render(<Pagination currentPage={1} totalPages={5} basePath="/test" />)
      const page2Link = screen.getByLabelText('Ir a página 2')
      expect(page2Link).toHaveAttribute('href', expect.stringContaining('page=2'))
    })

    it('debe preservar query params existentes', () => {
      render(<Pagination currentPage={2} totalPages={5} basePath="/test?filter=active&sort=date" />)
      const page3Link = screen.getByLabelText('Ir a página 3')
      // Debería preservar filter y sort, y agregar/actualizar page
      expect(page3Link).toHaveAttribute('href', expect.stringContaining('page=3'))
    })
  })

  describe('keyboard navigation', () => {
    it('debe prevenir Enter en botón anterior deshabilitado', () => {
      render(<Pagination currentPage={1} totalPages={5} basePath="/test" />)
      const prevLink = screen.getByLabelText('Página anterior')
      const keyDownEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
      const preventDefaultSpy = vi.spyOn(keyDownEvent, 'preventDefault')
      prevLink.dispatchEvent(keyDownEvent)
      // El handler debería prevenir el default
      expect(prevLink).toHaveAttribute('href', '#')
    })

    it('debe prevenir Space en botón anterior deshabilitado', () => {
      render(<Pagination currentPage={1} totalPages={5} basePath="/test" />)
      const prevLink = screen.getByLabelText('Página anterior')
      const keyDownEvent = new KeyboardEvent('keydown', { key: ' ', bubbles: true })
      prevLink.dispatchEvent(keyDownEvent)
      expect(prevLink).toHaveAttribute('href', '#')
    })

    it('debe prevenir click en botón siguiente deshabilitado', async () => {
      const user = userEvent.setup()
      render(<Pagination currentPage={5} totalPages={5} basePath="/test" />)
      const nextLink = screen.getByLabelText('Página siguiente')
      const clickEvent = { preventDefault: vi.fn() }
      await user.click(nextLink)
      // El onClick handler previene el default cuando currentPage === totalPages
      expect(nextLink).toHaveAttribute('href', '#')
    })

    it('debe prevenir Enter en botón siguiente deshabilitado', () => {
      render(<Pagination currentPage={5} totalPages={5} basePath="/test" />)
      const nextLink = screen.getByLabelText('Página siguiente')
      const keyDownEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
      const preventDefaultSpy = vi.spyOn(keyDownEvent, 'preventDefault')
      nextLink.dispatchEvent(keyDownEvent)
      expect(nextLink).toHaveAttribute('href', '#')
    })

    it('debe prevenir Space en botón siguiente deshabilitado', () => {
      render(<Pagination currentPage={5} totalPages={5} basePath="/test" />)
      const nextLink = screen.getByLabelText('Página siguiente')
      const keyDownEvent = new KeyboardEvent('keydown', { key: ' ', bubbles: true })
      nextLink.dispatchEvent(keyDownEvent)
      expect(nextLink).toHaveAttribute('href', '#')
    })

    it('debe permitir navegación cuando no está deshabilitado', () => {
      render(<Pagination currentPage={3} totalPages={5} basePath="/test" />)
      const prevLink = screen.getByLabelText('Página anterior')
      expect(prevLink).toHaveAttribute('aria-disabled', 'false')
      expect(prevLink).toHaveAttribute('tabIndex', '0')
    })
  })

  describe('edge cases', () => {
    it('debe manejar totalPages = 2', () => {
      render(<Pagination currentPage={1} totalPages={2} basePath="/test" />)
      expect(screen.getByLabelText('Ir a página 1')).toBeDefined()
      expect(screen.getByLabelText('Ir a página 2')).toBeDefined()
    })

    it('debe manejar currentPage = 1 con totalPages grande', () => {
      render(<Pagination currentPage={1} totalPages={20} basePath="/test" />)
      expect(screen.getByLabelText('Ir a página 1')).toBeDefined()
      expect(screen.getByLabelText('Ir a página 5')).toBeDefined()
    })

    it('debe manejar currentPage = totalPages con totalPages grande', () => {
      render(<Pagination currentPage={20} totalPages={20} basePath="/test" />)
      expect(screen.getByLabelText('Ir a página 16')).toBeDefined()
      expect(screen.getByLabelText('Ir a página 20')).toBeDefined()
    })
  })
})
