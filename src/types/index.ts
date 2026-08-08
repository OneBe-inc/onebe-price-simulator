export type ServiceCategory =
  | 'brand'
  | 'web'
  | 'dtp'
  | 'marketing'
  | 'line-sns'
  | 'content'
  | 'consulting'
  | 'other'

export type PricingType = 'fixed' | 'perUnit' | 'perPage' | 'monthly' | 'hourly' | 'custom'
export type PriceStatus = 'provisional' | 'custom'
export type PriceMode = 'internal' | 'agency'
export type Urgency = 'normal' | 'rush' | 'express'
export type OptionGroup = 'web' | 'dtp' | 'posting' | 'line' | 'consulting' | 'generic'

export interface Service {
  id: string
  category: ServiceCategory
  name: string
  shortDescription: string
  description: string
  icon: string
  pricingType: PricingType
  basePrice: number | null
  unit: string
  minimumQuantity: number
  recommended: boolean
  availableOptions: string[]
  estimatedDuration: string
  internalCost: number | null
  agencyRate: number
  active: boolean
  notes: string
  priceStatus: PriceStatus
  optionGroup: OptionGroup
}

export type OptionValue = string | number | boolean

export interface SelectedService {
  id: string
  serviceId: string
  quantity: number
  customPrice: number
  options: Record<string, OptionValue>
}

export interface CustomerInfo {
  companyName: string
  contactName: string
  projectName: string
  quoteDate: string
  validUntil: string
  notes: string
}

export interface Quote {
  id: string
  quoteNumber: string
  priceMode: PriceMode
  showInternalInfo: boolean
  customer: CustomerInfo
  selections: SelectedService[]
  discountRate: number
  discountAmount: number
  createdAt: string
  updatedAt: string
}

export interface PriceLine {
  selectionId: string
  serviceId: string
  name: string
  specification: string
  quantity: number
  quantityLabel: string
  unitPrice: number
  subtotal: number
  internalCost: number
  priceStatus: PriceStatus
  requiresQuote: boolean
}

export interface PricingResult {
  lines: PriceLine[]
  baseSubtotal: number
  discountRate: number
  discountAmount: number
  discountedSubtotal: number
  agencyRate: number
  agencyWholesale: number
  customerPrice: number
  agencyMargin: number
  taxableSubtotal: number
  taxRate: number
  taxAmount: number
  total: number
  internalCost: number
  grossProfit: number
  grossMarginRate: number
  hasPendingPrice: boolean
}

export interface OptionChoice {
  label: string
  value: string | number | boolean
}

export interface ServiceOptionDefinition {
  id: string
  label: string
  type: 'number' | 'select' | 'toggle' | 'text'
  defaultValue: OptionValue
  suffix?: string
  min?: number
  max?: number
  step?: number
  choices?: OptionChoice[]
  hint?: string
}

export interface UiSettings {
  category: ServiceCategory | 'all'
  sort: 'recommended' | 'price-asc' | 'name'
  compact: boolean
}
