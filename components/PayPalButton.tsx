'use client'

import { useState } from 'react'
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import { Button } from '@/components/ui/button'

interface PayPalButtonProps {
  projectId: string
  rewardId?: string
  amount: number
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function PayPalButton({
  projectId,
  rewardId,
  amount,
  onSuccess,
  onError,
}: PayPalButtonProps) {
  const [loading, setLoading] = useState(false)

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID

  if (!clientId) {
    return (
      <div className="bg-red-900/20 border border-red-500/50 p-4 rounded-md text-center">
        <p className="text-red-300 text-sm">
          PayPal no está configurado. Por favor, configura las variables de
          entorno.
        </p>
      </div>
    )
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId,
        currency: 'USD',
        intent: 'capture',
      }}
    >
      <div className="paypal-button-container">
        <PayPalButtons
          disabled={loading}
          style={{
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            label: 'pay',
          }}
          createOrder={async () => {
            setLoading(true)
            try {
              const response = await fetch('/api/paypal/create-order', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  project_id: projectId,
                  reward_id: rewardId || null,
                  amount: amount.toFixed(2),
                }),
              })

              if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Error al crear orden')
              }

              const data = await response.json()
              return data.orderId
            } catch (error) {
              console.error('Create order error:', error)
              if (onError) {
                onError(
                  error instanceof Error ? error.message : 'Error desconocido'
                )
              }
              throw error
            } finally {
              setLoading(false)
            }
          }}
          onApprove={async (data) => {
            setLoading(true)
            try {
              const response = await fetch('/api/paypal/capture-order', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  orderId: data.orderID,
                }),
              })

              if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Error al capturar pago')
              }

              const captureData = await response.json()

              if (onSuccess) {
                onSuccess()
              }

              return captureData
            } catch (error) {
              console.error('Capture error:', error)
              if (onError) {
                onError(
                  error instanceof Error ? error.message : 'Error desconocido'
                )
              }
              throw error
            } finally {
              setLoading(false)
            }
          }}
          onError={(err) => {
            console.error('PayPal error:', err)
            if (onError) {
              onError('Error en el proceso de pago con PayPal')
            }
          }}
          onCancel={() => {
            setLoading(false)
            if (onError) {
              onError('Pago cancelado')
            }
          }}
        />
      </div>
    </PayPalScriptProvider>
  )
}

// Componente simplificado para mostrar cuando no hay usuario autenticado
export function PayPalButtonPlaceholder() {
  return (
    <Button disabled className="w-full">
      Inicia sesión para apoyar este proyecto
    </Button>
  )
}
