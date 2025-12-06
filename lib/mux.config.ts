// mux.config.ts
// Configuration for MUX integration

// Set up MUX defaults for VLOCKSTER
const muxConfig = {
  // MUX API configuration
  debug: process.env.NODE_ENV === 'development',
  disableCookies: false, // Enable cookies for better analytics
  
  // Playback defaults
  maxResolution: '1080p',
  
  // Player customization
  theme: 'vlockster-theme',
  primaryColor: '#FF0000', // VLOCKSTER red
  secondaryColor: '#FFFFFF', // White
  
  // Analytics
  beaconCollectionDomain: process.env.NEXT_PUBLIC_MUX_BEACON_DOMAIN,
  playbackId: undefined,
  
  // Error handling
  errorHandler: (error: Error) => {
    console.error('MUX Player Error:', error);
    // Report to your error tracking service
  },
  
  // Performance
  preferMse: true, // Media Source Extensions for better performance
  maxBitrate: 8000000, // 8 Mbps max
  minBitrate: 200000,  // 200 kbps min
  
  // UI options
  hideControls: false,
  autoplay: false,
  muted: false,
  loop: false,
};

export default muxConfig;

// Types for MUX configuration
export interface MuxConfig {
  debug?: boolean;
  disableCookies?: boolean;
  maxResolution?: string;
  theme?: string;
  primaryColor?: string;
  secondaryColor?: string;
  beaconCollectionDomain?: string;
  playbackId?: string;
  errorHandler?: (error: Error) => void;
  preferMse?: boolean;
  maxBitrate?: number;
  minBitrate?: number;
  hideControls?: boolean;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
}