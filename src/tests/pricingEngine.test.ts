import { describe, expect, it } from 'vitest'
import { pricingConfig } from '../config/pricingConfig'
import { getDefaultOptions } from '../data/serviceOptions'
import { serviceMap } from '../data/services'
import { calculatePricing } from '../lib/pricingEngine'
import type { Quote, SelectedService } from '../types'

const selection = (serviceId: string, overrides: Partial<SelectedService> = {}): SelectedService => {
  const service = serviceMap.get(serviceId)
  if (!service) throw new Error(`Service not found: ${serviceId}`)
  return {
    id: `selection-${serviceId}`,
    serviceId,
    quantity: service.minimumQuantity,
    customPrice: 0,
    options: getDefaultOptions(service.optionGroup),
    ...overrides,
  }
}

const quote = (selections: SelectedService[], overrides: Partial<Quote> = {}): Quote => ({
  id: 'quote-test',
  quoteNumber: 'QT-TEST',
  priceMode: 'internal',
  showInternalInfo: true,
  customer: { companyName: '', contactName: '', projectName: '', quoteDate: '2026-08-08', validUntil: '2026-09-07', notes: '' },
  selections,
  discountRate: 0,
  discountAmount: 0,
  createdAt: '2026-08-08T00:00:00.000Z',
  updatedAt: '2026-08-08T00:00:00.000Z',
  ...overrides,
})

describe('pricingEngine', () => {
  it('ロゴ制作の参考初期値300,000円を反映する', () => {
    const result = calculatePricing(quote([selection('logo')]))
    expect(result.baseSubtotal).toBe(300_000)
  })

  it('Webページ数を増やすと追加ページ料金を反映する', () => {
    const base = selection('corporate-site')
    const initial = calculatePricing(quote([base])).baseSubtotal
    const changed = calculatePricing(quote([{ ...base, options: { ...base.options, pages: 6 } }])).baseSubtotal
    expect(changed - initial).toBe(pricingConfig.web.additionalPagePrice * 3)
  })

  it('名刺の部数変更で暫定印刷費を更新する', () => {
    const base = selection('business-card', { quantity: 100 })
    const initial = calculatePricing(quote([base])).baseSubtotal
    const changed = calculatePricing(quote([{ ...base, quantity: 500 }])).baseSubtotal
    expect(changed - initial).toBe(pricingConfig.dtp.provisionalPrintUnitPrice * 400)
  })

  it('代理店価格へ85%の掛率を反映する', () => {
    const result = calculatePricing(quote([selection('logo')], { priceMode: 'agency' }))
    expect(result.agencyWholesale).toBe(255_000)
    expect(result.taxableSubtotal).toBe(255_000)
  })

  it('10%値引を小計と税込合計へ反映する', () => {
    const result = calculatePricing(quote([selection('logo')], { discountRate: 10, discountAmount: 30_000 }))
    expect(result.discountedSubtotal).toBe(270_000)
    expect(result.taxAmount).toBe(27_000)
    expect(result.total).toBe(297_000)
  })
})
