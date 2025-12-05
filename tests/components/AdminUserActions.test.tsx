import * as React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AdminUserActions } from '@/components/AdminUserActions'

// Mock fetch
global.fetch = vi.fn()

describe('AdminUserActions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe renderizar todos los roles disponibles', () => {
    render(
      <AdminUserActions userId="user-123" currentRole="viewer" />
    )
    
    expect(screen.getByLabelText(/cambiar rol a viewer/i)).toBeDefined()
    expect(screen.getByLabelText(/cambiar rol a creator/i)).toBeDefined()
    expect(screen.getByLabelText(/cambiar rol a moderator/i)).toBeDefined()
    expect(screen.getByLabelText(/cambiar rol a admin/i)).toBeDefined()
  })

  it('debe marcar el rol actual como presionado', () => {
    render(
      <AdminUserActions userId="user-123" currentRole="creator" />
    )
    
    const creatorButton = screen.getByLabelText(/cambiar rol a creator.*rol actual/i)
    expect(creatorButton).toHaveAttribute('aria-pressed', 'true')
  })

  it('debe deshabilitar el botón del rol actual', () => {
    render(
      <AdminUserActions userId="user-123" currentRole="admin" />
    )
    
    const adminButton = screen.getByLabelText(/cambiar rol a admin.*rol actual/i)
    expect(adminButton).toBeDisabled()
  })

  it('debe llamar a la API al cambiar rol', async () => {
    const user = userEvent.setup()
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    })
    ;(global.fetch as any) = mockFetch

    const onRoleUpdated = vi.fn()

    render(
      <AdminUserActions 
        userId="user-123" 
        currentRole="viewer"
        onRoleUpdated={onRoleUpdated}
      />
    )
    
    const creatorButton = screen.getByLabelText(/cambiar rol a creator/i)
    await user.click(creatorButton)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/admin/update-user-role',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: 'user-123',
            role: 'creator',
          }),
        })
      )
    })

    await waitFor(() => {
      expect(onRoleUpdated).toHaveBeenCalled()
    })
  })

  it('no debe llamar a la API si se selecciona el mismo rol', async () => {
    const user = userEvent.setup()
    const mockFetch = vi.fn()
    ;(global.fetch as any) = mockFetch

    render(
      <AdminUserActions userId="user-123" currentRole="viewer" />
    )
    
    const viewerButton = screen.getByLabelText(/cambiar rol a viewer.*rol actual/i)
    await user.click(viewerButton)

    // Esperar un momento para asegurar que no se llama
    await waitFor(() => {
      expect(mockFetch).not.toHaveBeenCalled()
    }, { timeout: 100 })
  })

  it('debe mostrar error si la actualización falla', async () => {
    const user = userEvent.setup()
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Error de red' }),
    })

    render(
      <AdminUserActions userId="user-123" currentRole="viewer" />
    )
    
    const creatorButton = screen.getByLabelText(/cambiar rol a creator/i)
    await user.click(creatorButton)

    await waitFor(() => {
      expect(screen.getByText(/error de red/i)).toBeDefined()
    })
  })

  it('debe mostrar estado de carga mientras actualiza', async () => {
    const user = userEvent.setup()
    let resolveFetch: (value: any) => void
    const mockFetch = vi.fn().mockImplementation(() => {
      return new Promise((resolve) => {
        resolveFetch = resolve
      })
    })
    ;(global.fetch as any) = mockFetch

    render(
      <AdminUserActions userId="user-123" currentRole="viewer" />
    )
    
    const creatorButton = screen.getByLabelText(/cambiar rol a creator/i)
    await user.click(creatorButton)

    // El botón debe estar deshabilitado mientras carga
    await waitFor(() => {
      expect(creatorButton).toBeDisabled()
    })

    // Resolver la promesa
    resolveFetch!({
      ok: true,
      json: async () => ({}),
    })

    await waitFor(() => {
      expect(creatorButton).not.toBeDisabled()
    })
  })

  it('debe tener aria-labels accesibles', () => {
    render(
      <AdminUserActions userId="user-123" currentRole="viewer" />
    )
    
    const group = screen.getByRole('group')
    expect(group).toHaveAttribute('aria-label', 'Opciones de rol de usuario')
  })
})

