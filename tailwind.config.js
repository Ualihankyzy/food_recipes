module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
  ],
  theme: { extend: {} },
  plugins: [],
}
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'slide-up': 'slideUp 1s cubic-bezier(0.25,0.46,0.45,0.94) forwards',
        'scale-in': 'scaleIn 1.2s cubic-bezier(0.25,0.46,0.45,0.94) forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(40px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: 0, transform: 'scale(0.9) translateY(60px)' },
          '100%': { opacity: 1, transform: 'scale(1) translateY(0)' },
        }
      }
    }
  }
}
