import { describe, it, expect } from 'vitest'
import {
  videoUploadSchema,
  projectCreateSchema,
  commentCreateSchema,
  postCreateSchema,
  signupSchema,
  loginSchema,
  rewardSchema,
  projectBackingSchema,
} from '@/lib/validations/schemas'

describe('videoUploadSchema', () => {
  it('debe validar un video válido', () => {
    const valid = {
      title: 'Test Video',
      description: 'Test description',
      visibility: 'public',
    }
    expect(() => videoUploadSchema.parse(valid)).not.toThrow()
  })

  it('debe rechazar título muy corto', () => {
    const invalid = {
      title: 'A',
      description: 'Test description',
      visibility: 'public',
    }
    expect(() => videoUploadSchema.parse(invalid)).toThrow()
  })

  it('debe rechazar visibility inválida', () => {
    const invalid = {
      title: 'Test Video',
      description: 'Test description',
      visibility: 'invalid',
    }
    expect(() => videoUploadSchema.parse(invalid)).toThrow()
  })
})

describe('projectCreateSchema', () => {
  it('debe validar un proyecto válido', () => {
    const valid = {
      title: 'Test Project',
      description: 'Test description',
      goal_amount: 1000,
      deadline: new Date(Date.now() + 86400000).toISOString(),
    }
    expect(() => projectCreateSchema.parse(valid)).not.toThrow()
  })

  it('debe rechazar goal_amount negativo', () => {
    const invalid = {
      title: 'Test Project',
      description: 'Test description',
      goal_amount: -100,
      deadline: new Date(Date.now() + 86400000).toISOString(),
    }
    expect(() => projectCreateSchema.parse(invalid)).toThrow()
  })

  it('debe rechazar deadline en el pasado', () => {
    const invalid = {
      title: 'Test Project',
      description: 'Test description',
      goal_amount: 1000,
      deadline: new Date(Date.now() - 86400000).toISOString(),
    }
    expect(() => projectCreateSchema.parse(invalid)).toThrow()
  })
})

describe('commentCreateSchema', () => {
  it('debe validar un comentario válido', () => {
    const valid = {
      content: 'This is a valid comment with enough characters',
      post_id: '123e4567-e89b-12d3-a456-426614174000',
    }
    expect(() => commentCreateSchema.parse(valid)).not.toThrow()
  })

  it('debe rechazar contenido vacío', () => {
    const invalid = {
      content: '',
      post_id: '123e4567-e89b-12d3-a456-426614174000',
    }
    expect(() => commentCreateSchema.parse(invalid)).toThrow()
  })
})

describe('postCreateSchema', () => {
  it('debe validar un post válido', () => {
    const valid = {
      title: 'Test Post',
      content: 'This is a valid post content with enough characters',
      community_id: '123e4567-e89b-12d3-a456-426614174000',
    }
    expect(() => postCreateSchema.parse(valid)).not.toThrow()
  })

  it('debe rechazar título muy corto', () => {
    const invalid = {
      title: 'A',
      content: 'Valid content with enough characters',
      community_id: '123e4567-e89b-12d3-a456-426614174000',
    }
    expect(() => postCreateSchema.parse(invalid)).toThrow()
  })
})

describe('signupSchema', () => {
  it('debe validar un signup válido', () => {
    const valid = {
      email: 'test@example.com',
      password: 'Password123',
      name: 'Test User',
      confirmPassword: 'Password123',
    }
    expect(() => signupSchema.parse(valid)).not.toThrow()
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

  it('debe rechazar contraseña muy corta', () => {
    const invalid = {
      email: 'test@example.com',
      password: 'Short1',
      name: 'Test User',
      confirmPassword: 'Short1',
    }
    expect(() => signupSchema.parse(invalid)).toThrow()
  })
})

describe('loginSchema', () => {
  it('debe validar un login válido', () => {
    const valid = {
      email: 'test@example.com',
      password: 'password',
    }
    expect(() => loginSchema.parse(valid)).not.toThrow()
  })

  it('debe rechazar email inválido', () => {
    const invalid = {
      email: 'invalid-email',
      password: 'password',
    }
    expect(() => loginSchema.parse(invalid)).toThrow()
  })
})

describe('rewardSchema', () => {
  it('debe validar una recompensa válida', () => {
    const valid = {
      title: 'Test Reward',
      description: 'This is a valid reward description',
      amount: 25,
    }
    expect(() => rewardSchema.parse(valid)).not.toThrow()
  })

  it('debe rechazar amount negativo', () => {
    const invalid = {
      title: 'Test Reward',
      description: 'Valid description',
      amount: -10,
    }
    expect(() => rewardSchema.parse(invalid)).toThrow()
  })
})

describe('projectBackingSchema', () => {
  it('debe validar un backing válido', () => {
    const valid = {
      project_id: '123e4567-e89b-12d3-a456-426614174000',
      amount: 50,
    }
    expect(() => projectBackingSchema.parse(valid)).not.toThrow()
  })

  it('debe rechazar project_id inválido', () => {
    const invalid = {
      project_id: 'invalid-uuid',
      amount: 50,
    }
    expect(() => projectBackingSchema.parse(invalid)).toThrow()
  })
})

