<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import Nav from './components/Nav/Nav.vue'

const bootLines = [
  { label: 'npm run portfolio', status: 'executing' },
  { label: 'запускаю премиальную UI-систему', status: 'ok' },
  { label: 'монтирую Vue-компоненты', status: 'ok' },
  { label: 'загружаю проекты и навыки', status: 'ok' },
  { label: 'оптимизирую адаптивный дизайн', status: 'ok' },
  { label: 'Готово.', status: 'ready' },
]

const visibleLines = ref(0)
const isIntroDone = ref(false)
const scrollProgress = ref(0)

const progressWidth = computed(() => `${Math.min((visibleLines.value / bootLines.length) * 100, 100)}%`)

const updateScrollProgress = () => {
  const pageHeight = document.documentElement.scrollHeight - window.innerHeight
  scrollProgress.value = pageHeight > 0 ? Math.min((window.scrollY / pageHeight) * 100, 100) : 0
}

onMounted(() => {
  updateScrollProgress()
  window.addEventListener('scroll', updateScrollProgress, { passive: true })
  window.addEventListener('resize', updateScrollProgress)

  bootLines.forEach((_, index) => {
    window.setTimeout(() => {
      visibleLines.value = index + 1
    }, 360 + index * 430)
  })

  window.setTimeout(() => {
    isIntroDone.value = true
  }, 3450)
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateScrollProgress)
  window.removeEventListener('resize', updateScrollProgress)
})
</script>

<template>
  <Transition name="intro-fade">
    <section v-if="!isIntroDone" class="boot-screen" aria-label="Анимация загрузки портфолио">
      <div class="boot-screen__grid"></div>
      <div class="boot-screen__glow boot-screen__glow--one"></div>
      <div class="boot-screen__glow boot-screen__glow--two"></div>

      <div class="boot-terminal">
        <div class="boot-terminal__top">
          <div class="boot-terminal__dots" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p>fozil.dev / запуск</p>
        </div>

        <div class="boot-terminal__body">
          <p class="boot-terminal__kicker">Система портфолио</p>
          <h1>Собираю чистый интерфейс...</h1>

          <div class="boot-terminal__lines">
            <TransitionGroup name="line-reveal">
              <p
                v-for="(line, index) in bootLines.slice(0, visibleLines)"
                :key="line.label"
                :class="['boot-line', `boot-line--${line.status}`]"
              >
                <span class="boot-line__prefix">{{ index === 0 ? '>' : '→' }}</span>
                <span class="boot-line__text">{{ line.label }}</span>
                <span v-if="line.status === 'ok'" class="boot-line__status">OK</span>
                <span v-if="line.status === 'ready'" class="boot-line__status">LIVE</span>
              </p>
            </TransitionGroup>
          </div>

          <div class="boot-progress" aria-hidden="true">
            <span :style="{ width: progressWidth }"></span>
          </div>
        </div>
      </div>
    </section>
  </Transition>

  <div class="scroll-progress" aria-hidden="true">
    <span :style="{ width: scrollProgress + '%' }"></span>
  </div>

  <div class="scroll-orb" :style="{ transform: `translate3d(0, ${scrollProgress * 3.2}px, 0)` }" aria-hidden="true"></div>

  <Nav />

  <div :class="['app-shell', { 'app-shell--ready': isIntroDone }]">
    <main class="page-shell">
      <router-view v-slot="{ Component, route }">
        <Transition name="page">
          <component :is="Component" :key="route.path" />
        </Transition>
      </router-view>
    </main>
  </div>
</template>
