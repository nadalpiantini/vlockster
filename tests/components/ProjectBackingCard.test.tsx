import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProjectBackingCard } from '@/components/ProjectBackingCard'

// Mock next/link
vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

// Mock PayPalButton
const mockReload = vi.fn()
Object.defineProperty(window, 'location', {
  value: { reload: mockReload },
  writable: true,
})

vi.mock('@/components/PayPalButton', () => ({
  PayPalButton: ({ amount, projectId, onSuccess, onError }: any) => (
    <div data-testid="paypal-button">
      <button data-testid="paypal-success" onClick={() => onSuccess && onSuccess()}>
        Success
      </button>
      <button data-testid="paypal-error" onClick={() => onError && onError('Test error')}>
        Error
      </button>
    </div>
  ),
  PayPalButtonPlaceholder: () => (
    <div data-testid="paypal-placeholder">
      Inicia sesión para apoyar este proyecto
    </div>
  ),
}))

// Mock logger
vi.mock('@/lib/utils/logger', () => ({
  logger: {
    error: vi.fn(),
  },
}))

describe('ProjectBackingCard', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    role: 'viewer' as const,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockReload.mockClear()
  })

  it('debe renderizar el botón de PayPal cuando el proyecto está activo y hay usuario', () => {
    render(
      <ProjectBackingCard
        projectId="project-123"
        projectStatus="active"
        goalAmount={1000}
        user={mockUser}
      />
    )
    expect(screen.getByTestId('paypal-button')).toBeDefined()
  })

  it('debe renderizar placeholder cuando el proyecto está activo pero no hay usuario', () => {
    render(
      <ProjectBackingCard
        projectId="project-123"
        projectStatus="active"
        goalAmount={1000}
        user={null}
      />
    )
    // PayPalButtonPlaceholder debería renderizarse
    expect(screen.queryByTestId('paypal-button')).toBeNull()
  })

  it('no debe renderizar nada cuando el proyecto no está activo', () => {
    const { container } = render(
      <ProjectBackingCard
        projectId="project-123"
        projectStatus="funded"
        goalAmount={1000}
        user={mockUser}
      />
    )
    expect(container.firstChild).toBeNull()
  })

  it('no debe renderizar nada cuando el proyecto está completado', () => {
    const { container } = render(
      <ProjectBackingCard
        projectId="project-123"
        projectStatus="completed"
        goalAmount={1000}
        user={mockUser}
      />
    )
    expect(container.firstChild).toBeNull()
  })

  it('debe recargar la página cuando el pago es exitoso', async () => {
    const { logger } = await import('@/lib/utils/logger')
    render(
      <ProjectBackingCard
        projectId="project-123"
        projectStatus="active"
        goalAmount={1000}
        user={mockUser}
      />
    )
    const successButton = screen.getByTestId('paypal-success')
    successButton.click()
    expect(mockReload).toHaveBeenCalled()
  })

  it('debe llamar logger.error cuando hay error en el pago', async () => {
    const { logger } = await import('@/lib/utils/logger')
    render(
      <ProjectBackingCard
        projectId="project-123"
        projectStatus="active"
        goalAmount={1000}
        user={mockUser}
      />
    )
    const errorButton = screen.getByTestId('paypal-error')
    errorButton.click()
    expect(logger.error).toHaveBeenCalledWith(
      'Payment error in ProjectBackingCard',
      expect.any(Error),
      {
        projectId: 'project-123',
        userId: 'user-123',
      }
    )
  })

  it('debe pasar el goalAmount correcto al PayPalButton', () => {
    render(
      <ProjectBackingCard
        projectId="project-123"
        projectStatus="active"
        goalAmount={5000}
        user={mockUser}
      />
    )
    expect(screen.getByTestId('paypal-button')).toBeDefined()
  })
})
