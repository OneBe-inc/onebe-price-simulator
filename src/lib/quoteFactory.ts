import type { Quote } from '../types'
import { addDays, toLocalDateInput } from './date'
import { generateQuoteNumber, randomId } from './quoteNumber'

export const createEmptyQuote = (): Quote => {
  const now = new Date()
  const timestamp = now.toISOString()
  return {
    id: randomId(),
    quoteNumber: generateQuoteNumber(now),
    priceMode: 'internal',
    showInternalInfo: true,
    customer: {
      companyName: '',
      contactName: '',
      projectName: '',
      quoteDate: toLocalDateInput(now),
      validUntil: toLocalDateInput(addDays(now, 30)),
      notes: '',
    },
    selections: [],
    discountRate: 0,
    discountAmount: 0,
    createdAt: timestamp,
    updatedAt: timestamp,
  }
}

export const cloneQuote = (source: Quote): Quote => {
  const now = new Date()
  const timestamp = now.toISOString()
  return {
    ...structuredClone(source),
    id: randomId(),
    quoteNumber: generateQuoteNumber(now),
    customer: {
      ...source.customer,
      quoteDate: toLocalDateInput(now),
      validUntil: toLocalDateInput(addDays(now, 30)),
    },
    createdAt: timestamp,
    updatedAt: timestamp,
  }
}
