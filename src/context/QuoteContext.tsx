/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useReducer, type Dispatch, type ReactNode } from 'react'
import { serviceMap } from '../data/services'
import { getDefaultOptions } from '../data/serviceOptions'
import { createEmptyQuote } from '../lib/quoteFactory'
import { randomId } from '../lib/quoteNumber'
import { calculatePricing } from '../lib/pricingEngine'
import { quoteRepository } from '../repositories/quoteRepository'
import type { CustomerInfo, OptionValue, PriceMode, PricingResult, Quote, SelectedService } from '../types'

type QuoteAction =
  | { type: 'LOAD'; quote: Quote }
  | { type: 'SET_CUSTOMER'; field: keyof CustomerInfo; value: string }
  | { type: 'SET_PRICE_MODE'; value: PriceMode }
  | { type: 'SET_INTERNAL_VISIBILITY'; value: boolean }
  | { type: 'ADD_SERVICE'; serviceId: string }
  | { type: 'REMOVE_SERVICE'; selectionId: string }
  | { type: 'CLEAR_SERVICES' }
  | { type: 'UPDATE_QUANTITY'; selectionId: string; value: number }
  | { type: 'UPDATE_CUSTOM_PRICE'; selectionId: string; value: number }
  | { type: 'UPDATE_OPTION'; selectionId: string; optionId: string; value: OptionValue }
  | { type: 'SET_DISCOUNT'; rate: number; amount: number }
  | { type: 'RESET' }

const touch = (quote: Quote): Quote => ({ ...quote, updatedAt: new Date().toISOString() })

const reducer = (state: Quote, action: QuoteAction): Quote => {
  switch (action.type) {
    case 'LOAD':
      return structuredClone(action.quote)
    case 'SET_CUSTOMER':
      return touch({ ...state, customer: { ...state.customer, [action.field]: action.value } })
    case 'SET_PRICE_MODE':
      return touch({ ...state, priceMode: action.value })
    case 'SET_INTERNAL_VISIBILITY':
      return touch({ ...state, showInternalInfo: action.value })
    case 'ADD_SERVICE': {
      if (state.selections.some((selection) => selection.serviceId === action.serviceId)) return state
      const service = serviceMap.get(action.serviceId)
      if (!service) return state
      const selection: SelectedService = {
        id: randomId(),
        serviceId: service.id,
        quantity: service.minimumQuantity,
        customPrice: 0,
        options: getDefaultOptions(service.optionGroup),
      }
      quoteRepository.addRecentService(service.id)
      return touch({ ...state, selections: [...state.selections, selection] })
    }
    case 'REMOVE_SERVICE':
      return touch({ ...state, selections: state.selections.filter((selection) => selection.id !== action.selectionId) })
    case 'CLEAR_SERVICES':
      return touch({ ...state, selections: [] })
    case 'UPDATE_QUANTITY':
      return touch({
        ...state,
        selections: state.selections.map((selection) =>
          selection.id === action.selectionId ? { ...selection, quantity: Math.max(1, action.value) } : selection,
        ),
      })
    case 'UPDATE_CUSTOM_PRICE':
      return touch({
        ...state,
        selections: state.selections.map((selection) =>
          selection.id === action.selectionId ? { ...selection, customPrice: Math.max(0, action.value) } : selection,
        ),
      })
    case 'UPDATE_OPTION':
      return touch({
        ...state,
        selections: state.selections.map((selection) =>
          selection.id === action.selectionId
            ? { ...selection, options: { ...selection.options, [action.optionId]: action.value } }
            : selection,
        ),
      })
    case 'SET_DISCOUNT':
      return touch({ ...state, discountRate: action.rate, discountAmount: action.amount })
    case 'RESET':
      return createEmptyQuote()
  }
}

interface QuoteContextValue {
  quote: Quote
  pricing: PricingResult
  dispatch: Dispatch<QuoteAction>
  save: () => Quote
  load: (quote: Quote) => void
}

const QuoteContext = createContext<QuoteContextValue | null>(null)

export const QuoteProvider = ({ children }: { children: ReactNode }) => {
  const [quote, dispatch] = useReducer(reducer, undefined, () => quoteRepository.getDraft() ?? createEmptyQuote())
  const pricing = useMemo(() => calculatePricing(quote), [quote])

  useEffect(() => {
    const timeout = window.setTimeout(() => quoteRepository.saveDraft(quote), 250)
    return () => window.clearTimeout(timeout)
  }, [quote])

  const value = useMemo<QuoteContextValue>(
    () => ({
      quote,
      pricing,
      dispatch,
      save: () => quoteRepository.save(quote),
      load: (nextQuote) => dispatch({ type: 'LOAD', quote: nextQuote }),
    }),
    [pricing, quote],
  )

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>
}

export const useQuote = () => {
  const context = useContext(QuoteContext)
  if (!context) throw new Error('useQuote must be used within QuoteProvider')
  return context
}
