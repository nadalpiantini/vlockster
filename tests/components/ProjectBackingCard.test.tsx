import * as React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProjectBackingCard } from '@/components/ProjectBackingCard'

// Mock PayPalButton
vi.mock('@/components/PayPalButton', () => ({
  PayPalButton: ({ projectId, amount, onSuccess, onError }: any) => (
    <div data-testid="paypal-button">
      <span>PayPal Button - Project: {projectId}, Amount: {amount}</span>
      <button onClick={() => onSuccess?.()}>Test Success</button>
      <button onClick={() => onError?.('Test Error')}>Test Error</button>
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

// Mock window.location.reload
const mockReload = vi.fn()
Object.defineProperty(window, 'location', {
  value: {
    reload: mockReload,
  },
  writable: true,
})

describe('ProjectBackingCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockReload.mockClear()
  })

  it('debe renderizar PayPalButton cuando proyecto está activo y hay usuario', () => {
    const user = {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'viewer' as const,
    }

    render(
      <ProjectBackingCard
        projectId="project-123"
        projectStatus="active"
        goalAmount={1000}
        user={user}
      />
    )
    
    expect(screen.getByTestId('paypal-button')).toBeDefined()
    expect(screen.getByText(/project: project-123/i)).toBeDefined()
    expect(screen.getByText(/amount: 1000/i)).toBeDefined()
  })

  it('debe renderizar PayPalButtonPlaceholder cuando proyecto está activo pero no hay usuario', () => {
    render(
      <ProjectBackingCard
        projectId="project-123"
        projectStatus="active"
        goalAmount={1000}
        user={null}
      />
    )
    
    expect(screen.getByTestId('paypal-placeholder')).toBeDefined()
    expect(screen.getByText(/inicia sesión para apoyar/i)).toBeDefined()
  })

  it('no debe renderizar nada cuando proyecto no está activo', () => {
    const { container } = render(
      <ProjectBackingCard
        projectId="project-123"
        projectStatus="completed"
        goalAmount={1000}
        user={{
          id: 'user-123',
          email: 'test@example.com',
          role: 'viewer',
        }}
      />
    )
    
    expect(container.firstChild).toBeNull()
  })

  it('no debe renderizar nada cuando proyecto está en funding y no hay usuario', () => {
    const { container } = render(
      <ProjectBackingCard
        projectId="project-123"
        projectStatus="funding"
        goalAmount={1000}
        user={null}
      />
    )
    
    expect(container.firstChild).toBeNull()
  })

  it('debe recargar página cuando pago es exitoso', () => {
    const user = {
      id: 'user-123',
      email: 'test@example.com',
      role: 'viewer' as const,
    }

    render(
      <ProjectBackingCard
        projectId="project-123"
        projectStatus="active"
        goalAmount={1000}
        user={user}
      />
    )
    
    const successButton = screen.getByText(/test success/i)
    successButton.click()
    
    expect(mockReload).toHaveBeenCalled()
  })

  it('debe manejar errores de pago correctamente', () => {
    const user = {
      id: 'user-123',
      email: 'test@example.com',
      role: 'viewer' as const,
    }

    const { logger } = require('@/lib/utils/logger')

    render(
      <ProjectBackingCard
        projectId="project-123"
        projectStatus="active"
        goalAmount={1000}
        user={user}
      />
    )
    
    const errorButton = screen.getByText(/test error/i)
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

  it('debe pasar amount correcto a PayPalButton', () => {
    const user = {
      id: 'user-123',
      email: 'test@example.com',
      role: 'viewer' as const,
    }

    render(
      <ProjectBackingCard
        projectId="project-123"
        projectStatus="active"
        goalAmount={2500}
        user={user}
      />
    )
    
    expect(screen.getByText(/amount: 2500/i)).toBeDefined()
  })
})

