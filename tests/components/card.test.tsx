import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'

describe('Card Components', () => {
  it('Card debe renderizar correctamente', () => {
    render(<Card>Content</Card>)
    expect(screen.getByText('Content')).toBeDefined()
  })

  it('CardHeader debe renderizar correctamente', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
      </Card>
    )
    expect(screen.getByText('Title')).toBeDefined()
    expect(screen.getByText('Description')).toBeDefined()
  })

  it('CardContent debe renderizar correctamente', () => {
    render(
      <Card>
        <CardContent>Content text</CardContent>
      </Card>
    )
    expect(screen.getByText('Content text')).toBeDefined()
  })

  it('CardFooter debe renderizar correctamente', () => {
    render(
      <Card>
        <CardFooter>Footer content</CardFooter>
      </Card>
    )
    expect(screen.getByText('Footer content')).toBeDefined()
  })
})

