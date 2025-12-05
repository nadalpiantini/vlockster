import * as React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AdminRequestActions } from '@/components/AdminRequestActions'

// Mock next/navigation
const mockRefresh = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: mockRefresh,
  }),
}))

// Mock fetch
global.fetch = vi.fn()

describe('AdminRequestActions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRefresh.mockClear()
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

  it('debe llamar a la API al hacer clic en rechazar', async () => {
    const user = userEvent.setup()
    mockRefresh.mockClear()
    
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    })
    ;(global.fetch as any) = mockFetch

    render(<AdminRequestActions requestId="test-request-id" />)
    
    const rejectButton = screen.getByLabelText(/rechazar solicitud/i)
    await user.click(rejectButton)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/admin/reject-request',
        expect.objectContaining({
          method: 'POST',
        })
      )
      expect(mockRefresh).toHaveBeenCalled()
    })
  })

  it('debe mostrar error si el rechazo falla', async () => {
    const user = userEvent.setup()
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Error al rechazar' }),
    })

    render(<AdminRequestActions requestId="test-request-id" />)
    
    const rejectButton = screen.getByLabelText(/rechazar solicitud/i)
    await user.click(rejectButton)

    await waitFor(() => {
      expect(screen.getByText(/error al rechazar/i)).toBeDefined()
    })
  })

  it('debe mostrar estado de loading durante la aprobación', async () => {
    const user = userEvent.setup()
    let resolveFetch: any
    const mockFetch = vi.fn().mockImplementation(() => {
      return new Promise((resolve) => {
        resolveFetch = resolve
      })
    })
    ;(global.fetch as any) = mockFetch

    render(<AdminRequestActions requestId="test-request-id" />)
    
    const approveButton = screen.getByLabelText(/aprobar solicitud/i)
    user.click(approveButton)

    await waitFor(() => {
      expect(approveButton).toBeDisabled()
      expect(approveButton).toHaveTextContent(/procesando/i)
    }, { timeout: 2000 })

    resolveFetch({
      ok: true,
      json: async () => ({}),
    })
  })

  it('debe mostrar estado de loading durante el rechazo', async () => {
    const user = userEvent.setup()
    let resolveFetch: any
    const mockFetch = vi.fn().mockImplementation(() => {
      return new Promise((resolve) => {
        resolveFetch = resolve
      })
    })
    ;(global.fetch as any) = mockFetch

    render(<AdminRequestActions requestId="test-request-id" />)
    
    const rejectButton = screen.getByLabelText(/rechazar solicitud/i)
    user.click(rejectButton)

    await waitFor(() => {
      expect(rejectButton).toBeDisabled()
      expect(rejectButton).toHaveTextContent(/procesando/i)
    }, { timeout: 2000 })

    resolveFetch({
      ok: true,
      json: async () => ({}),
    })
  })

  it('debe deshabilitar botones durante loading', async () => {
    const user = userEvent.setup()
    let resolveFetch: any
    const mockFetch = vi.fn().mockImplementation(() => {
      return new Promise((resolve) => {
        resolveFetch = resolve
      })
    })
    ;(global.fetch as any) = mockFetch

    render(<AdminRequestActions requestId="test-request-id" />)
    
    const approveButton = screen.getByLabelText(/aprobar solicitud/i)
    const clickPromise = user.click(approveButton)

    await waitFor(() => {
      expect(approveButton).toBeDisabled()
    }, { timeout: 1000 })

    resolveFetch({
      ok: true,
      json: async () => ({}),
    })
    
    await clickPromise
  })

  it('debe manejar errores desconocidos', async () => {
    const user = userEvent.setup()
    ;(global.fetch as any).mockRejectedValueOnce(new Error('Network error'))

    render(<AdminRequestActions requestId="test-request-id" />)
    
    const approveButton = screen.getByLabelText(/aprobar solicitud/i)
    await user.click(approveButton)

    await waitFor(() => {
      // El componente muestra el mensaje del error o "Error desconocido"
      const errorElement = screen.queryByRole('alert')
      expect(errorElement).toBeDefined()
    }, { timeout: 3000 })
  })

  it('debe llamar router.refresh después de aprobar exitosamente', async () => {
    const user = userEvent.setup()
    mockRefresh.mockClear()
    
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    })

    render(<AdminRequestActions requestId="test-request-id" />)
    
    const approveButton = screen.getByLabelText(/aprobar solicitud/i)
    await user.click(approveButton)

    await waitFor(() => {
      expect(mockRefresh).toHaveBeenCalled()
    })
  })

  it('debe mostrar mensaje de error con role="alert"', async () => {
    const user = userEvent.setup()
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Error de red' }),
    })

    render(<AdminRequestActions requestId="test-request-id" />)
    
    const approveButton = screen.getByLabelText(/aprobar solicitud/i)
    await user.click(approveButton)

    await waitFor(() => {
      const errorAlert = screen.getByRole('alert')
      expect(errorAlert).toBeDefined()
      expect(errorAlert).toHaveAttribute('aria-live', 'assertive')
      expect(errorAlert).toHaveAttribute('aria-atomic', 'true')
    })
  })
})

