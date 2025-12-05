import React from 'react'
import { describe, it, expect, vi } from 'vitest'
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
vi.mock('@/components/PayPalButton', () => ({
  PayPalButton: ({ amount, projectId, rewardId }: any) => (
    <div data-testid="paypal-button">
      PayPal Button - ${amount} - Project: {projectId} - Reward: {rewardId || 'none'}
    </div>
  ),
}))

describe('ProjectBackingCard', () => {
  const mockProject = {
    id: 'project-123',
    title: 'Test Project',
    goal_amount: 1000,
    current_amount: 500,
  }

  const mockRewards = [
    {
      id: 'reward-1',
      title: 'Reward 1',
      description: 'Description 1',
      amount: '25.00',
      limit: 100,
    },
  ]

  it('debe renderizar información del proyecto', () => {
    render(<ProjectBackingCard project={mockProject} rewards={mockRewards} />)
    expect(screen.getByText('Test Project')).toBeDefined()
  })

  it('debe mostrar el progreso del proyecto', () => {
    render(<ProjectBackingCard project={mockProject} rewards={mockRewards} />)
    expect(screen.getByText(/500/)).toBeDefined()
    expect(screen.getByText(/1000/)).toBeDefined()
  })

  it('debe renderizar el botón de PayPal', () => {
    render(<ProjectBackingCard project={mockProject} rewards={mockRewards} />)
    expect(screen.getByTestId('paypal-button')).toBeDefined()
  })

  it('debe manejar proyectos sin recompensas', () => {
    render(<ProjectBackingCard project={mockProject} rewards={[]} />)
    expect(screen.getByText('Test Project')).toBeDefined()
  })
})
