import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AdminReportActions } from '@/components/AdminReportActions'

// Mock fetch
global.fetch = vi.fn()

describe('AdminReportActions', () => {
  const mockReport = {
    id: 'report-123',
    content_type: 'comment',
    content_id: 'content-123',
    reason: 'Spam',
    status: 'pending',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    } as Response)
  })

  it('debe renderizar los botones de acción', () => {
    render(<AdminReportActions report={mockReport} />)
    expect(screen.getByLabelText(/Ver contenido reportado/)).toBeDefined()
    expect(screen.getByLabelText(/Resolver reporte/)).toBeDefined()
    expect(screen.getByLabelText(/Rechazar reporte/)).toBeDefined()
  })

  it('debe tener role="group" y aria-label', () => {
    const { container } = render(<AdminReportActions report={mockReport} />)
    const group = container.querySelector('[role="group"]')
    expect(group).toBeDefined()
    expect(group).toHaveAttribute('aria-label', 'Acciones de reporte')
  })

  it('debe llamar a la API al resolver reporte', async () => {
    render(<AdminReportActions report={mockReport} />)
    const resolveButton = screen.getByLabelText(/Resolver reporte report-123/)
    
    fireEvent.click(resolveButton)
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/admin/resolve-report'),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('report-123'),
        })
      )
    })
  })

  it('debe mostrar error si la API falla', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: 'API Error' }),
    } as Response)

    render(<AdminReportActions report={mockReport} />)
    const resolveButton = screen.getByLabelText(/Resolver reporte report-123/)
    
    fireEvent.click(resolveButton)
    
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeDefined()
    })
  })
})
