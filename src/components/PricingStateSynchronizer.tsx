import { useEffect } from 'react'
import { useQuote } from '../context/QuoteContext'

export const PricingStateSynchronizer = () => {
  const { quote, pricing, dispatch } = useQuote()

  useEffect(() => {
    if (quote.discountAmount === pricing.discountAmount) return
    dispatch({ type: 'SET_DISCOUNT', rate: quote.discountRate, amount: pricing.discountAmount })
  }, [dispatch, pricing.discountAmount, quote.discountAmount, quote.discountRate])

  return null
}
