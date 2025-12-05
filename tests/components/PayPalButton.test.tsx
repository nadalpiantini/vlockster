import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PayPalButton, PayPalButtonPlaceholder } from '@/components/PayPalButton'

// Mock @paypal/react-paypal-js
vi.mock('@paypal/react-paypal-js', () => ({
  PayPalScriptProvider: ({ children, ...props }: any) => (
    <div data-testid="paypal-script-provider" {...props}>
      {children}
    </div>
  ),
  PayPalButtons: ({ onApprove, onError, ...props }: any) => (
    <div data-testid="paypal-buttons" {...props}>
      PayPal Buttons Mock
    </div>
  ),
  usePayPalScriptReducer: () => [{ isPending: false, isResolved: true }],
}))

describe('PayPalButton', () => {
  const mockProps = {
    projectId: 'project-123',
    amount: 50,
    onSuccess: vi.fn(),
    onError: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe renderizar el botón de PayPal', () => {
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID = 'test-client-id'
    render(<PayPalButton {...mockProps} />)
    expect(screen.getByTestId('paypal-buttons')).toBeDefined()
  })

  it('debe tener role="group" y aria-label', () => {
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID = 'test-client-id'
    const { container } = render(<PayPalButton {...mockProps} />)
    const group = container.querySelector('[role="group"]')
    expect(group).toBeDefined()
    expect(group).toHaveAttribute('aria-label', 'Pago con PayPal')
  })

  it('debe mostrar el monto correcto', () => {
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID = 'test-client-id'
    const { container } = render(<PayPalButton {...mockProps} amount={100} />)
    const group = container.querySelector('[role="group"]')
    expect(group).toHaveAttribute('aria-label', expect.stringContaining('100'))
  })

  it('debe manejar rewardId opcional', () => {
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID = 'test-client-id'
    render(<PayPalButton {...mockProps} rewardId="reward-123" />)
    expect(screen.getByTestId('paypal-buttons')).toBeDefined()
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
})
