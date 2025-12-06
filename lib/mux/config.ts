// Enhanced MUX Configuration for VLOCKSTER
export const muxConfig = {
  // Analytics and Performance
  debug: process.env.NODE_ENV === 'development',
  disableCookies: false,
  
  // Player Customization for VLOCKSTER Brand
  theme: 'vlockster-premium',
  primaryColor: '#FF0000',  // VLOCKSTER Red
  secondaryColor: '#FFFFFF',  // White contrast
  
  // Performance Optimization
  preferMse: true,  // Media Source Extensions for better performance
  maxBitrate: 8000000,  // 8 Mbps max
  minBitrate: 200000,   // 200 kbps min
  
  // Quality Settings
  maxResolution: '1080p',
  streamType: 'on-demand',
  
  // UI Customization
  hideControls: false,
  autoplay: false,
  muted: false,
  loop: false,
  
  // Error Handling
  errorHandler: (error: Error) => {
    console.error('MUX Player Error:', error);
    // Integration with your error tracking service
  }
};

// Export type for configuration
export type MuxConfig = typeof muxConfig;
