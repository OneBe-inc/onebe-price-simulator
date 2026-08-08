import { Check, ChevronDown, Search, Trash2, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { ServiceIcon } from '../../components/ServiceIcon'
import { categoryLabels, categoryTabs } from '../../config/appConfig'
import { formatCurrency } from '../../config/pricingConfig'
import { useQuote } from '../../context/QuoteContext'
import { services } from '../../data/services'
import { quoteRepository } from '../../repositories/quoteRepository'
import type { Service, ServiceCategory } from '../../types'

const referenceOrder = [
  'logo', 'corporate-site', 'landing-page', 'recruit-site', 'business-card',
  'leaflet', 'pamphlet', 'line-account', 'line-operation', 'posting',
  'photography', 'branding-advisor', 'external-cbo', 'it-partner', 'custom',
]
const referenceRank = new Map(referenceOrder.map((id, index) => [id, index]))

const priceLabel = (service: Service) => {
  if (service.basePrice == null) return '要見積'
  const suffix = service.pricingType === 'perUnit' ? ` / ${service.unit}` : service.pricingType === 'monthly' ? ' / 月' : '〜'
  return `${formatCurrency(service.basePrice)}${suffix}`
}

export const ServiceCatalog = () => {
  const { quote, dispatch } = useQuote()
  const initialSettings = quoteRepository.getUiSettings()
  const [category, setCategoryState] = useState<ServiceCategory | 'all'>(initialSettings.category)
  const [sort, setSortState] = useState(initialSettings.sort)
  const [query, setQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(15)

  useEffect(() => quoteRepository.saveUiSettings({ category, sort, compact: true }), [category, sort])

  const setCategory = (value: ServiceCategory | 'all') => { setCategoryState(value); setVisibleCount(15) }
  const setSort = (value: typeof sort) => { setSortState(value); setVisibleCount(15) }

  const selectedByService = useMemo(() => new Map(quote.selections.map((selection) => [selection.serviceId, selection])), [quote.selections])

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('ja')
    return services
      .filter((service) => service.active)
      .filter((service) => category === 'all' || service.category === category)
      .filter((service) => !normalized || [service.name, service.shortDescription, categoryLabels[service.category]].join(' ').toLocaleLowerCase('ja').includes(normalized))
      .sort((a, b) => {
        if (sort === 'price-asc') return (a.basePrice ?? Number.MAX_SAFE_INTEGER) - (b.basePrice ?? Number.MAX_SAFE_INTEGER)
        if (sort === 'name') return a.name.localeCompare(b.name, 'ja')
        const aRank = referenceRank.get(a.id) ?? Number.MAX_SAFE_INTEGER
        const bRank = referenceRank.get(b.id) ?? Number.MAX_SAFE_INTEGER
        return aRank - bRank || Number(b.recommended) - Number(a.recommended) || a.name.localeCompare(b.name, 'ja')
      })
  }, [category, query, sort])

  const toggleService = (service: Service) => {
    const selected = selectedByService.get(service.id)
    if (selected) dispatch({ type: 'REMOVE_SERVICE', selectionId: selected.id })
    else dispatch({ type: 'ADD_SERVICE', serviceId: service.id })
  }

  return (
    <section id="services" className="service-section no-print">
      <div className="catalog-toolbar">
        <div className="category-tabs" role="tablist" aria-label="サービスカテゴリ">
          {categoryTabs.map((tab) => (
            <button type="button" role="tab" aria-selected={category === tab.id} className={category === tab.id ? 'is-active' : ''} key={tab.id} onClick={() => setCategory(tab.id)}>{tab.label}</button>
          ))}
        </div>
        <div className="catalog-filters">
          <label className="search-field"><Search size={14} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="サービスを検索" /></label>
          <label className="sort-field"><select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)} aria-label="並び順"><option value="recommended">おすすめ順</option><option value="price-asc">価格の低い順</option><option value="name">名前順</option></select><ChevronDown size={13} /></label>
        </div>
      </div>

      <div className="service-grid" aria-live="polite">
        {filtered.slice(0, visibleCount).map((service) => {
          const selected = selectedByService.has(service.id)
          return (
            <button type="button" key={service.id} className={`service-card ${selected ? 'is-selected' : ''}`} onClick={() => toggleService(service)} aria-pressed={selected}>
              <span className="service-check">{selected && <Check size={12} strokeWidth={3} />}</span>
              <span className="service-card-top"><span className="service-card-icon"><ServiceIcon service={service} /></span><span className="min-w-0 text-left"><strong>{service.name}</strong>{service.recommended && <small>おすすめ</small>}</span></span>
              <span className="service-description">{service.shortDescription}</span>
              <span className="service-price"><b>{priceLabel(service)}</b>{service.priceStatus === 'provisional' && <em>暫定</em>}</span>
            </button>
          )
        })}
      </div>
      {filtered.length === 0 && <div className="empty-search">条件に一致するサービスはありません。</div>}
      {visibleCount < filtered.length && <button type="button" className="show-more" onClick={() => setVisibleCount((count) => count + 15)}>さらに表示（残り{filtered.length - visibleCount}件）<ChevronDown size={13} /></button>}

      <div className="selected-service-strip">
        <strong>選択中のサービス</strong>
        <div className="selected-chips">
          {quote.selections.length === 0 && <span className="selection-empty">サービスを選択してください</span>}
          {quote.selections.map((selection) => {
            const service = services.find((item) => item.id === selection.serviceId)
            return service ? <span className="service-chip" key={selection.id}>{service.name}<button type="button" onClick={() => dispatch({ type: 'REMOVE_SERVICE', selectionId: selection.id })} aria-label={`${service.name}を削除`}><X size={12} /></button></span> : null
          })}
        </div>
        {quote.selections.length > 0 && <button type="button" className="clear-button" onClick={() => dispatch({ type: 'CLEAR_SERVICES' })}><Trash2 size={13} />すべてクリア</button>}
      </div>
    </section>
  )
}
