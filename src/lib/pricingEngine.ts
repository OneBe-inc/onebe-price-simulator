import type { Quote } from '../types'
import { calculatePricing as calculatePricingCore } from './pricingEngineCore'

export const calculatePricing = (quote: Quote) => {
  const preliminary = calculatePricingCore({ ...quote, discountAmount: 0 })
  const discountRate = Math.min(100, Math.max(0, quote.discountRate))
  const discountAmount = Math.round(preliminary.baseSubtotal * discountRate / 100)
  return calculatePricingCore({ ...quote, discountRate, discountAmount })
}
