'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const COOKIE_CONSENT_KEY = 'vlockster-cookie-consent'
const CONSENT_EXPIRY_DAYS = 365

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

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
      className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50 p-4 shadow-lg"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
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
            <p className="text-xs text-gray-400">
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
            >
              Rechazar
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleAccept}
              aria-label="Aceptar cookies"
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

