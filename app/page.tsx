import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'VLOCKSTER - El futuro del cine independiente',
  description:
    'Streaming, crowdfunding y comunidad para cine independiente. Descubre, financia y forma parte de historias extraordinarias.',
  keywords: [
    'cine independiente',
    'streaming',
    'crowdfunding',
    'películas indie',
    'creadores',
    'comunidad cinematográfica',
  ],
  openGraph: {
    title: 'VLOCKSTER - El futuro del cine independiente',
    description:
      'Streaming, crowdfunding y comunidad para cine independiente',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VLOCKSTER - El futuro del cine independiente',
    description:
      'Streaming, crowdfunding y comunidad para cine independiente',
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <nav className="flex justify-between items-center mb-16">
          <h1 className="text-3xl font-bold">VLOCKSTER</h1>
          <div className="space-x-4">
            <Link
              href="/login"
              className="px-4 py-2 rounded-md hover:bg-gray-800 transition"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition"
            >
              Registrarse
            </Link>
          </div>
        </nav>

        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h2 className="text-5xl md:text-6xl font-bold leading-tight">
            El futuro del cine independiente está aquí
          </h2>
          <p className="text-xl text-gray-300">
            Streaming • Crowdfunding • Comunidad
          </p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            VLOCKSTER une a creadores y amantes del cine indie en una plataforma
            única donde puedes ver, financiar y formar parte de historias
            extraordinarias.
          </p>
          <div className="flex gap-4 justify-center mt-8">
            <Link
              href="/signup"
              className="px-8 py-3 bg-blue-600 rounded-md hover:bg-blue-700 transition text-lg font-semibold"
            >
              Comenzar Gratis
            </Link>
            <Link
              href="/watch"
              className="px-8 py-3 bg-gray-800 rounded-md hover:bg-gray-700 transition text-lg font-semibold"
            >
              Explorar Contenido
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800/50 p-8 rounded-lg">
            <div className="text-4xl mb-4">🎬</div>
            <h3 className="text-2xl font-bold mb-3">Streaming</h3>
            <p className="text-gray-400">
              Accede a una biblioteca de cine independiente de alta calidad.
              Descubre historias únicas de creadores de todo el mundo.
            </p>
          </div>

          <div className="bg-gray-800/50 p-8 rounded-lg">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-2xl font-bold mb-3">Crowdfunding</h3>
            <p className="text-gray-400">
              Financia proyectos cinematográficos y forma parte de su creación.
              Recompensas exclusivas para los que apoyan.
            </p>
          </div>

          <div className="bg-gray-800/50 p-8 rounded-lg">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-2xl font-bold mb-3">Comunidad</h3>
            <p className="text-gray-400">
              Conéctate con otros cinéfilos y creadores. Participa en discusiones,
              eventos y talleres exclusivos.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-blue-600 rounded-lg p-12 text-center">
          <h3 className="text-3xl font-bold mb-4">
            ¿Eres un creador de contenido indie?
          </h3>
          <p className="text-lg mb-6 text-blue-100">
            Solicita acceso como creator y comparte tu trabajo con una audiencia
            global apasionada por el cine independiente.
          </p>
          <Link
            href="/apply"
            className="inline-block px-8 py-3 bg-white text-blue-600 rounded-md hover:bg-gray-100 transition text-lg font-semibold"
          >
            Solicitar Acceso de Creator
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-400">
        <p>&copy; 2025 VLOCKSTER. Plataforma para cine independiente.</p>
      </footer>
    </div>
  )
}
