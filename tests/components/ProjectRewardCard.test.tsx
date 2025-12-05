import React from 'react'
import { describe, it, expect, vi } from 'vitest'
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

describe('ProjectRewardCard', () => {
  const mockReward = {
    id: 'reward-123',
    title: 'Test Reward',
    description: 'This is a test reward description',
    amount: '25.00',
    limit: 100,
    delivery_date: new Date(Date.now() + 86400000 * 30).toISOString(),
  }

  it('debe renderizar el título y descripción de la recompensa', () => {
    render(<ProjectRewardCard reward={mockReward} />)
    expect(screen.getByText('Test Reward')).toBeDefined()
    expect(screen.getByText('This is a test reward description')).toBeDefined()
  })

  it('debe mostrar el monto formateado', () => {
    render(<ProjectRewardCard reward={mockReward} />)
    expect(screen.getByText(/\$25/)).toBeDefined()
  })

  it('debe mostrar el límite si existe', () => {
    render(<ProjectRewardCard reward={mockReward} />)
    expect(screen.getByText(/100/)).toBeDefined()
  })

  it('debe tener aria-label accesible', () => {
    render(<ProjectRewardCard reward={mockReward} />)
    expect(screen.getByLabelText(/Recompensa: Test Reward/)).toBeDefined()
  })

  it('debe manejar recompensas sin límite', () => {
    const rewardWithoutLimit = {
      ...mockReward,
      limit: null,
    }
    render(<ProjectRewardCard reward={rewardWithoutLimit} />)
    expect(screen.getByText('Test Reward')).toBeDefined()
  })
})
