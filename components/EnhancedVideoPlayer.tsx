'use client'

import { useState, useRef, useCallback } from 'react'
import { MuxVideoPlayer } from './MuxVideoPlayer'
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  Settings,
  RotateCcw,
  RotateCw,
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
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(muted)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)

  // Prepare metadata for MUX analytics
  const metadata = {
    video_title: title,
    video_id: videoId,
    player_software_version: "vlockster-1.0",
    custom_key: 'custom_value',
    // Add more metadata as needed
  }

  // Handle MUX player events
  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    onPlay?.();
  }, [onPlay]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
    onPause?.();
  }, [onPause]);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    onEnded?.();
  }, [onEnded]);

  const handleError = useCallback((err: Error) => {
    setError(err.message);
    setIsLoading(false);
    console.error("MUX Player Error:", err);
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Toggle play/pause
  const togglePlay = () => {
    // MUX player handles play/pause internally, but we'll maintain our state
    if (isPlaying) {
      // We'll handle this via MUX player controls
    } else {
      // We'll handle this via MUX player controls
    }
  }

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  }

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  }

  // Change playback speed
  const changePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
  }

  // Reset player
  const resetPlayer = () => {
    setIsLoading(true);
    setError(null);
  }

  return (
    <div ref={containerRef} className={`relative bg-black rounded-lg overflow-hidden ${className}`}>
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black">
          <div className="text-white">Loading...</div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black">
          <div className="text-red-500">Error: {error}</div>
        </div>
      )}

      {/* MUX Player */}
      <MuxVideoPlayer
        playbackId={videoId}
        title={title}
        metadata={metadata}
        autoPlay={autoplay}
        muted={isMuted}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        onLoadedMetadata={handleLoadedMetadata}
        onError={handleError}
        primaryColor="#ff0000"
        secondaryColor="#ffffff"
        forwardSeekOffset={10}
        backwardSeekOffset={10}
        maxResolution="1080p"
      >
        {/* Additional MUX player controls can be added here if needed */}
      </MuxVideoPlayer>

      {/* Custom Controls Overlay - Only shown when needed */}
      <div 
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Play/Pause button overlay - only show when paused */}
        {!isPlaying && !isLoading && !error && (
          <button
            onClick={togglePlay}
            className="absolute z-20 bg-black/50 rounded-full p-4 hover:bg-black/70 transition-colors"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-12 h-12 text-white" />
            ) : (
              <Play className="w-12 h-12 text-white ml-1" />
            )}
          </button>
        )}
      </div>

      {/* Bottom Controls Bar */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
        showControls ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={togglePlay}
              className="text-white hover:text-gray-300"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
            </button>
            
            <button 
              onClick={toggleMute}
              className="text-white hover:text-gray-300"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </button>
            
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-24 accent-red-600"
              aria-label="Volume control"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className="text-white hover:text-gray-300"
                aria-label="Settings"
              >
                <Settings className="w-6 h-6" />
              </button>
              
              {showSettings && (
                <div className="absolute bottom-full mb-2 right-0 bg-gray-800 rounded-lg p-2 z-30">
                  <div className="text-white text-sm mb-2">Playback Speed:</div>
                  <div className="flex flex-wrap gap-1">
                    {playbackRates.map(rate => (
                      <button
                        key={rate}
                        onClick={() => changePlaybackRate(rate)}
                        className={`px-2 py-1 text-sm rounded ${
                          playbackRate === rate 
                            ? 'bg-red-600 text-white' 
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <button 
              onClick={toggleFullscreen}
              className="text-white hover:text-gray-300"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}