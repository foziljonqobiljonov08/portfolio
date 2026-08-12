import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  optimizeDeps: {
    // Birinchi marta "npm run dev" ishga tushganda Vite shu paketlarni
    // oldindan bundle qiladi. Bu ro'yxatsiz, ba'zi paketlar (masalan aos)
    // birinchi so'rov paytida "hali tayyor emas" holatda qolib, browser
    // xato/bo'sh sahifa ko'rsatishi va faqat serverni qayta ishga tushirgandan
    // keyin to'g'ri ishlashi mumkin edi.
    include: ['vue', 'vue-router', 'pinia', 'aos'],
  },
})
