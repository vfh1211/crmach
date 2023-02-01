import store from '@/store'

function isValid (value) {
  if (!value) return false
  if (isNaN(Date.parse(value))) return false
  return true
}
export default function dataFilter (value, format = 'date') {
  if (!isValid(value)) return value
  const options = {}
  if (format.includes('date')) {
    options.day = '2-digit'
    options.month = 'long'
    options.year = 'numeric'
  }
  if (format.includes('time')) {
    options.hour = '2-digit'
    options.minute = '2-digit'
    options.second = '2-digit'
  }
  const locale = store.getters.info.locale || format.split('-')[0]
  try {
    return new Intl.DateTimeFormat(locale, options).format(new Date(value))
  } catch (error) {
    console.error(error)
    // You can decide if you want to return a default date, the original value or show a message to the user.
  }
}
