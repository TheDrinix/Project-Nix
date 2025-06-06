// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    'nuxt-auth-utils',
    '@nuxt/ui',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxt/image',
  ],
  runtimeConfig: {
    botToken: '',
    apiKey: '',
    oauthDiscordClientId: '',
    oauthDiscordClientSecret: '',
  },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'Nix Dashboard'
    }
  },
})