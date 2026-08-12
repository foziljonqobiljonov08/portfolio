<script setup>
import { reactive, ref } from 'vue'

const form = reactive({
  name: '',
  email: '',
  message: '',
})

const status = ref('idle') // idle | sending | sent | error
const errorMsg = ref('')

// .env faylidan olinadi (VITE_ prefiksi bilan boshlangan o'zgaruvchilarni
// Vite avtomatik ravishda frontend kodiga qo'shadi)
const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN
const CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID

// Telegram MarkdownV2 uchun maxsus belgilarni ekranlash
const escapeMarkdown = (text) => text.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, '\\$&')

const handleSubmit = async () => {
  errorMsg.value = ''

  if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
    status.value = 'error'
    errorMsg.value = 'Пожалуйста, заполните все поля.'
    return
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(form.email)) {
    status.value = 'error'
    errorMsg.value = 'Проверьте корректность email.'
    return
  }

  if (!BOT_TOKEN || !CHAT_ID) {
    status.value = 'error'
    errorMsg.value = 'Форма не настроена. Свяжитесь со мной по email.'
    console.error('VITE_TELEGRAM_BOT_TOKEN yoki VITE_TELEGRAM_CHAT_ID .env faylida topilmadi')
    return
  }

  status.value = 'sending'

  const text =
    `📩 *Yangi xabar — Portfolio*\n\n` +
    `*Ism:* ${escapeMarkdown(form.name.trim())}\n` +
    `*Email:* ${escapeMarkdown(form.email.trim())}\n` +
    `*Xabar:*\n${escapeMarkdown(form.message.trim())}`

  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: 'MarkdownV2',
      }),
    })

    const result = await response.json()
    if (!response.ok || !result.ok) {
      throw new Error('telegram-request-failed')
    }

    status.value = 'sent'
    form.name = ''
    form.email = ''
    form.message = ''

    window.setTimeout(() => {
      status.value = 'idle'
    }, 4200)
  } catch {
    status.value = 'error'
    errorMsg.value = 'Не удалось отправить сообщение. Попробуйте позже или напишите на почту.'
  }
}
</script>

<template>
  <section class="contact section">
    <div class="container contact__grid">
      <div class="section-copy" data-aos="fade-right">
        <div class="eyebrow"><span></span> Контакты</div>
        <h1 class="section-title">Нужен аккуратный сайт или frontend-интерфейс?</h1>
        <p class="section-text">
          Напишите мне детали проекта: какие страницы нужны, какой стиль нравится и какие функции должны работать.
        </p>
        <div class="contact__list">
          <a href="mailto:fqobiljonov810@gmail.com">fqobiljonov810@gmail.com</a>
          <a href="https://t.me/visioncraftitgroup" target="_blank" rel="noopener noreferrer">+998974540023</a>
        </div>
      </div>

      <form class="contact-card" data-aos="fade-left" @submit.prevent="handleSubmit">
        <label>
          <span>Имя</span>
          <input v-model="form.name" type="text" placeholder="Введите имя" :disabled="status === 'sending'" />
        </label>
        <label>
          <span>Email</span>
          <input v-model="form.email" type="email" placeholder="example@gmail.com" :disabled="status === 'sending'" />
        </label>
        <label>
          <span>Сообщение</span>
          <textarea v-model="form.message" rows="5" placeholder="Коротко опишите задачу" :disabled="status === 'sending'"></textarea>
        </label>

        <button class="btn btn--primary form-submit" type="submit" :class="{ 'form-submit--sending': status === 'sending' }" :disabled="status === 'sending'">
          <span v-if="status === 'sending'" class="form-spinner" aria-hidden="true"></span>
          <span>{{ status === 'sending' ? 'Отправка...' : 'Отправить' }}</span>
        </button>

        <Transition name="form-feedback">
          <p v-if="status === 'sent'" class="form-feedback form-feedback--ok" role="status">
            ✓ Сообщение отправлено. Отвечу в ближайшее время.
          </p>
          <p v-else-if="status === 'error'" class="form-feedback form-feedback--error" role="alert">
            {{ errorMsg }}
          </p>
        </Transition>
      </form>
    </div>
  </section>
</template>
