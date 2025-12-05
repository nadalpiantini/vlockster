import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { RecommendationsSection } from '@/components/RecommendationsSection'

// Mock fetch
global.fetch = vi.fn()

describe('RecommendationsSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should show loading state initially', () => {
    ;(global.fetch as any).mockImplementation(() => 
      new Promise(() => {}) // Never resolves to keep loading
    )

    render(<RecommendationsSection />)
    
    expect(screen.getByText(/recomendaciones para ti/i)).toBeInTheDocument()
    expect(screen.getByText(/analizando tu historial/i)).toBeInTheDocument()
  })

  it('should render recommendations when loaded', async () => {
    const mockRecommendations = {
      recommendations: [
        {
          id: '1',
          type: 'video' as const,
          title: 'Test Video',
          description: 'Test video description',
          reason: 'Based on your viewing history',
          confidence_score: 0.85,
        },
        {
          id: '2',
          type: 'project' as const,
          title: 'Test Project',
          description: 'Test project description',
          reason: 'Similar to projects you backed',
          confidence_score: 0.75,
        },
      ],
      insights: 'Personalized recommendations based on your activity',
    }

    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRecommendations,
    })

    render(<RecommendationsSection />)

    await waitFor(() => {
      expect(screen.getByText(/recomendaciones para ti/i)).toBeInTheDocument()
    })

    expect(screen.getByText('Test Video')).toBeInTheDocument()
    expect(screen.getByText('Test Project')).toBeInTheDocument()
  })

  it('should not render when there are no recommendations', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        recommendations: [],
        insights: '',
      }),
    })

    const { container } = render(<RecommendationsSection />)

    await waitFor(() => {
      // Component returns null when no recommendations
      expect(container.firstChild).toBeNull()
    })
  })

  it('should not render when there is an error', async () => {
    ;(global.fetch as any).mockRejectedValueOnce(new Error('Network error'))

    const { container } = render(<RecommendationsSection />)

    await waitFor(() => {
      // Component returns null when there's an error
      expect(container.firstChild).toBeNull()
    })
  })

  it('should fetch recommendations from API', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        recommendations: [],
        insights: '',
      }),
    })

    render(<RecommendationsSection />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/recommendations')
    })
  })
})

