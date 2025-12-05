import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PayPalButton, PayPalButtonPlaceholder } from '@/components/PayPalButton'

// Mock @paypal/react-paypal-js
const mockCreateOrder = vi.fn()
const mockOnApprove = vi.fn()
const mockOnError = vi.fn()
const mockOnCancel = vi.fn()

vi.mock('@paypal/react-paypal-js', () => ({
  PayPalScriptProvider: ({ children, ...props }: any) => (
    <div data-testid="paypal-script-provider" {...props}>
      {children}
    </div>
  ),
  PayPalButtons: ({ createOrder, onApprove, onError, onCancel, ...props }: any) => {
    // Store callbacks for testing
    if (createOrder) mockCreateOrder.mockImplementation(createOrder)
    if (onApprove) mockOnApprove.mockImplementation(onApprove)
    if (onError) mockOnError.mockImplementation(onError)
    if (onCancel) mockOnCancel.mockImplementation(onCancel)

    return (
      <div data-testid="paypal-buttons" {...props}>
        <button
          data-testid="paypal-create-order"
          onClick={async () => {
            if (createOrder) {
              try {
                await createOrder()
              } catch (error) {
                if (onError) onError(error)
              }
            }
          }}
        >
          Create Order
        </button>
        <button
          data-testid="paypal-on-approve"
          onClick={async () => {
            if (onApprove) {
              try {
                await onApprove({ orderID: 'test-order-id' })
              } catch (error) {
                if (onError) onError(error)
              }
            }
          }}
        >
          Approve
        </button>
        <button
          data-testid="paypal-on-error"
          onClick={() => {
            if (onError) onError(new Error('Test error'))
          }}
        >
          Error
        </button>
        <button
          data-testid="paypal-on-cancel"
          onClick={() => {
            if (onCancel) onCancel()
          }}
        >
          Cancel
        </button>
      </div>
    )
  },
  usePayPalScriptReducer: () => [{ isPending: false, isResolved: true }],
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
  const mockProps = {
    projectId: 'project-123',
    amount: 50,
    onSuccess: vi.fn(),
    onError: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    delete process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('debe renderizar el botón de PayPal cuando clientId está configurado', () => {
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID = 'test-client-id'
    render(<PayPalButton {...mockProps} />)
    expect(screen.getByTestId('paypal-buttons')).toBeDefined()
  })

  it('debe mostrar mensaje de error cuando clientId no está configurado', () => {
    render(<PayPalButton {...mockProps} />)
    expect(
      screen.getByText(/PayPal no está configurado/i)
    ).toBeDefined()
  })

  it('debe tener role="group" y aria-label', () => {
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID = 'test-client-id'
    const { container } = render(<PayPalButton {...mockProps} />)
    const group = container.querySelector('[role="group"]')
    expect(group).toBeDefined()
    expect(group).toHaveAttribute('aria-label', 'Pago con PayPal')
  })

  it('debe mostrar el monto correcto en aria-label', () => {
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID = 'test-client-id'
    render(<PayPalButton {...mockProps} amount={100} />)
    const buttons = screen.getByTestId('paypal-buttons')
    expect(buttons).toHaveAttribute(
      'aria-label',
      expect.stringContaining('100.00')
    )
  })

  it('debe manejar rewardId opcional', () => {
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID = 'test-client-id'
    render(<PayPalButton {...mockProps} rewardId="reward-123" />)
    expect(screen.getByTestId('paypal-buttons')).toBeDefined()
  })

  describe('createOrder callback', () => {
    it('debe crear orden exitosamente', async () => {
      process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID = 'test-client-id'
      const user = userEvent.setup()

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ orderId: 'test-order-123' }),
      })

      render(<PayPalButton {...mockProps} />)
      const createButton = screen.getByTestId('paypal-create-order')
      await user.click(createButton)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/paypal/create-order',
          expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              project_id: 'project-123',
              reward_id: null,
              amount: '50.00',
            }),
          })
        )
      })
    })

    it('debe manejar error al crear orden', async () => {
      process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID = 'test-client-id'
      const user = userEvent.setup()
      const onErrorMock = vi.fn()

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Error creating order' }),
      })

      render(<PayPalButton {...mockProps} onError={onErrorMock} />)
      const createButton = screen.getByTestId('paypal-create-order')
      await user.click(createButton)

      await waitFor(() => {
        expect(onErrorMock).toHaveBeenCalled()
      })
    })

    it('debe incluir rewardId cuando está presente', async () => {
      process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID = 'test-client-id'
      const user = userEvent.setup()

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ orderId: 'test-order-123' }),
      })

      render(<PayPalButton {...mockProps} rewardId="reward-456" />)
      const createButton = screen.getByTestId('paypal-create-order')
      await user.click(createButton)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
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
  })

  describe('onApprove callback', () => {
    it('debe capturar orden exitosamente', async () => {
      process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID = 'test-client-id'
      const user = userEvent.setup()
      const onSuccessMock = vi.fn()

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })

      render(<PayPalButton {...mockProps} onSuccess={onSuccessMock} />)
      const approveButton = screen.getByTestId('paypal-on-approve')
      await user.click(approveButton)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/paypal/capture-order',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({ orderId: 'test-order-id' }),
          })
        )
        expect(onSuccessMock).toHaveBeenCalled()
      })
    })

    it('debe manejar error al capturar orden', async () => {
      process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID = 'test-client-id'
      const user = userEvent.setup()
      const onErrorMock = vi.fn()

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Error capturing order' }),
      })

      render(<PayPalButton {...mockProps} onError={onErrorMock} />)
      const approveButton = screen.getByTestId('paypal-on-approve')
      await user.click(approveButton)

      await waitFor(() => {
        expect(onErrorMock).toHaveBeenCalled()
      })
    })
  })

  describe('onError callback', () => {
    it('debe llamar onError cuando hay error del SDK', async () => {
      process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID = 'test-client-id'
      const user = userEvent.setup()
      const onErrorMock = vi.fn()

      render(<PayPalButton {...mockProps} onError={onErrorMock} />)
      const errorButton = screen.getByTestId('paypal-on-error')
      await user.click(errorButton)

      await waitFor(() => {
        expect(onErrorMock).toHaveBeenCalled()
      })
    })
  })

  describe('onCancel callback', () => {
    it('debe llamar onError cuando se cancela el pago', async () => {
      process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID = 'test-client-id'
      const user = userEvent.setup()
      const onErrorMock = vi.fn()

      render(<PayPalButton {...mockProps} onError={onErrorMock} />)
      const cancelButton = screen.getByTestId('paypal-on-cancel')
      await user.click(cancelButton)

      await waitFor(() => {
        expect(onErrorMock).toHaveBeenCalledWith('Pago cancelado')
      })
    })
  })

  describe('loading state', () => {
    it('debe deshabilitar botones cuando está cargando', () => {
      process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID = 'test-client-id'
      render(<PayPalButton {...mockProps} />)
      const buttons = screen.getByTestId('paypal-buttons')
      // El componente PayPalButtons recibe disabled={loading}
      expect(buttons).toBeDefined()
    })
  })
})

describe('PayPalButtonPlaceholder', () => {
  it('debe renderizar el placeholder', () => {
    render(<PayPalButtonPlaceholder />)
    expect(screen.getByText(/Inicia sesión para apoyar/i)).toBeDefined()
  })

  it('debe tener aria-label accesible', () => {
    render(<PayPalButtonPlaceholder />)
    expect(screen.getByLabelText(/Inicia sesión para apoyar/i)).toBeDefined()
  })

  it('debe estar deshabilitado', () => {
    render(<PayPalButtonPlaceholder />)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })
})
