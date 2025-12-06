import { describe, it, expect } from 'vitest'
import { validateLogContext, logWithValidation } from '@/lib/utils/logger-validation'
import { render, screen } from '@testing-library/react'
import { ProjectRewardCard } from '@/components/ProjectRewardCard'

describe('Quinto Mini Sprint - Integración de pruebas', () => {
  describe('Logger Validation Module', () => {
    it('should validate context with required fields correctly', () => {
      const context = {
        endpoint: '/api/test',
        userId: 'user123',
        customField: 'value'
      }
      
      const result = validateLogContext(context, ['endpoint', 'userId'])
      
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
      expect(result.warnings).toContain('Se recomienda incluir timestamp en el contexto de log')
    })

    it('should detect missing required fields', () => {
      const context = {
        endpoint: '/api/test'
        // userId faltante
      }
      
      const result = validateLogContext(context, ['endpoint', 'userId'])
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain("Campo requerido 'userId' no encontrado en contexto de log")
    })

    it('should allow logging with validation', () => {
      const context = {
        endpoint: '/api/test',
        userId: 'user123',
      }
      
      // Verificar que no lanza error al usar logWithValidation
      expect(() => {
        logWithValidation('info', 'Test log message', context, ['endpoint'])
      }).not.toThrow()
    })
  })

  describe('Screen Reader Accessibility', () => {
    const mockReward = {
      id: 'reward-1',
      title: 'Recompensa de Prueba',
      description: 'Descripción de prueba',
      amount: 1000,
      limit: 50,
      backers_count: 10,
    }

    const mockProps = {
      reward: mockReward,
      projectId: 'project-123',
      projectStatus: 'active',
      user: { id: 'user-123', email: 'test@example.com', role: 'viewer' } as const,
    }

    it('should render with proper ARIA attributes', () => {
      render(<ProjectRewardCard {...mockProps} />)

      // Verificar que el componente principal tenga los atributos ARIA correctos
      const card = screen.getByRole('region', { roledescription: 'Tarjeta de recompensa de proyecto para apoyo financiero' })
      expect(card).toBeInTheDocument()
      
      // Verificar el nombre accesible
      expect(card).toHaveAccessibleName(`Recompensa: ${mockReward.title} por $${mockReward.amount.toLocaleString()} USD`)
    })

    it('should show correct availability information', () => {
      render(<ProjectRewardCard {...mockProps} />)

      // Verificar que la información de disponibilidad sea clara
      const availabilityText = screen.getByText(`${mockReward.limit - mockReward.backers_count} disponibles de ${mockReward.limit}`)
      expect(availabilityText).toBeInTheDocument()
    })
  })
})