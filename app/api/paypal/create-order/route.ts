import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { paypalCreateOrderSchema } from '@/lib/validations/schemas'
import { handleValidationError, handleError } from '@/lib/utils/api-helpers'
import { checkRateLimit, criticalRateLimit } from '@/lib/utils/rate-limit'
import { logger } from '@/lib/utils/logger'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verificar autenticación
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Rate limiting para operaciones críticas
    const rateLimitResult = await checkRateLimit(user.id, criticalRateLimit)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Demasiadas solicitudes. Por favor intenta más tarde.',
          retryAfter: rateLimitResult.reset,
        },
        { status: 429 }
      )
    }

    const body = await request.json()

    // Validar con Zod
    const validationResult = paypalCreateOrderSchema.safeParse(body)
    if (!validationResult.success) {
      return handleValidationError(validationResult.error)
    }

    const { project_id, reward_id, amount } = validationResult.data

    // Verificar que el proyecto existe y está activo
    const { data: project, error: projectError } = await (supabase
      .from('projects') as any)
      .select('*, creator:profiles!creator_id(id)')
      .eq('id', project_id)
      .single()

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Proyecto no encontrado' },
        { status: 404 }
      )
    }

    if ((project as any).status !== 'active') {
      return NextResponse.json(
        { error: 'Este proyecto no está aceptando contribuciones' },
        { status: 400 }
      )
    }

    // Prevenir self-backing
    const creatorProfile = (project as any).creator
    if (creatorProfile?.id === user.id) {
      return NextResponse.json(
        { error: 'No puedes respaldar tu propio proyecto' },
        { status: 400 }
      )
    }

    // Verificar recompensa si se especificó
    if (reward_id) {
      const { data: reward, error: rewardError } = await (supabase
        .from('rewards') as any)
        .select('*')
        .eq('id', reward_id)
        .eq('project_id', project_id)
        .single()

      if (rewardError || !reward) {
        return NextResponse.json(
          { error: 'Recompensa no encontrada' },
          { status: 404 }
        )
      }

      // Verificar disponibilidad
      if ((reward as any).limit && (reward as any).backers_count >= (reward as any).limit) {
        return NextResponse.json(
          { error: 'Esta recompensa ya no está disponible' },
          { status: 400 }
        )
      }

      // Verificar que el monto coincida
      if (Number(amount) < Number((reward as any).amount)) {
        return NextResponse.json(
          { error: 'El monto no coincide con la recompensa seleccionada' },
          { status: 400 }
        )
      }
    }

    // Crear orden en PayPal
    const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
    const paypalSecret = process.env.PAYPAL_CLIENT_SECRET
    const paypalMode = process.env.PAYPAL_MODE || 'sandbox'

    if (!paypalClientId || !paypalSecret) {
      return NextResponse.json(
        { error: 'PayPal no está configurado' },
        { status: 500 }
      )
    }

    const paypalUrl =
      paypalMode === 'live'
        ? 'https://api-m.paypal.com'
        : 'https://api-m.sandbox.paypal.com'

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
      const errorText = await authResponse.text()
      logger.error('PayPal auth error', new Error(errorText), {
        userId: user.id,
        endpoint: '/api/paypal/create-order',
      })
      return NextResponse.json(
        { error: 'Error al autenticar con PayPal' },
        { status: 500 }
      )
    }

    const authData = await authResponse.json()
    const accessToken = authData.access_token

    // Crear orden
    const orderResponse = await fetch(`${paypalUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: Number(amount).toFixed(2),
            },
            description: `Backing for: ${(project as any).title}`,
            custom_id: JSON.stringify({
              user_id: user.id,
              project_id,
              reward_id: reward_id || null,
            }),
          },
        ],
        application_context: {
          return_url: `${process.env.NEXT_PUBLIC_APP_URL}/projects/${project_id}?payment=success`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/projects/${project_id}?payment=cancelled`,
        },
      }),
    })

    if (!orderResponse.ok) {
      const errorText = await orderResponse.text()
      logger.error('PayPal order error', new Error(errorText), {
        userId: user.id,
        projectId: project_id,
        endpoint: '/api/paypal/create-order',
      })
      return NextResponse.json(
        { error: 'Error al crear orden de PayPal' },
        { status: 500 }
      )
    }

    const orderData = await orderResponse.json()

    return NextResponse.json({
      orderId: orderData.id,
    })
  } catch (error) {
    return handleError(error, 'Create PayPal order', {
      endpoint: '/api/paypal/create-order',
    })
  }
}
