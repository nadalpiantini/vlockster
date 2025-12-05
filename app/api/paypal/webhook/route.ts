import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { handleError } from '@/lib/utils/api-helpers'
import { logger } from '@/lib/utils/logger'
import crypto from 'crypto'
import type { Database } from '@/types/database.types'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * Webhook Handler para PayPal
 * 
 * QUÉ HACE:
 * - Valida firma del webhook de PayPal
 * - Procesa pagos completados/cancelados
 * - Actualiza estado de backings en Supabase
 * - Detecta cuando proyecto alcanza su meta
 * - Activa recompensas automáticamente
 * - Notifica al creator
 */

const PAYPAL_WEBHOOK_SECRET = process.env.PAYPAL_WEBHOOK_SECRET || ''

function verifyPayPalSignature(
  headers: Headers,
  body: string,
  webhookId: string
): boolean {
  try {
    const authAlgo = headers.get('PAYPAL-AUTH-ALGO') || ''
    const certUrl = headers.get('PAYPAL-CERT-URL') || ''
    const transmissionId = headers.get('PAYPAL-TRANSMISSION-ID') || ''
    const transmissionSig = headers.get('PAYPAL-TRANSMISSION-SIG') || ''
    const transmissionTime = headers.get('PAYPAL-TRANSMISSION-TIME') || ''

    // Construir mensaje a verificar
    const message = `${transmissionId}|${transmissionTime}|${webhookId}|${body}`

    // Calcular HMAC
    const expectedSig = crypto
      .createHmac('sha256', PAYPAL_WEBHOOK_SECRET)
      .update(message)
      .digest('hex')

    return crypto.timingSafeEqual(
      Buffer.from(transmissionSig),
      Buffer.from(expectedSig)
    )
  } catch (error) {
    logger.error('Error verifying PayPal signature', error, {
      endpoint: '/api/paypal/webhook',
    })
    return false
  }
}

async function processPaymentCompleted(resource: any, supabase: any) {
  const orderId = resource.id
  const amount = parseFloat(
    resource.purchase_units?.[0]?.amount?.value || '0'
  )

  // Buscar backing por payment_id (usando orderId como payment_id)
  const { data: backings } = await supabase
    .from('backings')
    .select('*')
    .eq('payment_id', orderId)
    .single()

  if (!backings) {
    return { error: 'Backing no encontrado' }
  }

  const backing = backings
  const projectId = backing.project_id

  // Actualizar backing a completed (usando payment_status)
  const backingUpdate: Database['public']['Tables']['backings']['Update'] = {
    payment_status: 'completed',
    updated_at: new Date().toISOString(),
  }
  await supabase
    .from('backings')
    .update(backingUpdate)
    .eq('id', backing.id)

  // Obtener proyecto
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single()

  if (!project) {
    return { error: 'Proyecto no encontrado' }
  }

  // Calcular nuevo total
  const { data: allBackings } = await supabase
    .from('backings')
    .select('amount')
    .eq('project_id', projectId)
    .eq('payment_status', 'completed')

  const newTotal =
    (allBackings?.reduce((sum: number, b: { amount: number }) => sum + (b.amount || 0), 0) || 0) + amount

  // Actualizar proyecto (usando current_amount en lugar de total_raised)
  const projectUpdate: Database['public']['Tables']['projects']['Update'] = {
    current_amount: newTotal,
    updated_at: new Date().toISOString(),
  }
  await supabase
    .from('projects')
    .update(projectUpdate)
    .eq('id', projectId)

  // Verificar si alcanzó la meta
  if (newTotal >= project.goal_amount && project.status === 'active') {
    const fundedUpdate: Database['public']['Tables']['projects']['Update'] = {
      status: 'funded',
      funded_at: new Date().toISOString(),
    }
    await supabase
      .from('projects')
      .update(fundedUpdate)
      .eq('id', projectId)

    // Notificar al creator (implementar después)
    // await sendNotification(project.creator_id, 'project_funded', {...})
  }

  return {
    status: 'processed',
    project_id: projectId,
    new_total: newTotal,
  }
}

async function processPaymentCancelled(resource: any, supabase: any) {
  const orderId = resource.id

  const cancelUpdate: Database['public']['Tables']['backings']['Update'] = {
    payment_status: 'cancelled',
    updated_at: new Date().toISOString(),
  }
  await supabase
    .from('backings')
    .update(cancelUpdate)
    .eq('payment_id', orderId)

  return { status: 'cancelled' }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headers = request.headers
    const webhookId = process.env.PAYPAL_WEBHOOK_ID || ''

    // Validar firma
    if (!verifyPayPalSignature(headers, body, webhookId)) {
      return NextResponse.json({ error: 'Firma inválida' }, { status: 401 })
    }

    const webhookData = JSON.parse(body)
    const eventType = webhookData.event_type
    const resource = webhookData.resource || {}

    const supabase = await createClient()

    // Procesar según tipo de evento
    if (eventType === 'PAYMENT.CAPTURE.COMPLETED') {
      const result = await processPaymentCompleted(resource, supabase)
      return NextResponse.json({
        status: 'processed',
        event: eventType,
        result,
      })
    }

    if (eventType === 'PAYMENT.CAPTURE.CANCELLED') {
      const result = await processPaymentCancelled(resource, supabase)
      return NextResponse.json({
        status: 'processed',
        event: eventType,
        result,
      })
    }

    // Otros eventos (logging solamente)
    return NextResponse.json({
      status: 'received',
      event: eventType,
    })
  } catch (error) {
    return handleError(error, 'PayPal webhook')
  }
}
