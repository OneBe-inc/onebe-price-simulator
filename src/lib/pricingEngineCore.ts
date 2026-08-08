import { pricingConfig } from '../config/pricingConfig'
import { serviceMap } from '../data/services'
import type { OptionValue, PriceLine, PricingResult, Quote, SelectedService, Service, Urgency } from '../types'
import { calculateTax } from './tax'

const numberOption = (options: Record<string, OptionValue>, key: string, fallback = 0) => {
  const value = Number(options[key])
  return Number.isFinite(value) ? value : fallback
}

const stringOption = (options: Record<string, OptionValue>, key: string, fallback = '') => {
  const value = options[key]
  return typeof value === 'string' ? value : fallback
}

const booleanOption = (options: Record<string, OptionValue>, key: string) => options[key] === true
const round = (value: number) => Math.max(0, Math.round(value))

const urgencyLabel: Record<Urgency, string> = {
  normal: '通常納期',
  rush: '短納期',
  express: '特急',
}

const calculateWeb = (base: number, selection: SelectedService) => {
  const options = selection.options
  const pages = Math.max(1, numberOption(options, 'pages', 3))
  const revisions = Math.max(0, numberOption(options, 'revisions', 3))
  const copywriting = stringOption(options, 'copywriting', 'none')
  let subtotal = base
  subtotal += Math.max(0, pages - pricingConfig.web.includedPages) * pricingConfig.web.additionalPagePrice
  if (stringOption(options, 'designLevel') === 'premium') subtotal += pricingConfig.web.premiumDesign
  if (booleanOption(options, 'cms')) subtotal += pricingConfig.web.cms
  if (copywriting === 'partial') subtotal += Math.ceil(pages / 2) * pricingConfig.web.copywritingPerPage
  if (copywriting === 'full') subtotal += pages * pricingConfig.web.copywritingPerPage
  if (booleanOption(options, 'photography')) subtotal += pricingConfig.web.photography
  if (booleanOption(options, 'direction')) subtotal += pricingConfig.web.direction
  subtotal += Math.max(0, revisions - 3) * pricingConfig.web.extraRevision
  if (booleanOption(options, 'seo')) subtotal += pricingConfig.web.seo
  if (booleanOption(options, 'publish')) subtotal += pricingConfig.web.publish
  if (booleanOption(options, 'maintenance')) subtotal += pricingConfig.web.maintenanceMonthly
  const designLevel = stringOption(options, 'designLevel')
  return {
    subtotal,
    quantity: pages,
    quantityLabel: 'ページ',
    specs: [
      `${pages}ページ`,
      designLevel === 'premium' ? 'プレミアム' : designLevel === 'light' ? 'ライト' : 'スタンダード',
      booleanOption(options, 'cms') ? 'CMSあり' : 'CMSなし',
      booleanOption(options, 'responsive') ? 'レスポンシブ' : '固定幅',
    ],
  }
}

const calculateDtp = (base: number, selection: SelectedService) => {
  const options = selection.options
  const quantity = Math.max(1, selection.quantity)
  const revisions = Math.max(0, numberOption(options, 'revisions', 3))
  const proposals = Math.max(1, numberOption(options, 'proposals', 1))
  let subtotal = base
  if (stringOption(options, 'sides') === 'double') subtotal += pricingConfig.dtp.doubleSided
  subtotal += Math.max(0, proposals - 1) * pricingConfig.dtp.additionalProposal
  subtotal += Math.max(0, revisions - 3) * pricingConfig.dtp.extraRevision
  if (booleanOption(options, 'printing')) {
    subtotal += quantity * pricingConfig.dtp.provisionalPrintUnitPrice
    if (stringOption(options, 'paper') === 'premium') subtotal += quantity * pricingConfig.dtp.premiumPaperPerUnit
    if (booleanOption(options, 'processing')) subtotal += quantity * pricingConfig.dtp.processingPerUnit
  }
  if (booleanOption(options, 'delivery')) subtotal += pricingConfig.dtp.delivery
  const size = stringOption(options, 'size', 'standard')
  return {
    subtotal,
    quantity,
    quantityLabel: '部',
    specs: [
      size === 'standard' ? '標準サイズ' : size.toUpperCase(),
      stringOption(options, 'sides') === 'double' ? '両面' : '片面',
      `${quantity.toLocaleString('ja-JP')}部`,
      booleanOption(options, 'printing') ? '印刷あり' : '印刷なし',
    ],
  }
}

const calculatePosting = (selection: SelectedService) => {
  const quantity = Math.max(1, selection.quantity)
  const withPrint = stringOption(selection.options, 'printing') === 'withPrint'
  const unitPrice = withPrint ? 10 : 5
  const area = stringOption(selection.options, 'area')
  const design = booleanOption(selection.options, 'design')
  return {
    subtotal: quantity * unitPrice,
    quantity,
    quantityLabel: '枚',
    specs: [withPrint ? '印刷込み' : '配布のみ', area || 'エリア未入力', design ? 'デザイン料金要見積' : 'デザインなし'],
    requiresQuote: design,
  }
}

