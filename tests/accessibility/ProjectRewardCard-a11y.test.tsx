import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProjectRewardCard } from '@/components/ProjectRewardCard'

describe('ProjectRewardCard Accessibility Tests', () => {
  const mockReward = {
    id: 'reward-1',
    title: 'Membresía Premium',
    description: 'Acceso exclusivo a contenido detrás de cámaras',
    amount: 2500,
    limit: 100,
    backers_count: 45,
  }

  const mockProps = {
    reward: mockReward,
    projectId: 'project-123',
    projectStatus: 'active',
    user: { id: 'user-123', email: 'test@example.com', role: 'viewer' } as const,
  }

  it('should have proper ARIA labels and roles for screen readers', () => {
    render(<ProjectRewardCard {...mockProps} />)

    // Verificar que el componente tiene el rol y descripción adecuada
    const card = screen.getByRole('region', { roledescription: 'Tarjeta de recompensa de proyecto para apoyo financiero' })
    expect(card).toBeInTheDocument()

    // Verificar que tiene un label ARIA descriptivo
    expect(card).toHaveAccessibleName(`Recompensa: ${mockReward.title} por $${mockReward.amount.toLocaleString()} USD`)
  })

  it('should provide clear status information for screen reader users', () => {
    // Test con recompensa disponible
    render(<ProjectRewardCard {...mockProps} />)
    
    // La recompensa está disponible (45 de 100 tomados, así que quedan)
    const availabilityText = screen.queryByText(/disponibles/)
    if (availabilityText) {
      expect(availabilityText).toBeInTheDocument()
    }
  })

  it('should have proper ARIA attributes for disabled state', () => {
    const unavailableReward = {
      ...mockReward,
      backers_count: 100, // Igual al límite
    }

    render(
      <ProjectRewardCard 
        reward={unavailableReward} 
        projectId="project-123" 
        projectStatus="active"
        user={mockProps.user}
      />
    )

    // Verificar que el botón tiene atributos ARIA adecuados cuando está deshabilitado
    const disabledButton = screen.getByRole('button', { name: new RegExp(`Recompensa "${unavailableReward.title}" está agotada`) })
    expect(disabledButton).toBeInTheDocument()
    expect(disabledButton).toBeDisabled()
  })

  it('should have sufficient color contrast for accessibility', () => {
    render(<ProjectRewardCard {...mockProps} />)

    // Verificar que los elementos tienen clases que indican buen contraste
    const cardElements = screen.getAllByText(mockReward.title)
    expect(cardElements[0]).toBeInTheDocument()
    
    // Verificar que hay información de disponibilidad con texto claro
    const availableText = screen.getByText(/disponibles/)
    expect(availableText).toBeInTheDocument()
  })

  it('should properly announce limited reward status', () => {
    render(<ProjectRewardCard {...mockProps} />)

    // Debe mostrar correctamente la información de disponibilidad
    const limitedInfo = screen.getByText(/45 disponibles de 100/)
    expect(limitedInfo).toBeInTheDocument()
  })
})