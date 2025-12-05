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
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    role: 'viewer' as const,
  }

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
})
