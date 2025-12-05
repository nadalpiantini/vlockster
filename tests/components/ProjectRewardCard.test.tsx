import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProjectRewardCard } from '@/components/ProjectRewardCard'

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
vi.mock('@/components/PayPalButton', () => ({
  PayPalButton: ({ projectId, rewardId, amount, onSuccess, onError }: any) => (
    <div data-testid="paypal-button">
      <button
        data-testid="paypal-success"
        onClick={() => onSuccess && onSuccess()}
      >
        Success
      </button>
      <button
        data-testid="paypal-error"
        onClick={() => onError && onError('Test error')}
      >
        Error
      </button>
    </div>
  ),
  PayPalButtonPlaceholder: () => (
    <button data-testid="paypal-placeholder">Login to support</button>
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
  value: { reload: mockReload },
  writable: true,
})

describe('ProjectRewardCard', () => {
  const mockReward = {
    id: 'reward-123',
    title: 'Test Reward',
    description: 'This is a test reward description',
    amount: 25.00,
    limit: 100,
    backers_count: 5,
  }

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

  it('debe renderizar el título y descripción de la recompensa', () => {
    render(<ProjectRewardCard reward={mockReward} projectId="project-123" projectStatus="active" user={null} />)
    expect(screen.getByText('Test Reward')).toBeDefined()
    expect(screen.getByText('This is a test reward description')).toBeDefined()
  })

  it('debe mostrar el monto formateado', () => {
    render(<ProjectRewardCard reward={mockReward} projectId="project-123" projectStatus="active" user={null} />)
    expect(screen.getByText(/\$25/)).toBeDefined()
  })

  it('debe mostrar el límite si existe', () => {
    render(<ProjectRewardCard reward={mockReward} projectId="project-123" projectStatus="active" user={null} />)
    expect(screen.getByText(/95 disponibles de 100/)).toBeDefined()
  })

  it('debe tener aria-label accesible', () => {
    render(<ProjectRewardCard reward={mockReward} projectId="project-123" projectStatus="active" user={null} />)
    expect(screen.getByLabelText(/Recompensa: Test Reward/)).toBeDefined()
  })

  it('debe manejar recompensas sin límite', () => {
    const rewardWithoutLimit = {
      ...mockReward,
      limit: null,
      backers_count: 0,
    }
    render(<ProjectRewardCard reward={rewardWithoutLimit} projectId="project-123" projectStatus="active" user={null} />)
    expect(screen.getByText('Test Reward')).toBeDefined()
    // No debe mostrar "disponibles de"
    expect(screen.queryByText(/disponibles de/)).toBeNull()
  })

  it('debe manejar recompensas sin descripción', () => {
    const rewardWithoutDescription = {
      ...mockReward,
      description: null,
    }
    render(<ProjectRewardCard reward={rewardWithoutDescription} projectId="project-123" projectStatus="active" user={null} />)
    expect(screen.getByText('Test Reward')).toBeDefined()
    expect(screen.queryByText('This is a test reward description')).toBeNull()
  })

  it('debe mostrar "Agotado" cuando la recompensa está agotada', () => {
    const exhaustedReward = {
      ...mockReward,
      limit: 100,
      backers_count: 100,
    }
    render(<ProjectRewardCard reward={exhaustedReward} projectId="project-123" projectStatus="active" user={null} />)
    expect(screen.getByLabelText('Recompensa agotada')).toBeDefined()
    // Verificar que el botón también muestra "Agotado"
    expect(screen.getByLabelText(/Recompensa Test Reward agotada/)).toBeDefined()
  })

  it('debe mostrar botón deshabilitado cuando está agotado', () => {
    const exhaustedReward = {
      ...mockReward,
      limit: 100,
      backers_count: 100,
    }
    render(<ProjectRewardCard reward={exhaustedReward} projectId="project-123" projectStatus="active" user={null} />)
    const button = screen.getByLabelText(/Recompensa Test Reward agotada/)
    expect(button).toBeDisabled()
  })

  it('debe mostrar "Campaña cerrada" cuando projectStatus no es active', () => {
    render(<ProjectRewardCard reward={mockReward} projectId="project-123" projectStatus="completed" user={null} />)
    expect(screen.getByText('Campaña cerrada')).toBeDefined()
    const button = screen.getByLabelText('Campaña cerrada')
    expect(button).toBeDisabled()
  })

  it('debe mostrar PayPalButtonPlaceholder cuando no hay usuario', () => {
    render(<ProjectRewardCard reward={mockReward} projectId="project-123" projectStatus="active" user={null} />)
    expect(screen.getByTestId('paypal-placeholder')).toBeDefined()
  })

  it('debe mostrar PayPalButton cuando hay usuario autenticado', () => {
    render(<ProjectRewardCard reward={mockReward} projectId="project-123" projectStatus="active" user={mockUser} />)
    expect(screen.getByTestId('paypal-button')).toBeDefined()
  })

  it('debe recargar la página cuando el pago es exitoso', () => {
    render(<ProjectRewardCard reward={mockReward} projectId="project-123" projectStatus="active" user={mockUser} />)
    const successButton = screen.getByTestId('paypal-success')
    successButton.click()
    expect(mockReload).toHaveBeenCalled()
  })

  it('debe llamar logger.error cuando hay error en el pago', async () => {
    const { logger } = await import('@/lib/utils/logger')
    render(<ProjectRewardCard reward={mockReward} projectId="project-123" projectStatus="active" user={mockUser} />)
    const errorButton = screen.getByTestId('paypal-error')
    errorButton.click()
    expect(logger.error).toHaveBeenCalledWith(
      'Payment error in ProjectRewardCard',
      expect.any(Error),
      {
        projectId: 'project-123',
        rewardId: 'reward-123',
        userId: 'user-123',
      }
    )
  })

  it('debe aplicar opacity cuando la recompensa está agotada', () => {
    const exhaustedReward = {
      ...mockReward,
      limit: 100,
      backers_count: 100,
    }
    const { container } = render(
      <ProjectRewardCard reward={exhaustedReward} projectId="project-123" projectStatus="active" user={null} />
    )
    const card = container.querySelector('.opacity-50')
    expect(card).toBeDefined()
  })
})
