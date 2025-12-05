import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CookieConsent } from '@/components/CookieConsent'

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
    // Clear localStorage before each test
    localStorage.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('debe renderizar el banner cuando no hay consentimiento', () => {
    render(<CookieConsent />)
    expect(screen.getByText(/utilizamos cookies/i)).toBeDefined()
    expect(screen.getByRole('dialog')).toBeDefined()
  })

  it('no debe renderizar el banner cuando ya hay consentimiento', () => {
    localStorage.setItem('cookie-consent', 'accepted')
    const { container } = render(<CookieConsent />)
    expect(container.firstChild).toBeNull()
  })

  it('debe aceptar cookies al hacer clic en "Aceptar"', async () => {
    render(<CookieConsent />)
    const acceptButton = screen.getByLabelText('Aceptar cookies')
    
    fireEvent.click(acceptButton)
    
    await waitFor(() => {
      expect(localStorage.getItem('cookie-consent')).toBe('accepted')
    })
  })

  it('debe rechazar cookies al hacer clic en "Rechazar"', async () => {
    render(<CookieConsent />)
    const rejectButton = screen.getByLabelText('Rechazar cookies')
    
    fireEvent.click(rejectButton)
    
    await waitFor(() => {
      expect(localStorage.getItem('cookie-consent')).toBe('rejected')
    })
  })

  it('debe tener aria-labels accesibles', () => {
    render(<CookieConsent />)
    expect(screen.getByLabelText('Política de privacidad')).toBeDefined()
    expect(screen.getByLabelText('Términos de uso')).toBeDefined()
    expect(screen.getByLabelText('Aceptar cookies')).toBeDefined()
    expect(screen.getByLabelText('Rechazar cookies')).toBeDefined()
  })

  it('debe tener role="dialog" y aria-labelledby/aria-describedby', () => {
    render(<CookieConsent />)
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-labelledby', 'cookie-consent-title')
    expect(dialog).toHaveAttribute('aria-describedby', 'cookie-consent-description')
  })
})

