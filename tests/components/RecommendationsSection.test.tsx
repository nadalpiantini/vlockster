import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RecommendationsSection } from '@/components/RecommendationsSection'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}))

describe('RecommendationsSection', () => {
  const mockRecommendations = {
    projects: [
      {
        id: '1',
        title: 'Test Project',
        description: 'Test description',
        current_amount: 1000,
        goal_amount: 5000,
        status: 'active',
      },
    ],
    videos: [
      {
        id: '1',
        title: 'Test Video',
        description: 'Test video description',
        thumbnail_url: 'https://example.com/thumb.jpg',
      },
    ],
  }

  it('should render projects section when projects are provided', () => {
    render(<RecommendationsSection recommendations={mockRecommendations} />)
    const projectsHeading = screen.getByText(/proyectos recomendados/i)
    expect(projectsHeading).toBeInTheDocument()
  })

  it('should render videos section when videos are provided', () => {
    render(<RecommendationsSection recommendations={mockRecommendations} />)
    const videosHeading = screen.getByText(/videos recomendados/i)
    expect(videosHeading).toBeInTheDocument()
  })

  it('should render empty state when no recommendations', () => {
    render(<RecommendationsSection recommendations={{ projects: [], videos: [] }} />)
    const emptyText = screen.getByText(/no hay recomendaciones/i)
    expect(emptyText).toBeInTheDocument()
  })

  it('should have proper ARIA labels', () => {
    render(<RecommendationsSection recommendations={mockRecommendations} />)
    const sections = screen.getAllByRole('region')
    expect(sections.length).toBeGreaterThan(0)
  })
})

