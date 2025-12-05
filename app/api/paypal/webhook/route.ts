import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { handleError } from '@/lib/utils/api-helpers'
import { logger } from '@/lib/utils/logger'
import crypto from 'crypto'
import type { Database } from '@/types/database.types'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * Verifica la firma del webhook de PayPal
 */
async function verifyWebhookSignature(
  headers: Headers,
  body: string,
  webhookId: string
): Promise<boolean> {
  const paypalMode = process.env.PAYPAL_MODE || 'sandbox'
  const paypalUrl =
    paypalMode === 'live'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com'

  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const paypalSecret = process.env.PAYPAL_CLIENT_SECRET

  if (!paypalClientId || !paypalSecret) {
    logger.warn('PayPal credentials not configured for webhook verification')
    return false
  }

  // Obtener token de acceso
  const authResponse = await fetch(`${paypalUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${paypalClientId}:${paypalSecret}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  })

  if (!authResponse.ok) {
    logger.error('PayPal auth error for webhook verification', new Error('Auth failed'))
    return false
  }

  const authData = await authResponse.json()
  const accessToken = authData.access_token

  // Verificar firma con PayPal API
  const verifyResponse = await fetch(`${paypalUrl}/v1/notifications/verify-webhook-signature`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      transmission_id: headers.get('paypal-transmission-id'),
      transmission_time: headers.get('paypal-transmission-time'),
      cert_url: headers.get('paypal-cert-url'),
      auth_algo: headers.get('paypal-auth-algo'),
      transmission_sig: headers.get('paypal-transmission-sig'),
      webhook_id: webhookId,
      webhook_event: JSON.parse(body),
    }),
  })

  if (!verifyResponse.ok) {
    logger.error('PayPal webhook signature verification failed', new Error('Verification failed'))
    return false
  }

  const verifyData = await verifyResponse.json()
  return verifyData.verification_status === 'SUCCESS'
}

/**
 * Procesa eventos de PayPal webhook
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.text()
    const headers = request.headers

    // Webhook ID de PayPal (debe estar en variables de entorno)
    const webhookId = process.env.PAYPAL_WEBHOOK_ID
    if (!webhookId) {
      logger.warn('PayPal webhook ID not configured')
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
    }

    // Verificar firma del webhook
    const isValid = await verifyWebhookSignature(headers, body, webhookId)
    if (!isValid) {
      logger.warn('Invalid PayPal webhook signature', {
        endpoint: '/api/paypal/webhook',
      })
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = JSON.parse(body)
    const eventType = event.event_type

    logger.info('PayPal webhook received', {
      eventType,
      resourceType: event.resource_type,
      endpoint: '/api/paypal/webhook',
    })

    // Procesar según tipo de evento
    switch (eventType) {
      case 'PAYMENT.CAPTURE.COMPLETED': {
        const capture = event.resource
        const customId = capture.custom_id
          ? JSON.parse(capture.custom_id)
          : null

        if (!customId || !customId.project_id) {
          logger.warn('PayPal webhook missing project_id', {
            eventType,
            endpoint: '/api/paypal/webhook',
          })
          break
        }

        const { project_id, reward_id, user_id } = customId
        const amount = parseFloat(capture.amount.value)

        // Verificar si el backing ya existe
        const { data: existingBacking } = await supabase
          .from('backings')
          .select('id')
          .eq('payment_id', capture.id)
          .single()

        if (existingBacking) {
          logger.info('Backing already exists, skipping', {
            backingId: existingBacking.id,
            paymentId: capture.id,
            endpoint: '/api/paypal/webhook',
          })
          break
        }

        // Crear backing
        type BackingInsert = Database['public']['Tables']['backings']['Insert']
        const { error: backingError } = await supabase
          .from('backings')
          .insert({
            user_id,
            project_id,
            reward_id: reward_id || null,
            amount,
            payment_id: capture.id,
            payment_status: 'completed',
          } as BackingInsert)

        if (backingError) {
          logger.error('Error creating backing from webhook', backingError, {
            projectId: project_id,
            userId: user_id,
            endpoint: '/api/paypal/webhook',
          })
        } else {
          logger.info('Backing created from webhook', {
            projectId: project_id,
            userId: user_id,
            amount,
            endpoint: '/api/paypal/webhook',
          })
        }
        break
      }

      case 'PAYMENT.CAPTURE.DENIED':
      case 'PAYMENT.CAPTURE.REFUNDED': {
        const capture = event.resource
        const customId = capture.custom_id
          ? JSON.parse(capture.custom_id)
          : null

        if (!customId || !customId.project_id) {
          break
        }

        // Actualizar estado del backing
        type BackingUpdate = Database['public']['Tables']['backings']['Update']
        const { error: updateError } = await supabase
          .from('backings')
          .update({
            payment_status:
              eventType === 'PAYMENT.CAPTURE.REFUNDED' ? 'refunded' : 'denied',
          } as BackingUpdate)
          .eq('payment_id', capture.id)

        if (updateError) {
          logger.error('Error updating backing status from webhook', updateError, {
            paymentId: capture.id,
            endpoint: '/api/paypal/webhook',
          })
        }
        break
      }

      default:
        logger.debug('Unhandled PayPal webhook event', {
          eventType,
          endpoint: '/api/paypal/webhook',
        })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    return handleError(error, 'PayPal webhook', {
      endpoint: '/api/paypal/webhook',
    })
  }
}

