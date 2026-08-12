<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const isMenuOpen = ref(false)
const route = useRoute()

const closeMenu = () => {
  isMenuOpen.value = false
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

watch(() => route.fullPath, closeMenu)

const navItems = [
  { to: '/', label: 'Главная', icon: 'home' },
  { to: '/about', label: 'Обо мне', icon: 'user' },
  { to: '/projects', label: 'Проекты', icon: 'grid' },
  { to: '/contact', label: 'Контакты', icon: 'mail' },
]
</script>

<template>
  <button
    class="menu-toggle"
    :class="{ 'menu-toggle--open': isMenuOpen }"
    type="button"
    :aria-expanded="isMenuOpen"
    aria-label="Открыть меню"
    @click="toggleMenu"
  >
    <span></span>
    <span></span>
    <span></span>
  </button>

  <Transition name="sidebar-backdrop">
    <div v-if="isMenuOpen" class="sidebar-backdrop" @click="closeMenu"></div>
  </Transition>

  <aside class="sidebar" :class="{ 'sidebar--open': isMenuOpen }">
    <router-link to="/" class="brand" aria-label="Портфолио Фозила" @click="closeMenu">
      <span class="brand__mark">F</span>
      <span class="brand__text">Fozil<span>.dev</span></span>
    </router-link>

    <nav class="sidebar__nav" aria-label="Основная навигация">
      <router-link
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="nav-link"
        exact-active-class="active"
        @click="closeMenu"
      >
        <span class="nav-link__icon" aria-hidden="true">
          <svg v-if="item.icon === 'home'" viewBox="0 0 24 24" fill="none"><path d="M4 11.5 12 4l8 7.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 10v9a1 1 0 0 0 1 1h3.5v-5.5a1.5 1.5 0 0 1 1.5-1.5h0a1.5 1.5 0 0 1 1.5 1.5V20H17a1 1 0 0 0 1-1v-9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <svg v-else-if="item.icon === 'user'" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.4" stroke="currentColor" stroke-width="1.8"/><path d="M5 20c1.2-3.6 4-5.4 7-5.4s5.8 1.8 7 5.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          <svg v-else-if="item.icon === 'grid'" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8"/><rect x="13" y="4" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8"/><rect x="4" y="13" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8"/><rect x="13" y="13" width="7" height="7" rx="1.6" stroke="currentColor" stroke-width="1.8"/></svg>
          <svg v-else-if="item.icon === 'mail'" viewBox="0 0 24 24" fill="none"><rect x="3.5" y="5.5" width="17" height="13" rx="2.2" stroke="currentColor" stroke-width="1.8"/><path d="m4.5 7 7.5 6 7.5-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
        <span class="nav-link__text">{{ item.label }}</span>
      </router-link>
    </nav>

    <router-link to="/contact" class="sidebar__cta" @click="closeMenu">
      <span>Обсудить проект</span>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h13.5M13 6.5 18.5 12 13 17.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </router-link>
  </aside>
</template>
