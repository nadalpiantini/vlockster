import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('CookieConsent', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('no debe mostrar banner si ya hay consentimiento', () => {
    const consentData = {
      accepted: true,
      timestamp: new Date().toISOString(),
      version: '1.0',
    }
    localStorage.setItem('vlockster-cookie-consent', JSON.stringify(consentData))

    const { container } = render(<CookieConsent />)
    
    expect(container.firstChild).toBeNull()
  })

  it('debe mostrar banner después de 1 segundo si no hay consentimiento', async () => {
    render(<CookieConsent />)
    
    // Inicialmente no debe estar visible
    expect(screen.queryByRole('dialog')).toBeNull()
    
    // Avanzar 1 segundo
    await vi.advanceTimersByTimeAsync(1000)
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeDefined()
    }, { timeout: 2000 })
  })

  it('debe tener atributos de accesibilidad correctos', async () => {
    render(<CookieConsent />)
    
    await vi.advanceTimersByTimeAsync(1000)
    
    await waitFor(() => {
      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-live', 'polite')
      expect(dialog).toHaveAttribute('aria-modal', 'true')
      expect(dialog).toHaveAttribute('aria-labelledby', 'cookie-consent-title')
      expect(dialog).toHaveAttribute('aria-describedby', 'cookie-consent-description')
    }, { timeout: 2000 })
  })

  it('debe guardar consentimiento aceptado en localStorage', async () => {
    const user = userEvent.setup({ delay: null })
    vi.advanceTimersByTime(1000)
    
    render(<CookieConsent />)
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeDefined()
    })
    
    const acceptButton = screen.getByLabelText(/aceptar cookies/i)
    await user.click(acceptButton)
    
    const consentData = JSON.parse(localStorage.getItem('vlockster-cookie-consent') || '{}')
    expect(consentData.accepted).toBe(true)
    expect(consentData.timestamp).toBeDefined()
    expect(consentData.version).toBe('1.0')
  })

  it('debe guardar consentimiento rechazado en localStorage', async () => {
    const user = userEvent.setup({ delay: null })
    vi.advanceTimersByTime(1000)
    
    render(<CookieConsent />)
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeDefined()
    })
    
    const rejectButton = screen.getByLabelText(/rechazar cookies/i)
    await user.click(rejectButton)
    
    const consentData = JSON.parse(localStorage.getItem('vlockster-cookie-consent') || '{}')
    expect(consentData.accepted).toBe(false)
    expect(consentData.timestamp).toBeDefined()
    expect(consentData.version).toBe('1.0')
  })

  it('debe ocultar banner después de aceptar', async () => {
    const user = userEvent.setup({ delay: null })
    vi.advanceTimersByTime(1000)
    
    const { container } = render(<CookieConsent />)
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeDefined()
    })
    
    const acceptButton = screen.getByLabelText(/aceptar cookies/i)
    await user.click(acceptButton)
    
    await waitFor(() => {
      expect(container.firstChild).toBeNull()
    })
  })

  it('debe ocultar banner después de rechazar', async () => {
    const user = userEvent.setup({ delay: null })
    vi.advanceTimersByTime(1000)
    
    const { container } = render(<CookieConsent />)
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeDefined()
    })
    
    const rejectButton = screen.getByLabelText(/rechazar cookies/i)
    await user.click(rejectButton)
    
    await waitFor(() => {
      expect(container.firstChild).toBeNull()
    })
  })

  it('debe mostrar enlaces a política de privacidad y términos', async () => {
    render(<CookieConsent />)
    
    vi.advanceTimersByTime(1000)
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeDefined()
    }, { timeout: 2000 })
    
    const privacyLink = screen.getByLabelText(/política de privacidad/i)
    expect(privacyLink).toHaveAttribute('href', '/legal/privacy')
    
    const termsLink = screen.getByLabelText(/términos de uso/i)
    expect(termsLink).toHaveAttribute('href', '/legal/terms')
  })

  it('debe tener título y descripción accesibles', async () => {
    render(<CookieConsent />)
    
    vi.advanceTimersByTime(1000)
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeDefined()
    }, { timeout: 2000 })
    
    expect(screen.getByText(/uso de cookies/i)).toBeDefined()
    expect(screen.getByText(/utilizamos cookies para mejorar/i)).toBeDefined()
  })
})

describe('useCookieConsent hook', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('debe retornar null cuando no hay consentimiento', () => {
    // Este test requiere un componente de prueba
    const TestComponent = () => {
      const consent = useCookieConsent()
      return <div data-testid="consent">{consent ? 'has-consent' : 'no-consent'}</div>
    }

    render(<TestComponent />)
    
    expect(screen.getByTestId('consent')).toHaveTextContent('no-consent')
  })

  it('debe retornar consentimiento cuando existe en localStorage', () => {
    const consentData = {
      accepted: true,
      timestamp: new Date().toISOString(),
      version: '1.0',
    }
    localStorage.setItem('vlockster-cookie-consent', JSON.stringify(consentData))

    const TestComponent = () => {
      const consent = useCookieConsent()
      return <div data-testid="consent">{consent ? JSON.stringify(consent) : 'no-consent'}</div>
    }

    render(<TestComponent />)
    
    const consentText = screen.getByTestId('consent').textContent
    expect(consentText).toContain('accepted')
    expect(consentText).toContain('true')
  })
})
