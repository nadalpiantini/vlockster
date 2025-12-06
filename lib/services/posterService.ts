// services/posterService.ts

export interface Poster {
  id: number
  title: string
  year: string
  rating: string
  duration: string
  genre: string
  image: string
  description?: string
}

export interface PostersResponse {
  success: boolean
  posters: Poster[]
  count: number
}

export interface AddPosterRequest {
  title: string
  year: string
  rating: string
  duration: string
  genre: string
  image: string
  description?: string
}

export interface AddPosterResponse {
  success: boolean
  message: string
  poster: AddPosterRequest
}

export const posterService = {
  async getPosters(): Promise<PostersResponse> {
    const response = await fetch('/api/posters')
    
    if (!response.ok) {
      throw new Error('Failed to fetch posters')
    }
    
    return response.json()
  },

  async addPoster(posterData: AddPosterRequest): Promise<AddPosterResponse> {
    const response = await fetch('/api/posters', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(posterData),
    })
    
    if (!response.ok) {
      throw new Error('Failed to add poster')
    }
    
    return response.json()
  }
}