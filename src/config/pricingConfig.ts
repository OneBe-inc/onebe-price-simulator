import type { Urgency } from '../types'

export const pricingConfig = {
  taxRate: 0.1,
  agencyRate: 0.85,
  provisionalInternalCostRate: 0.55,
  urgencyMultipliers: { normal: 1, rush: 1.2, express: 1.5 } satisfies Record<Urgency, number>,
  web: {
    includedPages: 3,
    additionalPagePrice: 80_000,
    premiumDesign: 150_000,
    cms: 150_000,
    responsive: 0,
    copywritingPerPage: 50_000,
    photography: 80_000,
    direction: 0,
    extraRevision: 15_000,
    seo: 80_000,
    publish: 0,
    maintenanceMonthly: 30_000,
  },
  dtp: {
    doubleSided: 30_000,
    additionalProposal: 20_000,
    extraRevision: 10_000,
    provisionalPrintUnitPrice: 100,
    premiumPaperPerUnit: 30,
    processingPerUnit: 40,
    delivery: 2_000,
  },
  line: { richMenu: 50_000, scenario: 80_000, tag: 30_000, distributionPlan: 50_000, monthlyOperation: 50_000, postUnitPrice: 10_000 },
  consulting: { additionalMeeting: 30_000, additionalHour: 15_000, deliverable: 50_000, additionalSupport: 80_000 },
} as const

export const currency = new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 })
export const formatCurrency = (value: number) => currency.format(Math.round(value))
export const formatRate = (value: number) => `${(value * 100).toFixed(1)}%`
