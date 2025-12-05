import * as React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AdminReportActions } from '@/components/AdminReportActions'

// Mock next/navigation
const mockRefresh = vi.fn()
const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: mockRefresh,
    push: mockPush,
  }),
}))

// Mock fetch
global.fetch = vi.fn()

describe('AdminReportActions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe renderizar botones de acción', () => {
    render(
      <AdminReportActions 
        reportId="report-123"
        contentType="video"
        contentId="video-456"
      />
    )
    
    expect(screen.getByLabelText(/ver contenido/i)).toBeDefined()
    expect(screen.getByLabelText(/resolver reporte/i)).toBeDefined()
    expect(screen.getByLabelText(/rechazar reporte/i)).toBeDefined()
  })

  it('debe navegar al contenido correcto según el tipo', async () => {
    const user = userEvent.setup()

    render(
      <AdminReportActions 
        reportId="report-123"
        contentType="project"
        contentId="project-789"
      />
    )
    
    const viewButton = screen.getByLabelText(/ver contenido/i)
    await user.click(viewButton)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/projects/project-789')
    })
  })

  it('debe generar URL correcta para diferentes tipos de contenido', async () => {
    const user = userEvent.setup()

    const { rerender } = render(
      <AdminReportActions 
        reportId="report-123"
        contentType="video"
        contentId="video-1"
      />
    )
    
    let viewButton = screen.getByLabelText(/ver contenido/i)
    await user.click(viewButton)
    expect(mockPush).toHaveBeenCalledWith('/watch/video-1')

    mockPush.mockClear()
    rerender(
      <AdminReportActions 
        reportId="report-123"
        contentType="post"
        contentId="post-2"
      />
    )
    
    viewButton = screen.getByLabelText(/ver contenido/i)
    await user.click(viewButton)
    expect(mockPush).toHaveBeenCalledWith('/community/post/post-2')
  })

  it('debe llamar a la API al resolver reporte', async () => {
    const user = userEvent.setup()
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    })
    ;(global.fetch as any) = mockFetch

    const onResolved = vi.fn()

    render(
      <AdminReportActions 
        reportId="report-123"
        contentType="video"
        contentId="video-456"
        onResolved={onResolved}
      />
    )
    
    const resolveButton = screen.getByLabelText(/resolver reporte report-123/i)
    await user.click(resolveButton)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/admin/resolve-report',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            reportId: 'report-123',
            action: 'resolve',
          }),
        })
      )
    })

    await waitFor(() => {
      expect(onResolved).toHaveBeenCalled()
    })
  })

  it('debe llamar a la API al rechazar reporte', async () => {
    const user = userEvent.setup()
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    })
    ;(global.fetch as any) = mockFetch

    render(
      <AdminReportActions 
        reportId="report-123"
        contentType="video"
        contentId="video-456"
      />
    )
    
    const dismissButton = screen.getByLabelText(/rechazar reporte report-123/i)
    await user.click(dismissButton)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/admin/resolve-report',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            reportId: 'report-123',
            action: 'dismiss',
          }),
        })
      )
    })

    // Si no hay onResolved, debe llamar a router.refresh
    await waitFor(() => {
      expect(mockRefresh).toHaveBeenCalled()
    })
  })

  it('debe mostrar error si la resolución falla', async () => {
    const user = userEvent.setup()
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Error al resolver' }),
    })

    render(
      <AdminReportActions 
        reportId="report-123"
        contentType="video"
        contentId="video-456"
      />
    )
    
    const resolveButton = screen.getByLabelText(/resolver reporte report-123/i)
    await user.click(resolveButton)

    await waitFor(() => {
      expect(screen.getByText(/error al resolver/i)).toBeDefined()
    })
  })

  it('debe mostrar estado de carga mientras resuelve', async () => {
    const user = userEvent.setup()
    let resolveFetch: (value: any) => void
    const mockFetch = vi.fn().mockImplementation(() => {
      return new Promise((resolve) => {
        resolveFetch = resolve
      })
    })
    ;(global.fetch as any) = mockFetch

    render(
      <AdminReportActions 
        reportId="report-123"
        contentType="video"
        contentId="video-456"
      />
    )
    
    const resolveButton = screen.getByLabelText(/resolver reporte report-123/i)
    await user.click(resolveButton)

    // Debe mostrar "Resolviendo..."
    await waitFor(() => {
      expect(screen.getByText(/resolviendo/i)).toBeDefined()
    })

    // Los botones deben estar deshabilitados
    await waitFor(() => {
      expect(resolveButton).toBeDisabled()
    })

    // Resolver la promesa
    resolveFetch!({
      ok: true,
      json: async () => ({}),
    })

    await waitFor(() => {
      expect(screen.getByText(/resolver/i)).toBeDefined()
      expect(resolveButton).not.toBeDisabled()
    })
  })

  it('debe tener aria-labels accesibles', () => {
    render(
      <AdminReportActions 
        reportId="report-123"
        contentType="video"
        contentId="video-456"
      />
    )
    
    const group = screen.getByRole('group')
    expect(group).toHaveAttribute('aria-label', 'Acciones de reporte')
    
    const errorAlert = screen.queryByRole('alert')
    // No hay error inicialmente, pero cuando aparece debe tener role="alert"
    expect(errorAlert).toBeNull()
  })

  it('debe mostrar mensaje de error con aria-live', async () => {
    const user = userEvent.setup()
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Error de red' }),
    })

    render(
      <AdminReportActions 
        reportId="report-123"
        contentType="video"
        contentId="video-456"
      />
    )
    
    const resolveButton = screen.getByLabelText(/resolver reporte report-123/i)
    await user.click(resolveButton)

    await waitFor(() => {
      const errorAlert = screen.getByRole('alert')
      expect(errorAlert).toHaveAttribute('aria-live', 'polite')
      expect(errorAlert).toHaveTextContent(/error de red/i)
    })
  })
})

