// Netlify Function: Contact formadan kelgan xabarni Telegram botga yuboradi.
// Bot Token va Chat ID Netlify Environment Variables orqali keladi —
// frontend kodida yoki repo'da hech qachon ko'rinmaydi.

export async function handler(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }

  // Brauzer preflight so'rovi
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID

  if (!BOT_TOKEN || !CHAT_ID) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Server konfiguratsiyasi to\u2018liq emas (env vars yo\u2018q)' }),
    }
  }

  let data
  try {
    data = JSON.parse(event.body || '{}')
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Noto\u2018g\u2018ri so\u2018rov' }) }
  }

  const name = (data.name || '').toString().trim()
  const email = (data.email || '').toString().trim()
  const message = (data.message || '').toString().trim()

  // Serverda ham tekshiramiz — frontend validatsiyasiga ishonib bo'lmaydi
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!name || !email || !message) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Barcha maydonlar to\u2018ldirilishi kerak' }) }
  }
  if (!emailPattern.test(email)) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Email noto\u2018g\u2018ri' }) }
  }
  if (name.length > 100 || email.length > 100 || message.length > 2000) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Matn juda uzun' }) }
  }

  // Telegram Markdown maxsus belgilarini ekranlaymiz
  const esc = (s) => s.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, '\\$&')

  const text =
    `📩 *Yangi xabar — Portfolio*\n\n` +
    `*Ism:* ${esc(name)}\n` +
    `*Email:* ${esc(email)}\n` +
    `*Xabar:*\n${esc(message)}`

  try {
    const tgResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: 'MarkdownV2',
      }),
    })

    const tgResult = await tgResponse.json()

    if (!tgResponse.ok || !tgResult.ok) {
      console.error('Telegram API error:', tgResult)
      return { statusCode: 502, headers, body: JSON.stringify({ error: 'Telegramga yuborib bo\u2018lmadi' }) }
    }

    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) }
  } catch (err) {
    console.error('send-message error:', err)
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Kutilmagan xatolik' }) }
  }
}
