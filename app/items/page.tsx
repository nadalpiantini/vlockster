'use client'

import PosterGallery from '@/components/PosterGallery'
import { motion } from 'framer-motion'

const PosterPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Animated background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-[#ff0000]/10"></div>
      </div>

      <main className="relative z-10 py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-[#FF0000] bg-clip-text text-transparent">
              Galería de Posters
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Descubre nuestra colección de películas independientes disponibles en VLOCKSTER
            </p>
          </motion.div>

          <PosterGallery
            title="Nuestros Posters"
            layout="grid"
          />
        </div>
      </main>
    </div>
  )
}

export default PosterPage