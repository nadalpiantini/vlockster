'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  Loader2,
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
}

export function VideoPlayer({
  videoId,
  title,
  poster,
  autoplay = false,
  muted = false,
  controls = true,
  className = '',
  onEnded,
  onTimeUpdate,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(muted)
  const [volume, setVolume] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Cloudflare Stream URL
  const streamUrl = `https://customer-${process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID}.cloudflarestream.com/${videoId}/manifest/video.m3u8`

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
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
    const handleWaiting = () => setIsLoading(true)
    const handleCanPlay = () => setIsLoading(false)

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('durationchange', handleDurationChange)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('waiting', handleWaiting)
    video.addEventListener('canplay', handleCanPlay)

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('durationchange', handleDurationChange)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('waiting', handleWaiting)
      video.removeEventListener('canplay', handleCanPlay)
    }
  }, [onEnded, onTimeUpdate])

  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
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
  }

  const handleSeek = (value: number) => {
    if (!videoRef.current) return
    videoRef.current.currentTime = value
    setCurrentTime(value)
  }

  const toggleFullscreen = async () => {
    if (!videoRef.current?.parentElement) return

    if (!document.fullscreenElement) {
      await videoRef.current.parentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      await document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false)
    }, 3000)
  }

  return (
    <div
      className={`relative bg-vlockster-black rounded-lg overflow-hidden group ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full aspect-video"
        poster={poster}
        autoPlay={autoplay}
        muted={muted}
        playsInline
        onClick={togglePlay}
      >
        <source src={streamUrl} type="application/x-mpegURL" />
        Your browser does not support the video tag.
      </video>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-vlockster-black/50">
          <Loader2 className="w-12 h-12 text-vlockster-white animate-spin" />
        </div>
      )}

      {/* Play/Pause Overlay */}
      {!isPlaying && !isLoading && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-vlockster-black/30 hover:bg-vlockster-black/50 transition-colors"
          aria-label="Play video"
        >
          <div className="w-20 h-20 rounded-full bg-vlockster-red flex items-center justify-center hover:bg-vlockster-red-dark transition-colors shadow-2xl">
            <Play className="w-10 h-10 text-vlockster-white ml-1" />
          </div>
        </button>
      )}

      {/* Custom Controls */}
      {controls && (
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-vlockster-black via-vlockster-black/90 to-transparent transition-opacity duration-300 ${
            showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Progress Bar */}
          <div className="px-4 pt-4">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={(e) => handleSeek(parseFloat(e.target.value))}
              className="w-full h-1 bg-vlockster-gray rounded-lg appearance-none cursor-pointer progress-bar"
              style={{
                background: `linear-gradient(to right, #E50914 0%, #E50914 ${(currentTime / duration) * 100}%, #2a2a2a ${(currentTime / duration) * 100}%, #2a2a2a 100%)`,
              }}
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between px-4 pb-4 pt-2">
            <div className="flex items-center gap-4">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="text-vlockster-white hover:text-vlockster-red transition-colors"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </button>

              {/* Volume */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="text-vlockster-white hover:text-vlockster-red transition-colors"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-6 h-6" />
                  ) : (
                    <Volume2 className="w-6 h-6" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-20 h-1 bg-vlockster-gray rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Time */}
              <div className="text-sm text-vlockster-white font-medium">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Settings */}
              <button
                className="text-vlockster-white hover:text-vlockster-red transition-colors"
                aria-label="Settings"
              >
                <Settings className="w-6 h-6" />
              </button>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="text-vlockster-white hover:text-vlockster-red transition-colors"
                aria-label="Fullscreen"
              >
                <Maximize className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Title Overlay */}
      {title && !isPlaying && (
        <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-vlockster-black/80 to-transparent">
          <h2 className="text-2xl font-bold text-vlockster-white">{title}</h2>
        </div>
      )}
    </div>
  )
}
