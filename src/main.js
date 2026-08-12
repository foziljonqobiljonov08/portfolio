// main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'

// SCSS faylingizni ulaymiz
import './assets/sass/main.scss'

import AOS from 'aos'
import 'aos/dist/aos.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// router.isReady() - router birinchi navigatsiyani tugatgandan (va shu bilan
// birga dastlabki route komponenti DOM'ga to'liq mount bo'lgandan) keyin hal
// bo'ladi. Shundan keyin AOS.init() chaqirilsa, u DOM'ni skanerlaganda barcha
// [data-aos] elementlar allaqachon joyida bo'ladi. app.mount()ni ham shu yerda
// chaqiramiz - bu "sovuq boshlanishda" (masalan npm run dev ni birinchi marta
// ishga tushirganda) ba'zi elementlar ko'rinmay qolish xavfini kamaytiradi.
router.isReady().then(() => {
  app.mount('#app')

  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 80,
    disable: false,
  })

  // Har safar sahifa (route) almashganda AOS elementlarni qayta hisoblaymiz,
  // aks holda yangi mount bo'lgan data-aos elementlar "ko'rinmaydi".
  // Ikki marta chaqiramiz: darhol (DOM allaqachon tayyor bo'lsa) va animatsiya
  // tugagandan keyin (page-transition 0.42s) - qaysi biri ishlasa shu yetarli.
  router.afterEach(() => {
    AOS.refreshHard()
    window.setTimeout(() => {
      AOS.refreshHard()
    }, 460)
  })
})
