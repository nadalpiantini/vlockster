'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const COOKIE_CONSENT_KEY = 'vlockster-cookie-consent'

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const acceptButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    // Verificar si ya hay consentimiento
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!consent) {
      // Esperar un poco antes de mostrar el banner para mejor UX
      const timer = setTimeout(() => {
        setShowBanner(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  // Focus trap and keyboard navigation
  useEffect(() => {
    if (!showBanner || !dialogRef.current) return

    const dialog = dialogRef.current
    const focusableElements = dialog.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    // Focus first element when dialog opens
    if (acceptButtonRef.current) {
      acceptButtonRef.current.focus()
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleReject()
        return
      }

      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    dialog.addEventListener('keydown', handleKeyDown)
    return () => dialog.removeEventListener('keydown', handleKeyDown)
  }, [showBanner])

  const handleAccept = () => {
    const consentData = {
      accepted: true,
      timestamp: new Date().toISOString(),
      version: '1.0',
    }
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentData))
    setShowBanner(false)
  }

  const handleReject = () => {
    const consentData = {
      accepted: false,
      timestamp: new Date().toISOString(),
      version: '1.0',
    }
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentData))
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div
      ref={dialogRef}
      className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50 p-4 shadow-lg"
      role="dialog"
      aria-live="polite"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
      aria-modal="true"
      tabIndex={-1}
    >
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-1">
            <h3
              id="cookie-consent-title"
              className="text-lg font-semibold text-white mb-2"
            >
              Uso de Cookies
            </h3>
            <p
              id="cookie-consent-description"
              className="text-sm text-gray-300 mb-2"
            >
              Utilizamos cookies para mejorar tu experiencia, analizar el uso de
              la plataforma y personalizar contenido. Al continuar navegando,
              aceptas nuestro uso de cookies.
            </p>
            <p className="text-xs text-gray-300">
              Para más información, consulta nuestra{' '}
              <Link
                href="/legal/privacy"
                className="text-blue-400 hover:underline"
                aria-label="Política de privacidad"
              >
                Política de Privacidad
              </Link>
              {' y '}
              <Link
                href="/legal/terms"
                className="text-blue-400 hover:underline"
                aria-label="Términos de uso"
              >
                Términos de Uso
              </Link>
              .
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReject}
              aria-label="Rechazar cookies"
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  handleReject()
                }
              }}
            >
              Rechazar
            </Button>
            <Button
              ref={acceptButtonRef}
              variant="default"
              size="sm"
              onClick={handleAccept}
              aria-label="Aceptar cookies"
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  handleReject()
                }
              }}
            >
              Aceptar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Hook para verificar el estado del consentimiento de cookies
 */
export function useCookieConsent() {
  const [consent, setConsent] = useState<{
    accepted: boolean
    timestamp: string
    version: string
  } | null>(null)

  useEffect(() => {
    const consentData = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (consentData) {
      try {
        setConsent(JSON.parse(consentData))
      } catch {
        setConsent(null)
      }
    }
  }, [])

  return consent
}

