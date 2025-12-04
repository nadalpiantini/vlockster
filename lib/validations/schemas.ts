import { z } from 'zod'

// ============================================
// AUTH SCHEMAS
// ============================================

export const signupSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

// ============================================
// PROJECT SCHEMAS
// ============================================

export const rewardSchema = z.object({
  title: z.string().min(3, 'Título debe tener al menos 3 caracteres').max(100),
  description: z.string().min(10, 'Descripción debe tener al menos 10 caracteres').max(500),
  amount: z.number().positive('El monto debe ser positivo').max(100000),
  delivery_date: z.string().datetime('Fecha inválida').optional(),
})

export const projectCreateSchema = z.object({
  title: z.string().min(3, 'Título debe tener al menos 3 caracteres').max(200),
  description: z.string().min(10, 'Descripción debe tener al menos 10 caracteres').max(5000),
  goal_amount: z.number().positive('El monto objetivo debe ser positivo').max(1000000),
  deadline: z.string().datetime('Fecha límite inválida'),
  video_id: z.string().uuid('ID de video inválido').optional().nullable(),
  rewards: z.array(rewardSchema).optional(),
}).refine((data) => {
  const deadline = new Date(data.deadline)
  return deadline > new Date()
}, {
  message: 'La fecha límite debe ser futura',
  path: ['deadline'],
})

export const projectBackingSchema = z.object({
  project_id: z.string().uuid('ID de proyecto inválido'),
  reward_id: z.string().uuid('ID de recompensa inválido').optional().nullable(),
  amount: z.number().positive('El monto debe ser positivo').max(100000),
})

// ============================================
// POST SCHEMAS
// ============================================

export const postCreateSchema = z.object({
  community_id: z.string().uuid('ID de comunidad inválido'),
  title: z.string().min(3, 'Título debe tener al menos 3 caracteres').max(200),
  content: z.string().min(10, 'El contenido debe tener al menos 10 caracteres').max(10000),
})

// ============================================
// COMMENT SCHEMAS
// ============================================

export const commentCreateSchema = z.object({
  post_id: z.string().uuid('ID de post inválido'),
  content: z.string().min(1, 'El contenido es requerido').max(2000),
  parent_id: z.string().uuid('ID de comentario padre inválido').optional().nullable(),
  parent_comment_id: z.string().uuid('ID de comentario padre inválido').optional().nullable(),
})

// ============================================
// VIDEO SCHEMAS
// ============================================

export const videoUploadSchema = z.object({
  title: z.string().min(3, 'Título debe tener al menos 3 caracteres').max(200),
  description: z.string().min(10, 'Descripción debe tener al menos 10 caracteres').max(2000),
  visibility: z.enum(['public', 'members', 'backers']).default('public'),
})

// ============================================
// PAYPAL SCHEMAS
// ============================================

export const paypalCreateOrderSchema = z.object({
  project_id: z.string().uuid('ID de proyecto inválido'),
  reward_id: z.string().uuid('ID de recompensa inválido').optional().nullable(),
  amount: z.number().positive('El monto debe ser positivo').max(100000),
})

export const paypalCaptureOrderSchema = z.object({
  orderId: z.string().min(1, 'ID de orden requerido'),
})

// ============================================
// ADMIN SCHEMAS
// ============================================

export const adminApproveRequestSchema = z.object({
  requestId: z.string().uuid('ID de solicitud inválido'),
})

export const adminRejectRequestSchema = z.object({
  requestId: z.string().uuid('ID de solicitud inválido'),
})

// ============================================
// HELPER TYPES
// ============================================

export type SignupInput = z.infer<typeof signupSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ProjectCreateInput = z.infer<typeof projectCreateSchema>
export type ProjectBackingInput = z.infer<typeof projectBackingSchema>
export type PostCreateInput = z.infer<typeof postCreateSchema>
export type CommentCreateInput = z.infer<typeof commentCreateSchema>
export type VideoUploadInput = z.infer<typeof videoUploadSchema>
export type PaypalCreateOrderInput = z.infer<typeof paypalCreateOrderSchema>
export type PaypalCaptureOrderInput = z.infer<typeof paypalCaptureOrderSchema>
export type AdminApproveRequestInput = z.infer<typeof adminApproveRequestSchema>
export type AdminRejectRequestInput = z.infer<typeof adminRejectRequestSchema>

