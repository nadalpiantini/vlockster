// tests/integration/poster-integration.test.ts

import { posterService } from '@/lib/services/posterService'

// Mock de fetch para simular la API
global.fetch = jest.fn()

describe('Poster Integration Tests', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear()
  })

  test('should fetch posters from API successfully', async () => {
    // Mock response
    const mockResponse = {
      success: true,
      posters: [
        {
          id: 1,
          title: 'Test Poster',
          year: '2024',
          rating: '9.0',
          duration: '2h 30m',
          genre: 'Drama',
          image: '/items/posters/test.jpg',
          description: 'Test description'
        }
      ],
      count: 1
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    })

    const response = await posterService.getPosters()
    
    expect(response.success).toBe(true)
    expect(response.posters).toHaveLength(1)
    expect(response.posters[0].title).toBe('Test Poster')
    expect(fetch).toHaveBeenCalledWith('/api/posters')
  })

  test('should handle API error when fetching posters', async () => {
    // Mock error response
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false
    })

    await expect(posterService.getPosters()).rejects.toThrow('Failed to fetch posters')
  })

  test('should add a new poster via API successfully', async () => {
    const newPoster = {
      title: 'New Poster',
      year: '2025',
      rating: '9.5',
      duration: '2h 15m',
      genre: 'Documentary',
      image: '/items/posters/new-poster.jpg',
      description: 'A new poster'
    }

    const mockResponse = {
      success: true,
      message: 'Poster agregado exitosamente',
      poster: newPoster
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    })

    const response = await posterService.addPoster(newPoster)
    
    expect(response.success).toBe(true)
    expect(response.message).toBe('Poster agregado exitosamente')
    expect(response.poster.title).toBe('New Poster')
    expect(fetch).toHaveBeenCalledWith('/api/posters', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPoster),
    })
  })

  test('should handle API error when adding a poster', async () => {
    const newPoster = {
      title: 'New Poster',
      year: '2025',
      rating: '9.5',
      duration: '2h 15m',
      genre: 'Documentary',
      image: '/items/posters/new-poster.jpg',
      description: 'A new poster'
    }

    // Mock error response
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false
    })

    await expect(posterService.addPoster(newPoster)).rejects.toThrow('Failed to add poster')
  })
})