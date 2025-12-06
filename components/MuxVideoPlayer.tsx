import * as React from "react";
import MuxPlayer from "@mux/mux-player-react";

// Define types for our player props
type MuxPlayerWrapperProps = {
  playbackId: string;
  title?: string;
  metadata?: Record<string, any>;
  autoPlay?: boolean;
  preload?: "none" | "metadata" | "auto";
  muted?: boolean;
  primaryColor?: string;
  secondaryColor?: string;
  forwardSeekOffset?: number;
  backwardSeekOffset?: number;
  maxResolution?: "720p" | "1080p";
  streamType?: "on-demand" | "live" | "ll-live";
  onLoadedMetadata?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onError?: (error: Error) => void;
  children?: React.ReactNode;
};

/**
 * Enhanced MUX Video Player wrapper for VLOCKSTER
 * Provides an improved video playback experience with analytics
 */
export const MuxVideoPlayer: React.FC<MuxPlayerWrapperProps> = ({
  playbackId,
  title = "",
  metadata = {},
  autoPlay = false,
  preload = "metadata",
  muted = false,
  primaryColor = "#ff0000",
  secondaryColor = "#ffffff",
  forwardSeekOffset = 10,
  backwardSeekOffset = 10,
  maxResolution = "1080p",
  streamType = "on-demand",
  onLoadedMetadata,
  onPlay,
  onPause,
  onEnded,
  onError,
  children
}) => {
  const handleLoadedMetadata = React.useCallback(() => {
    onLoadedMetadata?.();
  }, [onLoadedMetadata]);

  const handlePlay = React.useCallback(() => {
    onPlay?.();
  }, [onPlay]);

  const handlePause = React.useCallback(() => {
    onPause?.();
  }, [onPause]);

  const handleEnded = React.useCallback(() => {
    onEnded?.();
  }, [onEnded]);

  const handleError = React.useCallback((event: any) => {
    const error = event.detail;
    if (error && onError) {
      onError(error);
    }
  }, [onError]);

  return (
    <MuxPlayer
      streamType={streamType}
      playbackId={playbackId}
      title={title}
      metadata={metadata}
      autoPlay={autoPlay}
      preload={preload}
      muted={muted}
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
      forwardSeekOffset={forwardSeekOffset}
      backwardSeekOffset={backwardSeekOffset}
      maxResolution={maxResolution}
      onLoadedMetadata={handleLoadedMetadata}
      onPlay={handlePlay}
      onPause={handlePause}
      onEnded={handleEnded}
      onError={handleError}
      style={{ aspectRatio: "16 / 9", width: "100%", height: "auto" }}
    >
      {children}
    </MuxPlayer>
  );
};

export default MuxVideoPlayer;