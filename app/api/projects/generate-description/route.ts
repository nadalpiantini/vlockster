import { NextRequest, NextResponse } from 'next/server'
import { generateProjectDescription, generateDescriptionVariants } from '@/lib/ai/description-generator'
import { handleValidationError, handleError } from '@/lib/utils/api-helpers'
import { z } from 'zod'
import { logger } from '@/lib/utils/logger'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const generateDescriptionSchema = z.object({
  title: z.string().min(1),
  genre: z.string().min(1),
  goal_amount: z.number().positive(),
  deadline: z.string(),
  rewards: z
    .array(
      z.object({
        amount: z.number(),
        title: z.string(),
        description: z.string().optional(),
      })
    )
    .optional(),
  additional_info: z.string().optional(),
  generate_variants: z.boolean().optional().default(false),
})

export async function POST(request: NextRequest) {
  try {
    logger.info('Inicio de generación de descripción de proyecto', {
      endpoint: '/api/projects/generate-description',
    })

    const body = await request.json()

    // Validar con Zod
    const validationResult = generateDescriptionSchema.safeParse(body)
    if (!validationResult.success) {
      logger.warn('Validación fallida para generación de descripción', {
        endpoint: '/api/projects/generate-description',
        errors: validationResult.error.flatten(),
      })
      return handleValidationError(validationResult.error)
    }

    const { generate_variants, ...params } = validationResult.data

    // Generar descripción principal
    logger.info('Generando descripción principal del proyecto', {
      projectId: 'pending',
      title: params.title,
      genre: params.genre,
      goalAmount: params.goal_amount,
      endpoint: '/api/projects/generate-description',
    })

    const result = await generateProjectDescription(params)

    // Si se solicitan variantes, generarlas también
    if (generate_variants) {
      logger.info('Generando variantes de descripción', {
        title: params.title,
        genre: params.genre,
        goalAmount: params.goal_amount,
        endpoint: '/api/projects/generate-description',
      })

      const variants = await generateDescriptionVariants(
        params.title,
        params.genre,
        params.goal_amount
      )
      result.variants = variants

      logger.info('Variantes de descripción generadas exitosamente', {
        variantCount: variants.length,
        endpoint: '/api/projects/generate-description',
      })
    }

    logger.info('Descripción de proyecto generada exitosamente', {
      projectId: 'pending',
      title: params.title,
      endpoint: '/api/projects/generate-description',
    })

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error) {
    const errorId = logger.error('Error inesperado al generar descripción de proyecto', error, {
      endpoint: '/api/projects/generate-description',
    })
    return handleError(error, 'Generate description', errorId)
  }
}

