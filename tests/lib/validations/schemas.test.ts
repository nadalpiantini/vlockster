import { describe, it, expect } from 'vitest'
import {
  videoUploadSchema,
  projectCreateSchema,
  commentCreateSchema,
  postCreateSchema,
  creatorRequestSchema,
} } from '@/lib/validations/schemas'

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
      video_id: 'test-video-id',
    }
    expect(() => commentCreateSchema.parse(valid)).not.toThrow()
  })

  it('debe rechazar contenido muy corto', () => {
    const invalid = {
      content: 'short',
      video_id: 'test-video-id',
    }
    expect(() => commentCreateSchema.parse(invalid)).toThrow()
  })
})

describe('postCreateSchema', () => {
  it('debe validar un post válido', () => {
    const valid = {
      title: 'Test Post',
      content: 'This is a valid post content with enough characters',
      community_id: 'test-community-id',
    }
    expect(() => postCreateSchema.parse(valid)).not.toThrow()
  })

  it('debe rechazar título muy corto', () => {
    const invalid = {
      title: 'A',
      content: 'Valid content',
      community_id: 'test-community-id',
    }
    expect(() => postCreateSchema.parse(invalid)).toThrow()
  })
})

describe('creatorRequestSchema', () => {
  it('debe validar una solicitud válida', () => {
    const valid = {
      pitch_title: 'Test Pitch',
      pitch_text: 'This is a valid pitch text',
      portfolio_url: 'https://example.com/portfolio',
    }
    expect(() => creatorRequestSchema.parse(valid)).not.toThrow()
  })

  it('debe permitir portfolio_url opcional', () => {
    const valid = {
      pitch_title: 'Test Pitch',
      pitch_text: 'This is a valid pitch text',
    }
    expect(() => creatorRequestSchema.parse(valid)).not.toThrow()
  })

  it('debe rechazar pitch_title muy corto', () => {
    const invalid = {
      pitch_title: 'A',
      pitch_text: 'Valid text',
    }
    expect(() => creatorRequestSchema.parse(invalid)).toThrow()
  })
})

