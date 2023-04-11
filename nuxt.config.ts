import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  css: [
    '~/assets/css/util.css', '~/assets/css/transitions.css',
    '~/assets/css/styles.css', '~/assets/css/scroll.css'],
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/color-mode', '@kevinmarrec/nuxt-pwa'],
  typescript: {
      shim: false,
      tsConfig: {
        compilerOptions: {
          types: [ "@types/wicg-file-system-access"]
         }
      }
  },
  colorMode: {
    classSuffix: '',
    fallback: 'dark',
  },
  experimental: {
    payloadExtraction: false,
  },
  app: {
    baseURL: '/playmytime/',
    head: {
      title: 'Play My Time',
    },
    pageTransition: {
      name: 'fade', 
      mode: 'out-in'
    },
    layoutTransition: {
      name: 'fade',
      mode: 'out-in'
    },
  },
  pwa: {
    icon: {
      fileName: 'icon.svg',
    },
    manifest: {
      short_name: 'PMT',
      name: 'Play My Time',
    }
  },
  vite: {
    plugins: [
      nodePolyfills({
        // Whether to polyfill `node:` protocol imports.
        protocolImports: true,
      }),
    ]
  }
})
