import { NextRequest, NextResponse } from 'next/server'
import { generateProjectDescription, generateDescriptionVariants } from '@/lib/ai/description-generator'
import { handleError } from '@/lib/utils/api-helpers'
import { z } from 'zod'

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
    const body = await request.json()

    // Validar con Zod
    const validationResult = generateDescriptionSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const { generate_variants, ...params } = validationResult.data

    // Generar descripción principal
    const result = await generateProjectDescription(params)

    // Si se solicitan variantes, generarlas también
    if (generate_variants) {
      const variants = await generateDescriptionVariants(
        params.title,
        params.genre,
        params.goal_amount
      )
      result.variants = variants
    }

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error) {
    return handleError(error, 'Generate description')
  }
}

