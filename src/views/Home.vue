<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import About from './About.vue'
import Projects from './Projects.vue'
import heroPhoto from '../assets/img/hero-photo.jpg'

const heroProgress = ref(0)
const heroSection = ref(null)
const isPhotoActive = ref(false)

// Rasm bosilganda ma'lumot panelini ochish/yopish
const togglePhotoInfo = () => {
  isPhotoActive.value = !isPhotoActive.value
}

let ticking = false

const computeHero = () => {
  if (!heroSection.value) {
    ticking = false
    return
  }
  const rect = heroSection.value.getBoundingClientRect()
  const viewportH = window.innerHeight || 1
  // 0 -> hero to'liq ko'rinishda (yuqorida), 1 -> hero butunlay yuqoriga chiqib ketgan (scroll tugagan)
  const progress = Math.min(Math.max(-rect.top / (rect.height || viewportH), 0), 1)
  heroProgress.value = progress
  ticking = false
}

const requestHeroUpdate = () => {
  if (ticking) return
  ticking = true
  window.requestAnimationFrame(computeHero)
}

onMounted(() => {
  computeHero()
  window.addEventListener('scroll', requestHeroUpdate, { passive: true })
  window.addEventListener('resize', requestHeroUpdate)
})

onUnmounted(() => {
  window.removeEventListener('scroll', requestHeroUpdate)
  window.removeEventListener('resize', requestHeroUpdate)
})
</script>

<template>
  <section class="hero section" ref="heroSection">
    <div class="hero__ambient" :style="{ backgroundImage: `url(${heroPhoto})` }" aria-hidden="true"></div>
    <div class="hero__ambient-veil" aria-hidden="true"></div>
    <div class="orb orb--one"></div>
    <div class="orb orb--two"></div>

    <div class="container hero__grid">
      <div
        class="hero__content"
        data-aos="fade-up"
        :style="{
          opacity: Math.max(1 - heroProgress * 1.6, 0),
          transform: `translateY(${-heroProgress * 36}px)`,
        }"
      >
        <div class="status-badge" aria-label="Доступен для проектов">
          <i></i>
          <span>Доступен для проектов</span>
        </div>
        <div class="eyebrow"><span></span> Frontend-разработчик • Vue.js</div>
        <div class="hero__badge-row" aria-label="Преимущества дизайна">
          <span>Премиальный UI</span>
          <span>Чистый код</span>
          <span>Адаптивность</span>
        </div>
        <h1 class="hero__title">
          Создаю <span>современные интерфейсы</span> для реальных digital-продуктов.
        </h1>
        <p class="hero__lead">
          Привет, я Фозил. Разрабатываю аккуратные сайты, CRM-панели и dashboard-интерфейсы с сильной визуальной системой, быстрым UX и вниманием к деталям.
        </p>

        <div class="hero__actions">
          <router-link to="/projects" class="btn btn--primary"><span>Смотреть проекты</span></router-link>
          <router-link to="/contact" class="btn btn--ghost"><span>Связаться со мной</span></router-link>
        </div>

        <div class="hero__stats" aria-label="Ключевые показатели портфолио">
          <div><strong>12+</strong><span>UI-секций</span></div>
          <div><strong>Vue</strong><span>Основной стек</span></div>
          <div><strong>320px</strong><span>Mobile ready</span></div>
        </div>
      </div>

      <div
        class="hero__photo-card"
        :class="{ 'hero__photo-card--active': isPhotoActive }"
        data-aos="fade-left"
        role="button"
        tabindex="0"
        :aria-pressed="isPhotoActive"
        aria-label="Показать информацию обо мне"
        @click="togglePhotoInfo"
        @keydown.enter="togglePhotoInfo"
        @keydown.space.prevent="togglePhotoInfo"
      >
        <div
          class="hero__photo-card-img"
          :style="{ backgroundImage: `url(${heroPhoto})` }"
        ></div>
        <div class="hero__photo-card-shade" aria-hidden="true"></div>

        <span class="hero__photo-card-hint" aria-hidden="true">{{ isPhotoActive ? 'Нажмите, чтобы скрыть' : 'Нажмите для информации' }}</span>

        <div class="hero__photo-card-info" :aria-hidden="!isPhotoActive">
          <h3>Фозил · Frontend-разработчик</h3>
          <p>Vue.js, чистый код и премиальный UI. Открыт для проектов и предложений о сотрудничестве.</p>
          <div class="hero__badge-row">
            <span>Премиальный UI</span>
            <span>Чистый код</span>
            <span>Адаптивность</span>
          </div>
        </div>
      </div>
    </div>

    <div class="hero__bottom-fade" aria-hidden="true"></div>
  </section>

  <About />
  <Projects />
</template>
