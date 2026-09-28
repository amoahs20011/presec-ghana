import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
      },
      screens: {
        '2xl': '1280px',
      },
    },
    extend: {
      colors: {
        // Brand
        brand: {
          DEFAULT: '#1E3A8A',
          dark: '#172554',
          light: '#3B82F6',
          softer: '#DBEAFE',
        },
        // Gold accent
        gold: {
          DEFAULT: '#F59E0B',
          dark: '#B45309',
          light: '#FCD34D',
          softer: '#FEF3C7',
        },
        // Semantic
        success: {
          DEFAULT: '#10B981',
          light: '#D1FAE5',
          dark: '#047857',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FEF3C7',
          dark: '#B45309',
        },
        error: {
          DEFAULT: '#EF4444',
          light: '#FEE2E2',
          dark: '#B91C1C',
        },
        info: {
          DEFAULT: '#0EA5E9',
          light: '#E0F2FE',
          dark: '#0369A1',
        },
        // Surfaces
        surface: {
          DEFAULT: '#1E293B',       // was #FFFFFF — now dark slate
          hover: '#334155',          // was #F1F5F9
          alt: '#0F172A',            // was #F8FAFC — now darkest
          dark: '#1E293B',
          darker: '#0F172A',
        },
        border: {
          DEFAULT: '#334155',       // was #E5E7EB
          light: '#475569',          // was #F3F4F6
          dark: '#1E293B',           // was #334155
        },
        text: {
          DEFAULT: '#F1F5F9',       // was #000000 — now light
          secondary: '#CBD5E1',      // was #1F2937
          muted: '#94A3B8',          // was #4B5563
          invert: '#0F172A',         // was #FFFFFF
        },
        // Legacy aliases (so existing code keeps working)
        presec: {
          blue: '#1E3A8A',
          'blue-dark': '#172554',
          'blue-light': '#3B82F6',
          gold: '#F59E0B',
          'gold-dark': '#B45309',
          'gold-light': '#FCD34D',
          bg: '#0F172A',
          'bg-alt': '#1E293B',
          border: '#334155',
          text: '#F1F5F9',
          'text-muted': '#94A3B8',
          success: '#10B981',
          error: '#EF4444',
        },
      },
      fontFamily: {
  sans: [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
  display: [
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Poppins',
    'Arial',
    'sans-serif',
  ],
  mono: [
    'ui-monospace',
    'SFMono-Regular',
    'JetBrains Mono',
    'Menlo',
    'Consolas',
    'monospace',
  ],
},
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
        xs: ['0.75rem', { lineHeight: '1.125rem' }],
        sm: ['0.875rem', { lineHeight: '1.375rem' }],
        base: ['1rem', { lineHeight: '1.625rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.875rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.375rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.75rem' }],
        '5xl': ['3rem', { lineHeight: '3.5rem' }],
        '6xl': ['3.75rem', { lineHeight: '4.25rem' }],
        '7xl': ['4.5rem', { lineHeight: '5rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '100': '25rem',
        '120': '30rem',
      },
      borderRadius: {
        xs: '0.25rem',
        sm: '0.375rem',
        DEFAULT: '0.5rem',
        md: '0.625rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        DEFAULT: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        md: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        lg: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        xl: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '2xl': '0 30px 60px -12px rgb(0 0 0 / 0.3)',
                glow: '0 0 20px rgba(245, 158, 11, 0.35)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.35)',
        'glow-violet': '0 0 20px rgba(139, 92, 246, 0.35)',
        'glow-pink': '0 0 20px rgba(236, 72, 153, 0.35)',
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.35)',
        inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
      },
      backgroundImage: {
        'gradient-brand':
          'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 45%, #F59E0B 100%)',
        'gradient-gold':
          'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
        'gradient-navy':
          'linear-gradient(135deg, #172554 0%, #1E3A8A 100%)',
               'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-brand':
          'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 45%, #F59E0B 100%)',
        'gradient-gold':
          'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
        'gradient-navy':
          'linear-gradient(135deg, #172554 0%, #1E3A8A 100%)',
        'gradient-sky':
          'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
        'gradient-neon':
          'linear-gradient(135deg, #6366F1 0%, #EC4899 50%, #F59E0B 100%)',
        'gradient-sunset':
          'linear-gradient(135deg, #F59E0B 0%, #EC4899 50%, #8B5CF6 100%)',
        'gradient-ocean':
          'linear-gradient(135deg, #06B6D4 0%, #3B82F6 50%, #8B5CF6 100%)',
        'gradient-emerald':
          'linear-gradient(135deg, #10B981 0%, #06B6D4 50%, #3B82F6 100%)',
         'gradient-sky':
          'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'grid-pattern':
          "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0z' fill='none' stroke='%23E2E8F0' stroke-width='0.5'/%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        shimmer: 'shimmer 2s linear infinite',
        float: 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
