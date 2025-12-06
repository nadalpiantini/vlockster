import { NextResponse } from 'next/server'

// Esta API devuelve la lista de posters disponibles
export async function GET() {
  try {
    // Lista de posters existentes en /public/items/posters/
    const posters = [
      {
        id: 1,
        title: 'Una Ola A La Vez',
        year: '2024',
        rating: '9.2',
        duration: '2h 15m',
        genre: 'Documentary',
        image: '/items/posters/Una Ola A La Vez Poster.png',
        description: 'Un viaje emocional a través de las olas de la vida, explorando la conexión entre el hombre y el mar.'
      },
      {
        id: 2,
        title: 'Granito de Arena',
        year: '2020',
        rating: '8.7',
        duration: '1h 45m',
        genre: 'Documentary',
        image: '/items/posters/Granito de Arena Poster.JPG',
        description: 'Pequeñas historias que conforman la gran historia de la humanidad, contadas a través de granitos de arena.'
      },
      {
        id: 3,
        title: 'Atravesando el Jordán',
        year: '2020',
        rating: '9.0',
        duration: '2h 30m',
        genre: 'Drama',
        image: '/items/posters/Atravesando el Jordan Poster.jpg',
        description: 'Un viaje espiritual y emocional de redención y esperanza en las orillas del río Jordán.'
      },
      {
        id: 4,
        title: 'Kintsugi',
        year: '2024',
        rating: '8.8',
        duration: '1h 50m',
        genre: 'Drama',
        image: '/items/posters/kintsugi poster.jpg',
        description: 'La belleza de lo imperfecto, una historia sobre cómo las heridas pueden convertirse en oro.'
      },
      {
        id: 5,
        title: 'Una Breve Historia de Amor',
        year: '2024',
        rating: '8.6',
        duration: '1h 30m',
        genre: 'Romance',
        image: '/items/posters/Una Breve Historia de Amor Poster.jpg',
        description: 'Una historia de amor efímera pero intensa que deja huella para siempre.'
      },
      {
        id: 6,
        title: 'Motel',
        year: '2024',
        rating: '8.9',
        duration: '1h 40m',
        genre: 'Thriller',
        image: '/items/posters/Motel Poster Final.png',
        description: 'Secretos ocultos en un motel remoto, donde nada es lo que parece.'
      },
      {
        id: 7,
        title: 'En La Oscuridad',
        year: '2024',
        rating: '8.7',
        duration: '1h 55m',
        genre: 'Horror',
        image: '/items/posters/POSTER EN LA OSCURIDAD.jpg',
        description: 'Una noche en la que la oscuridad revela los temores más profundos del alma humana.'
      },
      {
        id: 8,
        title: 'Noche de Circo',
        year: '2024',
        rating: '8.8',
        duration: '2h 10m',
        genre: 'Drama',
        image: '/items/posters/POSTER NOCHE DE CIRCO.jpg',
        description: 'Entre luces de neón y trapecios, una historia de sueños, magia y realidades ocultas.'
      },
      {
        id: 9,
        title: 'Dos Policias en Apuros',
        year: '2024',
        rating: '8.5',
        duration: '1h 50m',
        genre: 'Comedy',
        image: '/items/posters/Dos Policias en Apuros Poster.jpg',
        description: 'Dos policías inexpertos se meten en un lío tras otro en esta divertida comedia de acción.'
      },
      {
        id: 10,
        title: 'En Tu Piel',
        year: '2024',
        rating: '8.9',
        duration: '2h 5m',
        genre: 'Drama',
        image: '/items/posters/En Tu Piel Poster.jpeg',
        description: 'Una inmersión profunda en la empatía y la experiencia humana a través de la piel.'
      }
    ]

    return NextResponse.json({ 
      success: true, 
      posters,
      count: posters.length 
    })
  } catch (error) {
    console.error('Error fetching posters:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Error al obtener los posters' 
    }, { status: 500 })
  }
}

// Opcional: Permitir agregar nuevos posters si se proporciona el endpoint adecuado
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validar que el body contenga al menos el título y la ruta de la imagen
    if (!body.image || !body.title) {
      return NextResponse.json({ 
        success: false, 
        error: 'Faltan campos requeridos (title, image)' 
      }, { status: 400 })
    }
    
    // En una implementación real, aquí se validarían y almacenarían los datos del nuevo poster
    // Pero para esta implementación, solo devolvemos éxito
    
    return NextResponse.json({ 
      success: true, 
      message: 'Poster agregado exitosamente',
      poster: body
    })
  } catch (error) {
    console.error('Error adding poster:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Error al agregar el poster' 
    }, { status: 500 })
  }
}