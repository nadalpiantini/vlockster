import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { videoUploadSchema } from '@/lib/validations/schemas'
import { handleValidationError, handleError, sanitizeContent } from '@/lib/utils/api-helpers'
import { checkRateLimit, contentRateLimit } from '@/lib/utils/rate-limit'

const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024 // 5GB
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime']

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

    // Verificar que el usuario es creator o admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['creator', 'admin'].includes((profile as any).role)) {
      return NextResponse.json(
        { error: 'Solo los creators pueden subir videos' },
        { status: 403 }
      )
    }

    // Rate limiting
    const rateLimitResult = await checkRateLimit(user.id, contentRateLimit)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Demasiadas solicitudes. Por favor intenta más tarde.',
          retryAfter: rateLimitResult.reset,
        },
        { status: 429 }
      )
    }

    // Obtener el archivo del FormData
    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const visibility = (formData.get('visibility') as string) || 'public'

    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      )
    }

    // Validar tamaño de archivo
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `El archivo es demasiado grande. Máximo: ${MAX_FILE_SIZE / (1024 * 1024 * 1024)}GB` },
        { status: 400 }
      )
    }

    // Validar tipo de archivo
    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de archivo no permitido. Use MP4, WebM o QuickTime' },
        { status: 400 }
      )
    }

    // Validar metadata con Zod
    const validationResult = videoUploadSchema.safeParse({
      title,
      description,
      visibility,
    })
    if (!validationResult.success) {
      return handleValidationError(validationResult.error)
    }

    const { title: validatedTitle, description: validatedDescription, visibility: validatedVisibility } = validationResult.data

    // Sanitizar contenido
    const sanitizedTitle = sanitizeContent(validatedTitle, false)
    const sanitizedDescription = sanitizeContent(validatedDescription, false)

    // Subir a Cloudflare Stream usando TUS protocol
    const cloudflareAccountId = process.env.CLOUDFLARE_ACCOUNT_ID
    const cloudflareApiToken = process.env.CLOUDFLARE_API_TOKEN

    if (!cloudflareAccountId || !cloudflareApiToken) {
      return NextResponse.json(
        { error: 'Cloudflare no está configurado' },
        { status: 500 }
      )
    }

    // Convertir archivo a ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload directo a Cloudflare Stream
    const uploadResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId}/stream`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${cloudflareApiToken}`,
          'Content-Type': 'video/mp4',
        },
        body: buffer,
      }
    )

    if (!uploadResponse.ok) {
      const error = await uploadResponse.text()
      console.error('Cloudflare upload error:', error)
      return NextResponse.json(
        { error: 'Error al subir video a Cloudflare' },
        { status: 500 }
      )
    }

    const uploadResult = await uploadResponse.json()
    const streamId = uploadResult.result.uid

    // Guardar metadata en Supabase
    const { data: video, error: dbError } = await (supabase
      .from('videos') as any)
      .insert({
        title: sanitizedTitle,
        description: sanitizedDescription,
        stream_id: streamId,
        uploader_id: user.id,
        visibility: validatedVisibility,
        thumbnail_url: `https://customer-${cloudflareAccountId}.cloudflarestream.com/${streamId}/thumbnails/thumbnail.jpg`,
      })
      .select()
      .single()

    if (dbError) {
      return handleError(dbError, 'Video upload - database')
    }

    return NextResponse.json({
      success: true,
      video,
      streamId,
    })
  } catch (error) {
    return handleError(error, 'Video upload')
  }
}
