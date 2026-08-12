<script setup>
import { reactive } from 'vue'
import illustrationCrm from '@/assets/img/illustration-crm.svg'
import illustrationAuth from '@/assets/img/illustration-auth.svg'
import illustrationCoffee from '@/assets/img/illustration-coffee.svg'

// Faqat yorug'lik-spotlight uchun sichqoncha holatini kuzatamiz.
// DIQQAT: bu karta yoki mockup rasmini HECH QACHON harakatlantirmaydi/kattalashtirmaydi —
// faqat orqa fondagi radial-gradient pozitsiyasini o'zgartiradi.
const handleCardMove = (event) => {
  if (window.matchMedia('(pointer: coarse)').matches) return

  const card = event.currentTarget
  const rect = card.getBoundingClientRect()
  const px = (event.clientX - rect.left) / rect.width
  const py = (event.clientY - rect.top) / rect.height

  card.style.setProperty('--mx', `${px * 100}%`)
  card.style.setProperty('--my', `${py * 100}%`)
}

// Sensorli ekranlar uchun: birinchi tap overlay'ni ochadi, tugma esa alohida ishlaydi.
const activeCards = reactive(new Set())

const handleCardTap = (event, index) => {
  if (!window.matchMedia('(pointer: coarse)').matches) return
  // Agar bosilgan joy "Подробнее" tugmasi bo'lsa - havolaga o'tishga to'sqinlik qilmaymiz
  if (event.target.closest('.project-card__actions')) return

  if (!activeCards.has(index)) {
    event.preventDefault()
    activeCards.add(index)
  }
}

const projects = [
  {
    title: 'Школьная CRM система',
    description: 'Современная CRM-платформа для школ, которая объединяет администрацию, учителей и учеников в единую цифровую экосистему. Управление расписанием, контроль посещаемости и аналитика успеваемости.',
    stack: ['Vue 3', 'SCSS', 'Dashboard UI'],
    meta: 'Премиум dashboard',
    link: 'https://maktab-crm.netlify.app/',
    image: illustrationCrm,
  },
  {
    title: 'Operator Panel для Al Aziz Academy',
    description: 'Удобная система для операторов учебного центра: обработка заявок, управление клиентской базой и отслеживание статуса обращений в режиме реального времени.',
    stack: ['Vue', 'Animation', 'Auth UI'],
    meta: 'Auth-интерфейс',
    link: 'https://azizacademyoperators.netlify.app/login',
    image: illustrationAuth,
  },
  {
    title: 'Aroma Coffee — Online Store',
    description: 'Интернет-магазин для кофейни: витрина меню, карточки товаров, привлекательный UI и адаптивная вёрстка для комфортного заказа с любого устройства.',
    stack: ['Vue 3', 'SCSS', 'E-commerce UI'],
    meta: 'Coffee shop',
    link: 'https://celadon-cajeta-c7706a.netlify.app/',
    image: illustrationCoffee,
  },
]
</script>

<template>
  <section class="projects section">
    <div class="container">
      <div class="section-head" data-aos="fade-up">
        <div class="eyebrow"><span></span> Избранные работы</div>
        <h2 class="section-title">Проекты, которые выглядят как реальный продукт.</h2>
        <p class="section-text">Наведите курсор на карточку (или нажмите на телефоне), чтобы увидеть детали проекта.</p>
      </div>

      <div class="projects__grid">
        <article
          v-for="(project, index) in projects"
          :key="project.title"
          class="project-card"
          :class="{ 'project-card--active': activeCards.has(index) }"
          data-aos="fade-up"
          :data-aos-delay="index * 80"
          tabindex="0"
          role="group"
          :aria-label="`Проект: ${project.title}`"
          @mousemove="handleCardMove"
          @click="handleCardTap($event, index)"
        >
          <!-- "Rasm" - hech qachon qimirlamaydi/kattalashmaydi -->
          <div class="project-card__mockup">
            <div class="mockup__top"><i></i><i></i><i></i><span>{{ project.meta }}</span></div>
            <div class="mockup__illustration">
              <img :src="project.image" :alt="project.title" loading="lazy" />
            </div>
          </div>

          <span class="project-card__tap-hint" aria-hidden="true">Нажмите для деталей</span>

          <!-- Overlay: hover/focus/tap orqali ochiladi, opacity bilan (layout siljimaydi) -->
          <div class="project-card__overlay">
            <div class="project-card__overlay-inner">
              <h3>{{ project.title }}</h3>
              <p>{{ project.description }}</p>

              <ul class="project-card__tags" aria-label="Используемые технологии">
                <li v-for="tag in project.stack" :key="tag"><span>{{ tag }}</span></li>
              </ul>

              <div class="project-card__actions">
                <a
                  :href="project.link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn btn--primary"
                  :aria-label="`Открыть проект: ${project.title}`"
                >
                  <span>Подробнее ↗</span>
                </a>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
