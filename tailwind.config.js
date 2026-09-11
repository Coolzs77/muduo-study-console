/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serifMono: ['"Courier Prime"', '"Noto Serif SC"', '"Songti SC"', '"STSong"', 'SimSun', 'serif', 'monospace'],
        serifHeading: ['"Noto Serif SC"', '"Songti SC"', 'STSong', 'Georgia', 'serif']
      },
      colors: {
        parchment: {
          50: '#faf9f6',
          100: '#f4efe6',
          200: '#e8ded0',
          800: '#3d342a',
          900: '#231d16'
        },
        oxford: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          500: '#1e40af',
          600: '#0369a1',
          700: '#075985',
          800: '#0c4a6e',
          900: '#082f49'
        }
      }
    },
  },
  plugins: [],
}
