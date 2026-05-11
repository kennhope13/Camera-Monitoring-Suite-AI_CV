import { createI18n } from 'vue-i18n'
import en from './locales/en'
import vi from './locales/vi'

const i18n = createI18n({
  legacy: false, // Set to false to use Composition API
  locale: localStorage.getItem('lang') || 'vi',
  fallbackLocale: 'en',
  messages: {
    en,
    vi
  }
})

export default i18n
