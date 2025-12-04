import { describe, it, expect } from 'vitest'
import {
  signupSchema,
  loginSchema,
  projectCreateSchema,
  projectBackingSchema,
  postCreateSchema,
  commentCreateSchema,
  videoUploadSchema,
  paypalCreateOrderSchema,
  paypalCaptureOrderSchema,
  adminApproveRequestSchema,
  adminRejectRequestSchema,
  rewardSchema,
} from './schemas'

describe('Validation Schemas', () => {
  describe('signupSchema', () => {
    it('debe validar datos correctos', () => {
      const valid = {
        email: 'test@example.com',
        password: 'Password123',
        name: 'Test User',
        confirmPassword: 'Password123',
      }
      expect(() => signupSchema.parse(valid)).not.toThrow()
    })

    it('debe rechazar email inválido', () => {
      const invalid = {
        email: 'not-an-email',
        password: 'Password123',
        name: 'Test User',
        confirmPassword: 'Password123',
      }
      expect(() => signupSchema.parse(invalid)).toThrow()
    })

    it('debe rechazar contraseña muy corta', () => {
      const invalid = {
        email: 'test@example.com',
        password: 'Short1',
        name: 'Test User',
        confirmPassword: 'Short1',
      }
      expect(() => signupSchema.parse(invalid)).toThrow()
    })

    it('debe rechazar contraseñas que no coinciden', () => {
      const invalid = {
        email: 'test@example.com',
        password: 'Password123',
        name: 'Test User',
        confirmPassword: 'Different123',
      }
      expect(() => signupSchema.parse(invalid)).toThrow()
    })
  })

  describe('loginSchema', () => {
    it('debe validar datos correctos', () => {
      const valid = {
        email: 'test@example.com',
        password: 'anypassword',
      }
      expect(() => loginSchema.parse(valid)).not.toThrow()
    })

    it('debe rechazar email inválido', () => {
      const invalid = {
        email: 'not-an-email',
        password: 'password',
      }
      expect(() => loginSchema.parse(invalid)).toThrow()
    })
  })

  describe('projectCreateSchema', () => {
    it('debe validar datos correctos', () => {
      const valid = {
        title: 'Test Project',
        description: 'This is a test project description',
        goal_amount: 1000,
        deadline: new Date(Date.now() + 86400000).toISOString(),
      }
      expect(() => projectCreateSchema.parse(valid)).not.toThrow()
    })

    it('debe rechazar título muy corto', () => {
      const invalid = {
        title: 'ab',
        description: 'Valid description',
        goal_amount: 1000,
        deadline: new Date(Date.now() + 86400000).toISOString(),
      }
      expect(() => projectCreateSchema.parse(invalid)).toThrow()
    })

    it('debe rechazar monto negativo', () => {
      const invalid = {
        title: 'Test Project',
        description: 'Valid description',
        goal_amount: -100,
        deadline: new Date(Date.now() + 86400000).toISOString(),
      }
      expect(() => projectCreateSchema.parse(invalid)).toThrow()
    })

    it('debe rechazar fecha pasada', () => {
      const invalid = {
        title: 'Test Project',
        description: 'Valid description',
        goal_amount: 1000,
        deadline: new Date(Date.now() - 86400000).toISOString(),
      }
      expect(() => projectCreateSchema.parse(invalid)).toThrow()
    })
  })

  describe('projectBackingSchema', () => {
    it('debe validar datos correctos', () => {
      const valid = {
        project_id: '123e4567-e89b-12d3-a456-426614174000',
        amount: 100,
      }
      expect(() => projectBackingSchema.parse(valid)).not.toThrow()
    })

    it('debe rechazar UUID inválido', () => {
      const invalid = {
        project_id: 'not-a-uuid',
        amount: 100,
      }
      expect(() => projectBackingSchema.parse(invalid)).toThrow()
    })

    it('debe rechazar monto negativo', () => {
      const invalid = {
        project_id: '123e4567-e89b-12d3-a456-426614174000',
        amount: -100,
      }
      expect(() => projectBackingSchema.parse(invalid)).toThrow()
    })
  })

  describe('postCreateSchema', () => {
    it('debe validar datos correctos', () => {
      const valid = {
        community_id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Test Post',
        content: 'This is a test post content with enough characters',
      }
      expect(() => postCreateSchema.parse(valid)).not.toThrow()
    })

    it('debe rechazar título muy corto', () => {
      const invalid = {
        community_id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'ab',
        content: 'Valid content',
      }
      expect(() => postCreateSchema.parse(invalid)).toThrow()
    })

    it('debe rechazar contenido muy corto', () => {
      const invalid = {
        community_id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Valid Title',
        content: 'short',
      }
      expect(() => postCreateSchema.parse(invalid)).toThrow()
    })
  })

  describe('commentCreateSchema', () => {
    it('debe validar datos correctos', () => {
      const valid = {
        post_id: '123e4567-e89b-12d3-a456-426614174000',
        content: 'This is a comment',
      }
      expect(() => commentCreateSchema.parse(valid)).not.toThrow()
    })

    it('debe rechazar contenido vacío', () => {
      const invalid = {
        post_id: '123e4567-e89b-12d3-a456-426614174000',
        content: '',
      }
      expect(() => commentCreateSchema.parse(invalid)).toThrow()
    })

    it('debe rechazar contenido muy largo', () => {
      const invalid = {
        post_id: '123e4567-e89b-12d3-a456-426614174000',
        content: 'a'.repeat(2001),
      }
      expect(() => commentCreateSchema.parse(invalid)).toThrow()
    })
  })

  describe('videoUploadSchema', () => {
    it('debe validar datos correctos', () => {
      const valid = {
        title: 'Test Video',
        description: 'This is a test video description',
        visibility: 'public' as const,
      }
      expect(() => videoUploadSchema.parse(valid)).not.toThrow()
    })

    it('debe rechazar visibilidad inválida', () => {
      const invalid = {
        title: 'Test Video',
        description: 'Valid description',
        visibility: 'invalid',
      }
      expect(() => videoUploadSchema.parse(invalid)).toThrow()
    })
  })

  describe('paypalCreateOrderSchema', () => {
    it('debe validar datos correctos', () => {
      const valid = {
        project_id: '123e4567-e89b-12d3-a456-426614174000',
        amount: 100,
      }
      expect(() => paypalCreateOrderSchema.parse(valid)).not.toThrow()
    })

    it('debe rechazar monto negativo', () => {
      const invalid = {
        project_id: '123e4567-e89b-12d3-a456-426614174000',
        amount: -100,
      }
      expect(() => paypalCreateOrderSchema.parse(invalid)).toThrow()
    })
  })

  describe('paypalCaptureOrderSchema', () => {
    it('debe validar datos correctos', () => {
      const valid = {
        orderId: 'ORDER123',
      }
      expect(() => paypalCaptureOrderSchema.parse(valid)).not.toThrow()
    })

    it('debe rechazar orderId vacío', () => {
      const invalid = {
        orderId: '',
      }
      expect(() => paypalCaptureOrderSchema.parse(invalid)).toThrow()
    })
  })

  describe('adminApproveRequestSchema', () => {
    it('debe validar datos correctos', () => {
      const valid = {
        requestId: '123e4567-e89b-12d3-a456-426614174000',
      }
      expect(() => adminApproveRequestSchema.parse(valid)).not.toThrow()
    })

    it('debe rechazar UUID inválido', () => {
      const invalid = {
        requestId: 'not-a-uuid',
      }
      expect(() => adminApproveRequestSchema.parse(invalid)).toThrow()
    })
  })

  describe('adminRejectRequestSchema', () => {
    it('debe validar datos correctos', () => {
      const valid = {
        requestId: '123e4567-e89b-12d3-a456-426614174000',
      }
      expect(() => adminRejectRequestSchema.parse(valid)).not.toThrow()
    })
  })

  describe('rewardSchema', () => {
    it('debe validar datos correctos', () => {
      const valid = {
        title: 'Test Reward',
        description: 'This is a test reward description',
        amount: 50,
      }
      expect(() => rewardSchema.parse(valid)).not.toThrow()
    })

    it('debe aceptar limit opcional', () => {
      const valid = {
        title: 'Test Reward',
        description: 'This is a test reward description',
        amount: 50,
        limit: 10,
      }
      expect(() => rewardSchema.parse(valid)).not.toThrow()
    })

    it('debe rechazar monto negativo', () => {
      const invalid = {
        title: 'Test Reward',
        description: 'Valid description',
        amount: -50,
      }
      expect(() => rewardSchema.parse(invalid)).toThrow()
    })
  })
})

