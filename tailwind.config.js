/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#FF5722',
          dark: '#1A1A2E',
          card: '#161626',
          success: '#4CAF50',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#FF5722',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#1A1A2E',
          foreground: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        syne: ['var(--font-syne)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
