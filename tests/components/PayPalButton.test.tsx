import * as React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PayPalButton, PayPalButtonPlaceholder } from '@/components/PayPalButton'

// Mock PayPal SDK
const mockCreateOrder = vi.fn()
const mockOnApprove = vi.fn()
const mockOnError = vi.fn()
const mockOnCancel = vi.fn()

vi.mock('@paypal/react-paypal-js', () => ({
  PayPalScriptProvider: ({ children, options }: any) => (
    <div data-testid="paypal-script-provider" data-client-id={options.clientId}>
      {children}
    </div>
  ),
  PayPalButtons: ({ createOrder, onApprove, onError, onCancel, disabled, ...props }: any) => (
    <div data-testid="paypal-buttons" data-disabled={disabled} {...props}>
      <button
        data-testid="paypal-create-order"
        onClick={async () => {
          try {
            const orderId = await createOrder()
            return orderId
          } catch (error) {
            if (onError) onError(error)
          }
        }}
      >
        Create Order
      </button>
      <button
        data-testid="paypal-approve"
        onClick={async () => {
          try {
            const result = await onApprove({ orderID: 'test-order-id' })
            return result
          } catch (error) {
            if (onError) onError(error)
          }
        }}
      >
        Approve
      </button>
      <button
        data-testid="paypal-error"
        onClick={() => onError && onError(new Error('PayPal SDK error'))}
      >
        Trigger Error
      </button>
      <button
        data-testid="paypal-cancel"
        onClick={() => onCancel && onCancel()}
      >
        Cancel
      </button>
    </div>
  ),
}))

// Mock logger
vi.mock('@/lib/utils/logger', () => ({
  logger: {
    error: vi.fn(),
  },
}))

// Mock fetch
global.fetch = vi.fn()

