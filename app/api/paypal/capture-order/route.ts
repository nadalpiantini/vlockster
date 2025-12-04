import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

    const body = await request.json()
    const { orderId } = body

    if (!orderId) {
      return NextResponse.json(
        { error: 'ID de orden requerido' },
        { status: 400 }
      )
    }

    // Configurar PayPal
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
      console.error('PayPal auth error')
      return NextResponse.json(
        { error: 'Error al autenticar con PayPal' },
        { status: 500 }
      )
    }

    const authData = await authResponse.json()
    const accessToken = authData.access_token

    // Capturar orden
    const captureResponse = await fetch(
      `${paypalUrl}/v2/checkout/orders/${orderId}/capture`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!captureResponse.ok) {
      const errorText = await captureResponse.text()
      console.error('PayPal capture error:', errorText)
      return NextResponse.json(
        { error: 'Error al capturar pago' },
        { status: 500 }
      )
    }

    const captureData = await captureResponse.json()

    // Extraer datos del custom_id
    const customId = JSON.parse(
      captureData.purchase_units[0].payments.captures[0].custom_id || '{}'
    )
    const { project_id, reward_id } = customId

    if (!project_id) {
      return NextResponse.json(
        { error: 'Datos de proyecto faltantes' },
        { status: 400 }
      )
    }

    const amount = parseFloat(
      captureData.purchase_units[0].payments.captures[0].amount.value
    )

    // Registrar backing en la base de datos
    const { data: backing, error: backingError } = await supabase
      .from('backings')
      .insert({
        user_id: user.id,
        project_id,
        reward_id: reward_id || null,
        amount,
        payment_id: captureData.id,
        payment_status: 'completed',
      })
      .select()
      .single()

    if (backingError) {
      console.error('Database error:', backingError)
      return NextResponse.json(
        { error: 'Error al registrar backing' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      backing,
      capture: captureData,
    })
  } catch (error) {
    console.error('Capture order error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