const calculateLine = (base: number, selection: SelectedService) => {
  const options = selection.options
  let subtotal = base
  if (booleanOption(options, 'richMenu')) subtotal += pricingConfig.line.richMenu
  if (booleanOption(options, 'scenario')) subtotal += pricingConfig.line.scenario
  if (booleanOption(options, 'tag')) subtotal += pricingConfig.line.tag
  if (booleanOption(options, 'distributionPlan')) subtotal += pricingConfig.line.distributionPlan
  if (booleanOption(options, 'monthlyOperation')) subtotal += pricingConfig.line.monthlyOperation
  subtotal += numberOption(options, 'posts') * pricingConfig.line.postUnitPrice
  return {
    subtotal,
    quantity: 1,
    quantityLabel: '式',
    specs: [
      booleanOption(options, 'initialSetup') ? '初期構築あり' : '初期構築なし',
      booleanOption(options, 'richMenu') ? 'リッチメニューあり' : 'リッチメニューなし',
      `${numberOption(options, 'posts')}本`,
    ],
  }
}

const calculateConsulting = (base: number, selection: SelectedService) => {
  const options = selection.options
  const months = Math.max(1, numberOption(options, 'months', 1))
  const meetings = Math.max(0, numberOption(options, 'meetings', 1))
  const hours = Math.max(0, numberOption(options, 'hours', 5))
  let monthly = base
  monthly += Math.max(0, meetings - 1) * pricingConfig.consulting.additionalMeeting
  monthly += Math.max(0, hours - 5) * pricingConfig.consulting.additionalHour
  if (booleanOption(options, 'additionalSupport')) monthly += pricingConfig.consulting.additionalSupport
  let subtotal = monthly * months
  if (booleanOption(options, 'deliverable')) subtotal += pricingConfig.consulting.deliverable
  return {
    subtotal,
    quantity: months,
    quantityLabel: 'か月',
    specs: [`${months}か月`, `月${meetings}回MTG`, `月${hours}時間`],
  }
}

const calculateGeneric = (base: number, selection: SelectedService, service: Service) => {
  const quantity = Math.max(1, selection.quantity)
  const recurring = service.pricingType === 'monthly' || service.pricingType === 'hourly'
  return {
    subtotal: recurring ? base * quantity : base,
    quantity,
    quantityLabel: service.unit,
    specs: [stringOption(selection.options, 'scope') || '仕様要確認'],
  }
}

const calculateLinePrice = (selection: SelectedService): PriceLine | null => {
  const service = serviceMap.get(selection.serviceId)
  if (!service) return null
  const customBase = Math.max(0, selection.customPrice)
  const base = service.basePrice ?? customBase
  const initialRequiresQuote = service.basePrice == null && customBase === 0
  let result: { subtotal: number; quantity: number; quantityLabel: string; specs: string[]; requiresQuote?: boolean }

  if (service.id === 'posting') result = calculatePosting(selection)
  else if (service.optionGroup === 'web') result = calculateWeb(base, selection)
  else if (service.optionGroup === 'dtp') result = calculateDtp(base, selection)
  else if (service.optionGroup === 'line') result = calculateLine(base, selection)
  else if (service.optionGroup === 'consulting') result = calculateConsulting(base, selection)
  else result = calculateGeneric(base, selection, service)

  const urgency = stringOption(selection.options, 'urgency', 'normal') as Urgency
  const multiplier = pricingConfig.urgencyMultipliers[urgency] ?? 1
  const subtotal = round(result.subtotal * multiplier)
  const internalCost = service.internalCost ?? round(subtotal * pricingConfig.provisionalInternalCostRate)
  const specification = [...result.specs, urgencyLabel[urgency] ?? urgencyLabel.normal].join(' / ')

  return {
    selectionId: selection.id,
    serviceId: service.id,
    name: service.name,
    specification,
    quantity: result.quantity,
    quantityLabel: result.quantityLabel,
    unitPrice: result.quantity > 0 ? round(subtotal / result.quantity) : subtotal,
    subtotal,
    internalCost,
    priceStatus: service.priceStatus,
    requiresQuote: initialRequiresQuote || Boolean(result.requiresQuote),
  }
}

export const calculatePricing = (quote: Quote): PricingResult => {
  const lines = quote.selections.map(calculateLinePrice).filter((line): line is PriceLine => line !== null)
  const baseSubtotal = lines.reduce((sum, line) => sum + line.subtotal, 0)
  const discountAmount = Math.min(baseSubtotal, Math.max(0, round(quote.discountAmount)))
  const discountRate = baseSubtotal > 0 ? (discountAmount / baseSubtotal) * 100 : 0
  const discountedSubtotal = Math.max(0, baseSubtotal - discountAmount)
  const agencyWholesale = round(discountedSubtotal * pricingConfig.agencyRate)
  const customerPrice = discountedSubtotal
  const agencyMargin = Math.max(0, customerPrice - agencyWholesale)
  const taxableSubtotal = quote.priceMode === 'agency' ? agencyWholesale : discountedSubtotal
  const taxAmount = calculateTax(taxableSubtotal, pricingConfig.taxRate)
  const internalCost = lines.reduce((sum, line) => sum + line.internalCost, 0)
  const grossProfit = taxableSubtotal - internalCost
  const grossMarginRate = taxableSubtotal > 0 ? grossProfit / taxableSubtotal : 0

  return {
    lines,
    baseSubtotal,
    discountRate,
    discountAmount,
    discountedSubtotal,
    agencyRate: pricingConfig.agencyRate,
    agencyWholesale,
    customerPrice,
    agencyMargin,
    taxableSubtotal,
    taxRate: pricingConfig.taxRate,
    taxAmount,
    total: taxableSubtotal + taxAmount,
    internalCost,
    grossProfit,
    grossMarginRate,
    hasPendingPrice: lines.some((line) => line.requiresQuote),
  }
}
