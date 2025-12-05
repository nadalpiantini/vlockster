import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-space)', 'system-ui', 'sans-serif'],
      },
      colors: {
        // VLOCKSTER Unified Design System (from moodboard)
        vlockster: {
          // Primary - Netflix-inspired red
          red: '#E50914',
          'red-dark': '#B20710',
          'red-light': '#FF1a1a',

          // Backgrounds - Dark theme
          black: '#050505',
          'black-light': '#0a0a0a',
          'gray-dark': '#1a1a1a',
          gray: '#2a2a2a',

          // Text colors
          white: '#FFFFFF',
          'white-soft': '#E5E5E5',
          'gray-text': '#888888',

          // Accent - Progress/Success
          green: '#05CE78',
          'green-dark': '#028858',

          // Ratings
          gold: '#FBBF24',

          // Semantic
          error: '#DC2626',
          warning: '#F59E0B',
          info: '#3B82F6',

          // Glass/Cards
          card: 'rgba(255, 255, 255, 0.05)',
          'card-hover': 'rgba(255, 255, 255, 0.08)',
        },
        // Legacy streamlab colors (deprecated, use vlockster)
        streamlab: {
          primary: '#FF0000',
          secondary: '#FF6B35',
          dark: '#0a0a0a',
          darker: '#050505',
          card: 'rgba(255, 255, 255, 0.05)',
          'card-hover': 'rgba(255, 255, 255, 0.08)',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
} satisfies Config

export default config
