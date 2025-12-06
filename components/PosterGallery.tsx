'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Play, Star, Clock, Calendar } from 'lucide-react'
import { posterService, type Poster } from '@/lib/services/posterService'

interface PosterGalleryProps {
  initialPosters?: Poster[]
  title?: string
  showAllLink?: string
  layout?: 'grid' | 'carousel'
  className?: string
}

const PosterGallery = ({
  initialPosters = [],
  title = 'Posters',
  showAllLink,
  layout = 'grid',
  className = ''
}: PosterGalleryProps) => {
  const [posters, setPosters] = useState<Poster[]>(initialPosters)
  const [loading, setLoading] = useState(!initialPosters.length)
  const [selectedPoster, setSelectedPoster] = useState<Pick<Poster, 'title' | 'description'> | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (!initialPosters.length) {
      loadPosters()
    }
  }, [initialPosters.length])

  const loadPosters = async () => {
    try {
      setLoading(true)
      const response = await posterService.getPosters()
      if (response.success) {
        setPosters(response.posters)
      }
    } catch (error) {
      console.error('Error loading posters:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePosterClick = (poster: Poster) => {
    setSelectedPoster({
      title: poster.title,
      description: poster.description || `Explore the world of ${poster.title}`
    })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedPoster(null)
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  }

  if (loading) {
    return (
      <div className={`container mx-auto px-4 ${className} flex justify-center items-center h-64`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF0000]"></div>
      </div>
    )
  }

  if (layout === 'carousel') {
    return (
      <div className={`relative ${className}`}>
        <div className="overflow-hidden">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {posters.map((poster, idx) => (
              <motion.div
                key={poster.id}
                variants={item}
                className="flex-shrink-0 cursor-pointer"
                onClick={() => handlePosterClick(poster)}
                whileHover={{ scale: 1.03, zIndex: 10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative group">
                  <div className="relative w-64 h-96 rounded-xl overflow-hidden">
                    <Image
                      src={poster.image}
                      alt={poster.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={idx < 3}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                      <h3 className="text-lg font-bold text-white truncate">{poster.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-white/80">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {poster.year}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          {poster.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {poster.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {isModalOpen && selectedPoster && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={closeModal}
          >
            <div
              className="relative bg-gray-900 rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-white hover:text-gray-300"
                onClick={closeModal}
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold text-white mb-4">{selectedPoster.title}</h2>
              <p className="text-white/80 mb-6">{selectedPoster.description}</p>
              <div className="flex justify-end">
                <button
                  className="px-6 py-3 bg-gradient-to-r from-[#FF0000] to-[#FF6B35] text-white rounded-xl font-semibold hover:from-[#FF1a1a] hover:to-[#FF7B45] transition-all"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <motion.div
      className={`container mx-auto px-4 ${className}`}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {title && (
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
            {title}
          </h2>
          {showAllLink && (
            <a
              href={showAllLink}
              className="text-[#FF0000] hover:text-[#FF6B35] transition-colors flex items-center gap-1"
            >
              View all
              <span className="inline-block ml-1">→</span>
            </a>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {posters.map((poster) => (
          <motion.div
            key={poster.id}
            variants={item}
            className="cursor-pointer"
            onClick={() => handlePosterClick(poster)}
            whileHover={{ scale: 1.05, zIndex: 10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative group">
              <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden">
                <Image
                  src={poster.image}
                  alt={poster.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                  priority={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                  <h3 className="text-white font-semibold truncate">{poster.title}</h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-white/80">
                    <span>{poster.year}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {poster.rating}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {isModalOpen && selectedPoster && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="relative bg-gray-900 rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300"
              onClick={closeModal}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-white mb-4">{selectedPoster.title}</h2>
            <p className="text-white/80 mb-6">{selectedPoster.description}</p>
            <div className="flex justify-end">
              <button
                className="px-6 py-3 bg-gradient-to-r from-[#FF0000] to-[#FF6B35] text-white rounded-xl font-semibold hover:from-[#FF1a1a] hover:to-[#FF7B45] transition-all"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default PosterGallery