import store from '@/store'
// import ru from '../src/locales/ru.json'
import es from '../src/locales/es.json'
import en from '../src/locales/en.json'

const locales = {
  // 'ru-RU': ru,
  'es-ES': es,
  'en-US': en
}

export default function localizeFilter (key) {
  const locale = store.getters.info.locale || 'es-ES'
  return locales[locale][key] || `[Localize error]: key ${key} not found`
}
