import { toLocalDateInput } from './date'

const SEQUENCE_KEY = 'onebe-price-simulator:quote-sequence'

export const generateQuoteNumber = (date = new Date()) => {
  const compactDate = toLocalDateInput(date).replaceAll('-', '')
  const current = Number.parseInt(localStorage.getItem(SEQUENCE_KEY) ?? '0', 10)
  const sequence = Number.isFinite(current) ? current + 1 : 1
  localStorage.setItem(SEQUENCE_KEY, String(sequence))
  return `QT-${compactDate.slice(0, 4)}-${compactDate.slice(4)}-${String(sequence).padStart(3, '0')}`
}

export const randomId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
