export default function currencyFilter (value, currency = 'CRC') {
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    maximumFractionDigits: 0,
    roundingIncrement: 5
  }).format(value)
}