describe('PayPalButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset environment
    delete process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  })

  describe('PayPalButton', () => {
    it('debe mostrar error cuando PayPal no está configurado', () => {
      render(
        <PayPalButton
          projectId="project-123"
          amount={100}
        />
      )
      
      expect(screen.getByText(/paypal no está configurado/i)).toBeDefined()
      expect(screen.getByText(/configura las variables de entorno/i)).toBeDefined()
    })

    it('debe renderizar PayPalButtons cuando PayPal está configurado', () => {
      process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID = 'test-client-id'

      render(
        <PayPalButton
          projectId="project-123"
          amount={100}
        />
      )
      
      expect(screen.getByTestId('paypal-script-provider')).toBeDefined()
      expect(screen.getByTestId('paypal-script-provider')).toHaveAttribute(
        'data-client-id',
        'test-client-id'
      )
      expect(screen.getByTestId('paypal-buttons')).toBeDefined()
    })

    it('debe configurar PayPalScriptProvider correctamente', () => {
      process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID = 'test-client-id'

      render(
        <PayPalButton
          projectId="project-123"
          amount={100}
        />
      )
      
      const provider = screen.getByTestId('paypal-script-provider')
      expect(provider).toHaveAttribute('data-client-id', 'test-client-id')
    })

    it('debe llamar a create-order API al crear orden', async () => {
      process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID = 'test-client-id'
      const mockFetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ orderId: 'test-order-123' }),
      })
      ;(global.fetch as any) = mockFetch

      render(
        <PayPalButton
          projectId="project-123"
          amount={100}
        />
      )
      
      const createOrderButton = screen.getByTestId('paypal-create-order')
      createOrderButton.click()

      await vi.waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/paypal/create-order',
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              project_id: 'project-123',
              reward_id: null,
              amount: '100.00',
            }),
          })
        )
      })
    })

    it('debe incluir rewardId si se proporciona', async () => {
      process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID = 'test-client-id'
      const mockFetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ orderId: 'test-order-123' }),
      })
      ;(global.fetch as any) = mockFetch

      render(
        <PayPalButton
          projectId="project-123"
          rewardId="reward-456"
          amount={50}
        />
      )
      
      const createOrderButton = screen.getByTestId('paypal-create-order')
      createOrderButton.click()

      await vi.waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/paypal/create-order',
          expect.objectContaining({
            body: JSON.stringify({
              project_id: 'project-123',
              reward_id: 'reward-456',
              amount: '50.00',
            }),
          })
        )
      })
    })

    it('debe llamar a capture-order API al aprobar pago', async () => {
      process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID = 'test-client-id'
      const mockFetch = vi.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ orderId: 'test-order-123' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        })
      ;(global.fetch as any) = mockFetch

      const onSuccess = vi.fn()

      render(
        <PayPalButton
          projectId="project-123"
          amount={100}
          onSuccess={onSuccess}
        />
      )
      
      // Primero crear orden
      const createOrderButton = screen.getByTestId('paypal-create-order')
      createOrderButton.click()

      await vi.waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(1)
      })

      // Luego aprobar
      const approveButton = screen.getByTestId('paypal-approve')
      approveButton.click()

      await vi.waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/paypal/capture-order',
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              orderId: 'test-order-id',
            }),
          })
        )
      })

      await vi.waitFor(() => {
        expect(onSuccess).toHaveBeenCalled()
      })
    })

    it('debe manejar errores en create-order', async () => {
      process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID = 'test-client-id'
      const mockFetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Error al crear orden' }),
      })
      ;(global.fetch as any) = mockFetch

      const onError = vi.fn()
      const { logger } = await import('@/lib/utils/logger')

      render(
        <PayPalButton
          projectId="project-123"
          amount={100}
          onError={onError}
        />
      )
      
      const createOrderButton = screen.getByTestId('paypal-create-order')
      createOrderButton.click()

      await vi.waitFor(() => {
        expect(logger.error).toHaveBeenCalledWith(
          'PayPal create order failed',
          expect.any(Error),
          {
            projectId: 'project-123',
            rewardId: undefined,
            amount: 100,
          }
        )
        expect(onError).toHaveBeenCalledWith('Error al crear orden')
      })
    })

    it('debe manejar errores en capture-order', async () => {
      process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID = 'test-client-id'
      const mockFetch = vi.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ orderId: 'test-order-123' }),
        })
        .mockResolvedValueOnce({
          ok: false,
          json: async () => ({ error: 'Error al capturar pago' }),
        })
      ;(global.fetch as any) = mockFetch

      const onError = vi.fn()
      const { logger } = await import('@/lib/utils/logger')

      render(
        <PayPalButton
          projectId="project-123"
          amount={100}
          onError={onError}
        />
      )
      
      // Crear orden primero
      const createOrderButton = screen.getByTestId('paypal-create-order')
      createOrderButton.click()

      await vi.waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(1)
      })

      // Intentar capturar
      const approveButton = screen.getByTestId('paypal-approve')
      approveButton.click()

      await vi.waitFor(() => {
        expect(logger.error).toHaveBeenCalledWith(
          'PayPal capture order failed',
          expect.any(Error),
          {
            orderId: 'test-order-id',
            projectId: 'project-123',
          }
        )
        expect(onError).toHaveBeenCalledWith('Error al capturar pago')
      })
    })

    it('debe manejar errores del SDK de PayPal', async () => {
      process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID = 'test-client-id'
      const onError = vi.fn()
      const { logger } = await import('@/lib/utils/logger')

      render(
        <PayPalButton
          projectId="project-123"
          amount={100}
          onError={onError}
        />
      )
      
      const errorButton = screen.getByTestId('paypal-error')
      errorButton.click()

      expect(logger.error).toHaveBeenCalledWith(
        'PayPal SDK error',
        expect.any(Error),
        { projectId: 'project-123' }
      )
      expect(onError).toHaveBeenCalledWith('Error en el proceso de pago con PayPal')
    })

    it('debe manejar cancelación de pago', () => {
      process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID = 'test-client-id'
      const onError = vi.fn()

      render(
        <PayPalButton
          projectId="project-123"
          amount={100}
          onError={onError}
        />
      )
      
      const cancelButton = screen.getByTestId('paypal-cancel')
      cancelButton.click()

      expect(onError).toHaveBeenCalledWith('Pago cancelado')
    })

    it('debe tener aria-labels accesibles', () => {
      process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID = 'test-client-id'

      render(
        <PayPalButton
          projectId="project-123"
          amount={100}
        />
      )
      
      const container = screen.getByRole('group')
      expect(container).toHaveAttribute('aria-label', 'Pago con PayPal')
    })
  })

  describe('PayPalButtonPlaceholder', () => {
    it('debe renderizar botón deshabilitado', () => {
      render(<PayPalButtonPlaceholder />)
      
      const button = screen.getByLabelText(/inicia sesión para apoyar/i)
      expect(button).toBeDisabled()
      expect(button).toHaveTextContent(/inicia sesión para apoyar este proyecto/i)
    })
  })
})

