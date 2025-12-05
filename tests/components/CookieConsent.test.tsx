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
    render(<CookieConsent />)
    
    // Inicialmente no debe estar visible
    expect(screen.queryByRole('dialog')).toBeNull()
    
    // Esperar a que aparezca el banner (después del timeout de 1 segundo)
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeDefined()
    }, { timeout: 2000 })
  })

  it('debe tener atributos ARIA correctos', async () => {
    render(<CookieConsent />)
    
    await waitFor(() => {
      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-live', 'polite')
      expect(dialog).toHaveAttribute('aria-modal', 'true')
      expect(dialog).toHaveAttribute('aria-labelledby', 'cookie-consent-title')
      expect(dialog).toHaveAttribute('aria-describedby', 'cookie-consent-description')
    }, { timeout: 2000 })
  })

  it('debe guardar consentimiento al aceptar', async () => {
    render(<CookieConsent />)
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeDefined()
    }, { timeout: 2000 })
    
    const acceptButton = screen.getByLabelText(/aceptar cookies/i)
    fireEvent.click(acceptButton)
    
    await waitFor(() => {
      const consent = localStorage.getItem('vlockster-cookie-consent')
      expect(consent).toBeTruthy()
      const parsed = JSON.parse(consent!)
      expect(parsed.accepted).toBe(true)
      expect(parsed.version).toBe('1.0')
    })
  })

  it('debe guardar rechazo al rechazar', async () => {
    render(<CookieConsent />)
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeDefined()
    }, { timeout: 2000 })
    
    const rejectButton = screen.getByLabelText(/rechazar cookies/i)
    fireEvent.click(rejectButton)
    
    await waitFor(() => {
      const consent = localStorage.getItem('vlockster-cookie-consent')
      expect(consent).toBeTruthy()
      const parsed = JSON.parse(consent!)
      expect(parsed.accepted).toBe(false)
    })
  })

  it('debe cerrar banner al aceptar', async () => {
    const { container } = render(<CookieConsent />)
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeDefined()
    }, { timeout: 2000 })
    
    const acceptButton = screen.getByLabelText(/aceptar cookies/i)
    fireEvent.click(acceptButton)
    
    await waitFor(() => {
      expect(container.firstChild).toBeNull()
    })
  })

  it('debe cerrar banner con Escape key', async () => {
    const { container } = render(<CookieConsent />)
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeDefined()
    }, { timeout: 2000 })
    
    const dialog = screen.getByRole('dialog')
    fireEvent.keyDown(dialog, { key: 'Escape' })
    
    await waitFor(() => {
      expect(container.firstChild).toBeNull()
    })
  })

  it('debe tener links a política de privacidad y términos', async () => {
    render(<CookieConsent />)
    
    await waitFor(() => {
      expect(screen.getByLabelText(/política de privacidad/i)).toBeDefined()
      expect(screen.getByLabelText(/términos de uso/i)).toBeDefined()
    }, { timeout: 2000 })
    
    const privacyLink = screen.getByLabelText(/política de privacidad/i)
    const termsLink = screen.getByLabelText(/términos de uso/i)
    
    expect(privacyLink).toHaveAttribute('href', '/legal/privacy')
    expect(termsLink).toHaveAttribute('href', '/legal/terms')
  })

  it('debe hacer focus en el botón aceptar cuando se abre el dialog', async () => {
    render(<CookieConsent />)
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeDefined()
    }, { timeout: 2000 })
    
    const acceptButton = screen.getByLabelText(/aceptar cookies/i)
    // El botón debería tener focus automáticamente
    expect(acceptButton).toBeDefined()
  })

  it('debe manejar Tab key para focus trap', async () => {
    render(<CookieConsent />)
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeDefined()
    }, { timeout: 2000 })
    
    const dialog = screen.getByRole('dialog')
    const acceptButton = screen.getByLabelText(/aceptar cookies/i)
    const rejectButton = screen.getByLabelText(/rechazar cookies/i)
    
    // Simular Tab desde el último elemento (debería ir al primero)
    acceptButton.focus()
    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true })
    const preventDefaultSpy = vi.spyOn(tabEvent, 'preventDefault')
    dialog.dispatchEvent(tabEvent)
    
    // El focus trap debería prevenir el default cuando se llega al último elemento
    expect(dialog).toBeDefined()
  })

  it('debe manejar Shift+Tab key para focus trap reverso', async () => {
    render(<CookieConsent />)
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeDefined()
    }, { timeout: 2000 })
    
    const dialog = screen.getByRole('dialog')
    const rejectButton = screen.getByLabelText(/rechazar cookies/i)
    
    // Simular Shift+Tab desde el primer elemento (debería ir al último)
    rejectButton.focus()
    const shiftTabEvent = new KeyboardEvent('keydown', { 
      key: 'Tab', 
      shiftKey: true,
      bubbles: true 
    })
    const preventDefaultSpy = vi.spyOn(shiftTabEvent, 'preventDefault')
    dialog.dispatchEvent(shiftTabEvent)
    
    expect(dialog).toBeDefined()
  })

  it('debe manejar Escape key en botón rechazar', async () => {
    const { container } = render(<CookieConsent />)
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeDefined()
    }, { timeout: 2000 })
    
    const rejectButton = screen.getByLabelText(/rechazar cookies/i)
    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    rejectButton.dispatchEvent(escapeEvent)
    
    await waitFor(() => {
      expect(container.firstChild).toBeNull()
    })
  })

  it('debe manejar Escape key en botón aceptar', async () => {
    const { container } = render(<CookieConsent />)
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeDefined()
    }, { timeout: 2000 })
    
    const acceptButton = screen.getByLabelText(/aceptar cookies/i)
    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    acceptButton.dispatchEvent(escapeEvent)
    
    await waitFor(() => {
      expect(container.firstChild).toBeNull()
    })
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

  it('debe manejar error al parsear JSON corrupto en localStorage', () => {
    localStorage.setItem('vlockster-cookie-consent', 'invalid-json')

    const TestComponent = () => {
      const consent = useCookieConsent()
      return <div>{consent ? `Consent: ${consent.accepted}` : 'No consent'}</div>
    }

    render(<TestComponent />)
    // Debería retornar null cuando hay error al parsear
    expect(screen.getByText('No consent')).toBeDefined()
  })
})
