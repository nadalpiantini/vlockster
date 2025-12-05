import * as React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProjectRewardCard } from '@/components/ProjectRewardCard'

const mockReward = {
  id: 'reward-1',
  title: 'Recompensa Básica',
  description: 'Descripción de la recompensa',
  amount: 50,
  limit: 10,
  backers_count: 5,
}

const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'viewer' as const,
}

describe('ProjectRewardCard', () => {
  it('debe renderizar información de la recompensa', () => {
    render(
      <ProjectRewardCard
        reward={mockReward}
        projectId="project-1"
        projectStatus="active"
        user={mockUser}
      />
    )

    expect(screen.getByText('Recompensa Básica')).toBeDefined()
    expect(screen.getByText('$50 USD')).toBeDefined()
    expect(screen.getByText('Descripción de la recompensa')).toBeDefined()
  })

  it('debe mostrar disponibilidad de recompensas', () => {
    render(
      <ProjectRewardCard
        reward={mockReward}
        projectId="project-1"
        projectStatus="active"
        user={mockUser}
      />
    )

    expect(screen.getByText(/5 disponibles de 10/i)).toBeDefined()
  })

  it('debe mostrar como agotada cuando no hay disponibilidad', () => {
    const exhaustedReward = {
      ...mockReward,
      backers_count: 10,
      limit: 10,
    }

    render(
      <ProjectRewardCard
        reward={exhaustedReward}
        projectId="project-1"
        projectStatus="active"
        user={mockUser}
      />
    )

    // Hay dos elementos con "Agotado" - el span y el botón
    const agotadoElements = screen.getAllByText('Agotado')
    expect(agotadoElements.length).toBeGreaterThan(0)
    
    // Verificar que el botón tiene el aria-label correcto
    const button = screen.getByLabelText(/recompensa.*recompensa básica.*agotada/i)
    expect(button).toBeDefined()
  })

  it('debe tener aria-label para accesibilidad', () => {
    render(
      <ProjectRewardCard
        reward={mockReward}
        projectId="project-1"
        projectStatus="active"
        user={mockUser}
      />
    )

    // Verificar que el componente tiene aria-label
    const card = screen.getByLabelText(/recompensa/i)
    expect(card).toBeDefined()
  })
})

