export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'  // ← БҰЛ ЖОЛ МІНДЕТТІ!
  ],
  build: {
    transpile: ['@heroicons/vue']
  },
  // pinia секциясы МҮЛДЕ ҚАЖЕТ ЕМЕС, @pinia/nuxt автоматты табады
})
