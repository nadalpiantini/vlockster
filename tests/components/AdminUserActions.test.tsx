import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AdminUserActions } from '@/components/AdminUserActions'

// Mock fetch
global.fetch = vi.fn()

describe('AdminUserActions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    } as Response)
  })

  it('debe renderizar los botones de roles', () => {
    render(<AdminUserActions userId="user-123" currentRole="viewer" />)
    expect(screen.getByLabelText(/Cambiar rol a viewer/)).toBeDefined()
    expect(screen.getByLabelText(/Cambiar rol a creator/)).toBeDefined()
    expect(screen.getByLabelText(/Cambiar rol a moderator/)).toBeDefined()
    expect(screen.getByLabelText(/Cambiar rol a admin/)).toBeDefined()
  })

  it('debe marcar el rol actual como pressed', () => {
    render(<AdminUserActions userId="user-123" currentRole="viewer" />)
    const viewerButton = screen.getByLabelText(/Cambiar rol a viewer.*rol actual/)
    expect(viewerButton).toHaveAttribute('aria-pressed', 'true')
  })

  it('debe tener role="group" y aria-label', () => {
    const { container } = render(<AdminUserActions userId="user-123" currentRole="viewer" />)
    const group = container.querySelector('[role="group"]')
    expect(group).toBeDefined()
    expect(group).toHaveAttribute('aria-label', 'Opciones de rol de usuario')
  })

  it('debe llamar a la API al cambiar rol', async () => {
    render(<AdminUserActions userId="user-123" currentRole="viewer" />)
    const creatorButton = screen.getByLabelText(/Cambiar rol a creator/)
    
    fireEvent.click(creatorButton)
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/admin/update-user-role'),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('creator'),
        })
      )
    })
  })
})
