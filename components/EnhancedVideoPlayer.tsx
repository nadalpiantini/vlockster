'use client'

import { useEffect, useRef, useState, KeyboardEvent } from 'react'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  Settings,
  Square,
  SkipBack,
  SkipForward,
  Download,
  Share2,
  MoreHorizontal
} from 'lucide-react'

export interface VideoPlayerProps {
  videoId: string
  title: string
  poster?: string
  autoplay?: boolean
  muted?: boolean
  controls?: boolean
  className?: string
  onEnded?: () => void
  onTimeUpdate?: (currentTime: number) => void
  onPlay?: () => void
  onPause?: () => void
  playbackRates?: number[]
  videoUrl?: string
}

export function EnhancedVideoPlayer({
  videoId,
  title,
  poster,
  autoplay = false,
  muted = false,
  controls = true,
  className = '',
  onEnded,
  onTimeUpdate,
  onPlay,
  onPause,
  playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2],
  videoUrl
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(muted)
  const [volume, setVolume] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [isBuffering, setIsBuffering] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showSettings, setShowSettings] = useState(false)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const [isVideoError, setIsVideoError] = useState(false)
  
  const controlsTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const settingsTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Cloudflare Stream URL (si no se proporciona URL específica)
  const streamUrl = videoUrl || `https://customer-${process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID}.cloudflarestream.com/${videoId}/manifest/video.m3u8`

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => {
      setIsPlaying(true)
      onPlay?.()
    }
    const handlePause = () => {
      setIsPlaying(false)
      onPause?.()
    }
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
      onTimeUpdate?.(video.currentTime)
    }
    const handleDurationChange = () => setDuration(video.duration)
    const handleEnded = () => {
      setIsPlaying(false)
      onEnded?.()
    }
    const handleLoadedData = () => setIsLoading(false)
    const handleWaiting = () => setIsBuffering(true)
    const handleCanPlay = () => setIsBuffering(false)
    const handleError = () => {
      setIsVideoError(true)
      setIsLoading(false)
    }

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('durationchange', handleDurationChange)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('waiting', handleWaiting)
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('error', handleError)

    // Set initial volume and mute state
    video.volume = volume
    video.muted = isMuted

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('durationchange', handleDurationChange)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('waiting', handleWaiting)
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('error', handleError)
    }
  }, [onEnded, onTimeUpdate, onPlay, onPause, volume, isMuted])

  useEffect(() => {
    // Cleanup timeouts on unmount
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
      if (settingsTimeoutRef.current) clearTimeout(settingsTimeoutRef.current)
    }
  }, [])

  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play().catch(e => console.error('Play failed:', e))
    }
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (value: number) => {
    if (!videoRef.current) return
    videoRef.current.volume = value
    setVolume(value)
    if (value === 0) {
      setIsMuted(true)
    } else if (isMuted) {
      setIsMuted(false)
    }
    setShowVolumeSlider(false)
  }

  const handleSeek = (value: number) => {
    if (!videoRef.current) return
    videoRef.current.currentTime = value
    setCurrentTime(value)
  }

  const handleSkip = (seconds: number) => {
    if (!videoRef.current) return
    videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds))
  }

  const toggleFullscreen = async () => {
    if (!containerRef.current) return

    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen()
      setIsFullscreen(true)
    } else {
      await document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const toggleSettings = () => {
    setShowSettings(!showSettings)
    if (!showSettings) {
      // Auto hide settings after a while
      if (settingsTimeoutRef.current) clearTimeout(settingsTimeoutRef.current)
      settingsTimeoutRef.current = setTimeout(() => {
        setShowSettings(false)
      }, 5000)
    } else {
      if (settingsTimeoutRef.current) clearTimeout(settingsTimeoutRef.current)
    }
  }

  const handlePlaybackRateChange = (rate: number) => {
    if (!videoRef.current) return
    videoRef.current.playbackRate = rate
    setPlaybackRate(rate)
    setShowSettings(false)
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false)
    }, 3000)
  }

  const handleKeyPress = (e: KeyboardEvent) => {
    if (!videoRef.current) return
    
    switch(e.key) {
      case ' ':
      case 'k':
        e.preventDefault()
        togglePlay()
        break
      case 'm':
        e.preventDefault()
        toggleMute()
        break
      case 'f':
        e.preventDefault()
        toggleFullscreen()
        break
      case 'ArrowLeft':
        e.preventDefault()
        handleSeek(Math.max(0, currentTime - 5))
        break
      case 'ArrowRight':
        e.preventDefault()
        handleSeek(Math.min(duration, currentTime + 5))
        break
      case 'ArrowUp':
        e.preventDefault()
        handleVolumeChange(Math.min(1, volume + 0.1))
        break
      case 'ArrowDown':
        e.preventDefault()
        handleVolumeChange(Math.max(0, volume - 0.1))
        break
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        e.preventDefault()
        // Seek to percentage of the video
        const percent = parseInt(e.key) / 10
        handleSeek(duration * percent)
        break
    }
  }

  // Show thumbnail placeholder when loading
  const thumbnailFallback = poster || `https://placehold.co/1280x720/1a1a1a/ffffff?text=${encodeURIComponent(title)}`

  return (
    <div
      ref={containerRef}
      className={`relative bg-black rounded-lg overflow-hidden group ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onKeyDown={handleKeyPress}
      tabIndex={0}
      aria-label={`Reproductor de video: ${title}`}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full aspect-video"
        poster={isVideoError ? thumbnailFallback : poster}
        autoPlay={autoplay}
        muted={muted}
        playsInline
        onClick={togglePlay}
      >
        {videoUrl ? (
          <source src={videoUrl} type="video/mp4" />
        ) : (
          <source src={streamUrl} type="application/x-mpegURL" />
        )}
        Your browser does not support the video tag.
      </video>

      {/* Loading/Bufffering Indicator */}
      {(isLoading || isBuffering) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
            {isBuffering && (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <div className="text-xs">Buffering...</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {isVideoError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white p-4">
          <div className="text-xl mb-2">Error al cargar el video</div>
          <div className="text-sm mb-4">Hubo un problema al cargar este video. Por favor inténtelo más tarde.</div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Intentar de nuevo
          </button>
        </div>
      )}

      {/* Play/Pause Overlay */}
      {!isPlaying && !isLoading && !isVideoError && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors"
          aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
        >
          <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center hover:bg-red-700 transition-colors shadow-2xl">
            <Play className="w-10 h-10 text-white ml-1" />
          </div>
        </button>
      )}

      {/* Custom Controls */}
      {controls && (
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent transition-opacity duration-300 ${
            showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Progress Bar */}
          <div className="px-4 pt-4">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={(e) => handleSeek(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #E50914 0%, #E50914 ${(currentTime / duration) * 100}%, #2a2a2a ${(currentTime / duration) * 100}%, #2a2a2a 100%)`,
              }}
              aria-label="Barra de progreso"
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between px-4 pb-4 pt-2">
            <div className="flex items-center gap-2 md:gap-4">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="text-white hover:text-gray-300 transition-colors"
                aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </button>

              {/* Skip Backward */}
              <button
                onClick={() => handleSkip(-10)}
                className="text-white hover:text-gray-300 transition-colors hidden md:block"
                aria-label="Retroceder 10 segundos"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              {/* Skip Forward */}
              <button
                onClick={() => handleSkip(10)}
                className="text-white hover:text-gray-300 transition-colors hidden md:block"
                aria-label="Avanzar 10 segundos"
              >
                <SkipForward className="w-5 h-5" />
              </button>

              {/* Volume with Popup */}
              <div className="relative flex items-center">
                <button
                  onClick={toggleMute}
                  onMouseEnter={() => setShowVolumeSlider(true)}
                  onMouseLeave={() => setShowVolumeSlider(false)}
                  className="text-white hover:text-gray-300 transition-colors"
                  aria-label={isMuted || volume === 0 ? 'Desmutear' : 'Mutar'}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-6 h-6" />
                  ) : (
                    <Volume2 className="w-6 h-6" />
                  )}
                </button>

                {/* Volume Slider Popup */}
                {(showVolumeSlider || showControls) && (
                  <div 
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black/80 backdrop-blur-sm rounded px-2 py-1"
                    onMouseEnter={() => setShowVolumeSlider(true)}
                    onMouseLeave={() => setShowVolumeSlider(false)}
                  >
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      className="w-20 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer vertical-slider"
                      style={{ WebkitAppearance: 'slider-vertical' }}
                      aria-label="Control de volumen"
                    />
                  </div>
                )}
              </div>

              {/* Time */}
              <div className="text-sm text-white font-medium hidden md:block">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Settings Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleSettings}
                  className="text-white hover:text-gray-300 transition-colors"
                  aria-label="Configuración"
                  aria-expanded={showSettings}
                >
                  <Settings className="w-6 h-6" />
                </button>

                {/* Settings Menu */}
                {showSettings && (
                  <div 
                    className="absolute bottom-full right-0 mb-2 bg-black/90 backdrop-blur-sm rounded shadow-lg z-50 min-w-[150px]"
                    onMouseLeave={() => setShowSettings(false)}
                  >
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-400 border-b border-gray-700">Velocidad de reproducción</div>
                      {playbackRates.map(rate => (
                        <button
                          key={rate}
                          onClick={() => handlePlaybackRateChange(rate)}
                          className={`block w-full text-left px-4 py-2 text-sm ${
                            playbackRate === rate 
                              ? 'text-red-500 bg-gray-800' 
                              : 'text-white hover:bg-gray-800'
                          }`}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Share Button */}
              <button
                className="text-white hover:text-gray-300 transition-colors hidden md:block"
                aria-label="Compartir"
              >
                <Share2 className="w-6 h-6" />
              </button>

              {/* More Options */}
              <button
                className="text-white hover:text-gray-300 transition-colors hidden md:block"
                aria-label="Más opciones"
              >
                <MoreHorizontal className="w-6 h-6" />
              </button>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-gray-300 transition-colors"
                aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
              >
                {isFullscreen ? (
                  <Minimize className="w-6 h-6" />
                ) : (
                  <Maximize className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Title Overlay */}
      {title && !isPlaying && !isLoading && !isVideoError && (
        <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/80 to-transparent">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
      )}
    </div>
  )
}