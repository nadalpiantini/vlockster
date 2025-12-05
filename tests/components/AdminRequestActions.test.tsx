import * as React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AdminRequestActions } from '@/components/AdminRequestActions'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: vi.fn(),
  }),
}))

// Mock fetch
global.fetch = vi.fn()

describe('AdminRequestActions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe renderizar botones de aprobar y rechazar', () => {
    render(<AdminRequestActions requestId="test-request-id" />)
    
    expect(screen.getByLabelText(/aprobar solicitud/i)).toBeDefined()
    expect(screen.getByLabelText(/rechazar solicitud/i)).toBeDefined()
  })

  it('debe llamar a la API al hacer clic en aprobar', async () => {
    const user = userEvent.setup()
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    })
    ;(global.fetch as any) = mockFetch

    render(<AdminRequestActions requestId="test-request-id" />)
    
    const approveButton = screen.getByLabelText(/aprobar solicitud/i)
    await user.click(approveButton)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/admin/approve-request',
        expect.objectContaining({
          method: 'POST',
        })
      )
    })
  })

  it('debe mostrar error si la solicitud falla', async () => {
    const user = userEvent.setup()
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Error de red' }),
    })

    render(<AdminRequestActions requestId="test-request-id" />)
    
    const approveButton = screen.getByLabelText(/aprobar solicitud/i)
    await user.click(approveButton)

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeDefined()
    })
  })

  it('debe tener aria-labels accesibles', () => {
    render(<AdminRequestActions requestId="test-request-id" />)
    
    const group = screen.getByRole('group')
    expect(group).toHaveAttribute('aria-label', 'Acciones de solicitud')
  })
})

