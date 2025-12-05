import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { CookieConsent, useCookieConsent } from '@/components/CookieConsent'

// Mock next/link
vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

describe('CookieConsent', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('no debe mostrar banner si ya hay consentimiento', async () => {
    localStorage.setItem('vlockster-cookie-consent', JSON.stringify({
      accepted: true,
      timestamp: new Date().toISOString(),
      version: '1.0',
    }))

    const { container } = render(<CookieConsent />)
    
    await waitFor(() => {
      expect(container.firstChild).toBeNull()
    }, { timeout: 2000 })
  })

  it('debe mostrar banner después de 1 segundo si no hay consentimiento', async () => {
    vi.useFakeTimers()
    
    render(<CookieConsent />)
    
    // Inicialmente no debe estar visible
    expect(screen.queryByRole('dialog')).toBeNull()
    
    // Avanzar 1 segundo
    vi.advanceTimersByTime(1000)
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeDefined()
    })
    
    vi.useRealTimers()
  })

  it('debe tener atributos ARIA correctos', async () => {
    vi.useFakeTimers()
    
    render(<CookieConsent />)
    vi.advanceTimersByTime(1000)
    
    await waitFor(() => {
      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-live', 'polite')
      expect(dialog).toHaveAttribute('aria-modal', 'true')
      expect(dialog).toHaveAttribute('aria-labelledby', 'cookie-consent-title')
      expect(dialog).toHaveAttribute('aria-describedby', 'cookie-consent-description')
    })
    
    vi.useRealTimers()
  })

  it('debe guardar consentimiento al aceptar', async () => {
    vi.useFakeTimers()
    
    render(<CookieConsent />)
    vi.advanceTimersByTime(1000)
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeDefined()
    })
    
    const acceptButton = screen.getByLabelText(/aceptar cookies/i)
    fireEvent.click(acceptButton)
    
    await waitFor(() => {
      const consent = localStorage.getItem('vlockster-cookie-consent')
      expect(consent).toBeTruthy()
      const parsed = JSON.parse(consent!)
      expect(parsed.accepted).toBe(true)
      expect(parsed.version).toBe('1.0')
    })
    
    vi.useRealTimers()
  })

  it('debe guardar rechazo al rechazar', async () => {
    vi.useFakeTimers()
    
    render(<CookieConsent />)
    vi.advanceTimersByTime(1000)
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeDefined()
    })
    
    const rejectButton = screen.getByLabelText(/rechazar cookies/i)
    fireEvent.click(rejectButton)
    
    await waitFor(() => {
      const consent = localStorage.getItem('vlockster-cookie-consent')
      expect(consent).toBeTruthy()
      const parsed = JSON.parse(consent!)
      expect(parsed.accepted).toBe(false)
    })
    
    vi.useRealTimers()
  })

  it('debe cerrar banner al aceptar', async () => {
    vi.useFakeTimers()
    
    const { container } = render(<CookieConsent />)
    vi.advanceTimersByTime(1000)
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeDefined()
    })
    
    const acceptButton = screen.getByLabelText(/aceptar cookies/i)
    fireEvent.click(acceptButton)
    
    await waitFor(() => {
      expect(container.firstChild).toBeNull()
    })
    
    vi.useRealTimers()
  })

  it('debe cerrar banner con Escape key', async () => {
    vi.useFakeTimers()
    
    const { container } = render(<CookieConsent />)
    vi.advanceTimersByTime(1000)
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeDefined()
    })
    
    const dialog = screen.getByRole('dialog')
    fireEvent.keyDown(dialog, { key: 'Escape' })
    
    await waitFor(() => {
      expect(container.firstChild).toBeNull()
    })
    
    vi.useRealTimers()
  })

  it('debe tener links a política de privacidad y términos', async () => {
    vi.useFakeTimers()
    
    render(<CookieConsent />)
    vi.advanceTimersByTime(1000)
    
    await waitFor(() => {
      expect(screen.getByLabelText(/política de privacidad/i)).toBeDefined()
      expect(screen.getByLabelText(/términos de uso/i)).toBeDefined()
    })
    
    const privacyLink = screen.getByLabelText(/política de privacidad/i)
    const termsLink = screen.getByLabelText(/términos de uso/i)
    
    expect(privacyLink).toHaveAttribute('href', '/legal/privacy')
    expect(termsLink).toHaveAttribute('href', '/legal/terms')
    
    vi.useRealTimers()
  })
})

describe('useCookieConsent', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('debe retornar null si no hay consentimiento', () => {
    const TestComponent = () => {
      const consent = useCookieConsent()
      return <div>{consent ? 'Has consent' : 'No consent'}</div>
    }

    render(<TestComponent />)
    expect(screen.getByText('No consent')).toBeDefined()
  })

  it('debe retornar consentimiento si existe', () => {
    localStorage.setItem('vlockster-cookie-consent', JSON.stringify({
      accepted: true,
      timestamp: '2025-01-01T00:00:00.000Z',
      version: '1.0',
    }))

    const TestComponent = () => {
      const consent = useCookieConsent()
      return <div>{consent ? `Consent: ${consent.accepted}` : 'No consent'}</div>
    }

    render(<TestComponent />)
    expect(screen.getByText('Consent: true')).toBeDefined()
  })
})
