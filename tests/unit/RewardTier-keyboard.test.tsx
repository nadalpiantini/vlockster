import { describe, it, expect, vi, beforeEach } from 'vitest'
import { RewardTier } from '@/components/RewardTier'
import { fireEvent, render, screen } from '@testing-library/react'

// Mock de las dependencias
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}))

describe('RewardTier Component', () => {
  const defaultProps = {
    id: 'reward1',
    title: 'Prueba Recompensa',
    description: 'Descripción de prueba',
    amount: 50,
    isAvailable: true,
    onSelect: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly when available', () => {
    render(
      <RewardTier
        {...defaultProps}
      />
    )

    expect(screen.getByText('Prueba Recompensa')).toBeInTheDocument()
    expect(screen.getByText('$50')).toBeInTheDocument()
    expect(screen.getByText('Descripción de prueba')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Seleccionar/i })).toBeInTheDocument()
  })

  it('handles keyboard events for selection', () => {
    const onSelect = vi.fn()
    render(
      <RewardTier
        {...defaultProps}
        onSelect={onSelect}
      />
    )

    const rewardElement = screen.getByRole('button', { name: /Recompensa Prueba Recompensa por \$50/i })

    // Probar evento Enter
    fireEvent.keyDown(rewardElement, { key: 'Enter' })
    expect(onSelect).toHaveBeenCalledTimes(1)

    // Reiniciar el mock
    vi.clearAllMocks()

    // Probar evento Espacio
    fireEvent.keyDown(rewardElement, { key: ' ' })
    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  it('does not trigger selection when unavailable', () => {
    const onSelect = vi.fn()
    render(
      <RewardTier
        {...defaultProps}
        isAvailable={false}
        onSelect={onSelect}
      />
    )

    const rewardElement = screen.getByRole('button', { name: /Recompensa Prueba Recompensa por \$50 \(no disponible\)/i })
    
    // Verificar que el elemento está inhabilitado
    expect(rewardElement).toHaveAttribute('tabIndex', '-1')
    expect(rewardElement).toHaveAttribute('aria-disabled', 'true')
  })

  it('shows correct state for sold out items', () => {
    const onSelect = vi.fn()
    render(
      <RewardTier
        {...defaultProps}
        limit={2}
        backersCount={2}
        onSelect={onSelect}
      />
    )

    expect(screen.getByText('Agotado')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Seleccionar/i })).not.toBeInTheDocument()
  })

  it('displays limited quantity information', () => {
    render(
      <RewardTier
        {...defaultProps}
        limit={10}
        backersCount={3}
      />
    )

    expect(screen.getByText('7 de 10 disponibles')).toBeInTheDocument()
  })
})