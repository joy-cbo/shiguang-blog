     1|export default defineNuxtConfig({
     2|  compatibilityDate: '2025-05-15',
     3|  devtools: { enabled: false },
     4|
     5|  nitro: {
     6|    preset: 'cloudflare-pages',
     7|    routeRules: {
     8|      '/api/cover/**': {
     9|        headers: {
    10|          'Content-Type': 'image/svg+xml',
    11|          'Cache-Control': 'public, max-age=86400',
    12|          'X-Frame-Options': 'SAMEORIGIN',
    13|        },
    14|      },
    15|      '/api/**': {
    16|        headers: {
    17|          'X-Content-Type-Options': 'nosniff',
    18|          'X-Frame-Options': 'DENY',
    19|          'Referrer-Policy': 'strict-origin-when-cross-origin',
    20|        },
    21|      },
    22|    },
    23|  },
    24|
    25|  modules: ['@nuxtjs/tailwindcss'],
    26|
    27|  css: ['~/assets/css/main.css'],
    28|
    29|  typescript: {
    30|    strict: true,
    31|  },
    32|})
    33|