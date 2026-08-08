import { AlertCircle, Banknote, ChevronRight, Clock3, FileStack, Info, Minus, Plus, Settings2 } from 'lucide-react'
import { useState } from 'react'
import { ServiceIcon } from '../../components/ServiceIcon'
import { formatCurrency } from '../../config/pricingConfig'
import { useQuote } from '../../context/QuoteContext'
import { serviceOptions } from '../../data/serviceOptions'
import { serviceMap } from '../../data/services'
import type { OptionValue, SelectedService, ServiceOptionDefinition } from '../../types'

const NumberControl = ({ value, definition, onChange }: { value: number; definition: ServiceOptionDefinition; onChange: (value: number) => void }) => {
  const min = definition.min ?? 0
  const max = definition.max ?? Number.MAX_SAFE_INTEGER
  const step = definition.step ?? 1
  const update = (next: number) => onChange(Math.min(max, Math.max(min, next)))
  return (
    <div className="number-control">
      <button type="button" onClick={() => update(value - step)} aria-label={`${definition.label}を減らす`}><Minus size={12} /></button>
      <input type="number" min={min} max={max} step={step} value={value} onChange={(event) => update(Number(event.target.value) || min)} />
      <button type="button" onClick={() => update(value + step)} aria-label={`${definition.label}を増やす`}><Plus size={12} /></button>
      {definition.suffix && <span>{definition.suffix}</span>}
    </div>
  )
}

const OptionInput = ({ definition, value, onChange }: { definition: ServiceOptionDefinition; value: OptionValue; onChange: (value: OptionValue) => void }) => {
  if (definition.type === 'number') return <NumberControl value={Number(value)} definition={definition} onChange={onChange} />
  if (definition.type === 'toggle') {
    return (
      <div className="binary-control">
        <button type="button" className={value !== true ? 'is-active' : ''} onClick={() => onChange(false)}>なし</button>
        <button type="button" className={value === true ? 'is-active' : ''} onClick={() => onChange(true)}>あり</button>
      </div>
    )
  }
  if (definition.type === 'select') {
    return (
      <select value={String(value)} onChange={(event) => onChange(event.target.value)}>
        {definition.choices?.map((choice) => <option key={String(choice.value)} value={String(choice.value)}>{choice.label}</option>)}
      </select>
    )
  }
  return <input type="text" value={String(value)} placeholder={definition.hint} onChange={(event) => onChange(event.target.value)} />
}

const QuantityField = ({ selection }: { selection: SelectedService }) => {
  const { dispatch } = useQuote()
  const service = serviceMap.get(selection.serviceId)
  if (!service || service.optionGroup === 'web' || service.optionGroup === 'line' || service.optionGroup === 'consulting') return null
  const step = service.optionGroup === 'posting' ? 1_000 : service.optionGroup === 'dtp' ? 100 : 1
  const definition: ServiceOptionDefinition = { id: 'quantity', label: '数量', type: 'number', defaultValue: service.minimumQuantity, min: service.minimumQuantity, step, suffix: service.unit }
  return (
    <label className="option-field">
      <span>数量 <Info size={11} /></span>
      <NumberControl value={selection.quantity} definition={definition} onChange={(value) => dispatch({ type: 'UPDATE_QUANTITY', selectionId: selection.id, value })} />
    </label>
  )
}

export const OptionsPanel = () => {
  const { quote, pricing, dispatch } = useQuote()
  const [activeId, setActiveId] = useState<string | null>(null)
  const activeSelection = quote.selections.find((selection) => selection.id === activeId) ?? quote.selections[0]
  const activeService = activeSelection ? serviceMap.get(activeSelection.serviceId) : undefined
  const activeLine = activeSelection ? pricing.lines.find((line) => line.selectionId === activeSelection.id) : undefined

  if (!activeSelection || !activeService) {
    return (
      <section id="options" className="option-panel no-print">
        <header className="panel-heading"><div><Settings2 size={15} /><h2>オプション・仕様設定</h2><span>（選択中のサービスに共通の設定項目）</span></div></header>
        <div className="options-empty"><Settings2 size={22} /><strong>サービスを選択すると設定項目が表示されます</strong><p>上のサービスカードから見積対象を追加してください。</p></div>
      </section>
    )
  }

  const definitions = serviceOptions[activeService.optionGroup]
  const updateOption = (optionId: string, value: OptionValue) =>
    dispatch({ type: 'UPDATE_OPTION', selectionId: activeSelection.id, optionId, value })

  return (
    <section id="options" className="option-panel no-print">
      <header className="panel-heading">
        <div><Settings2 size={15} /><h2>オプション・仕様設定</h2><span>（サービスごとに設定）</span></div>
        <span className="option-price-preview">現在の小計 <strong>{activeLine?.requiresQuote ? '要見積を含む' : formatCurrency(activeLine?.subtotal ?? 0)}</strong></span>
      </header>
      <div className="option-service-tabs" role="tablist" aria-label="設定対象サービス">
        {quote.selections.map((selection, index) => {
          const service = serviceMap.get(selection.serviceId)
          return service ? (
            <button type="button" role="tab" aria-selected={activeSelection.id === selection.id} className={activeSelection.id === selection.id ? 'is-active' : ''} key={selection.id} onClick={() => setActiveId(selection.id)}>
              <span>{index + 1}</span>{service.name}
            </button>
          ) : null
        })}
      </div>
      <div className="active-option-title">
        <span className="option-title-icon"><ServiceIcon service={activeService} size={20} /></span>
        <div><strong>{activeService.name}</strong><small>{activeService.notes}</small></div>
        <ChevronRight size={14} />
      </div>
      <div className="options-grid">
        <QuantityField selection={activeSelection} />
        {activeService.basePrice == null && (
          <label className="option-field">
            <span>個別見積単価 <Info size={11} /></span>
            <div className="currency-input"><span>¥</span><input type="number" min={0} step={1000} value={activeSelection.customPrice || ''} placeholder="要見積" onChange={(event) => dispatch({ type: 'UPDATE_CUSTOM_PRICE', selectionId: activeSelection.id, value: Number(event.target.value) || 0 })} /></div>
          </label>
        )}
        {definitions.map((definition) => (
          <label className="option-field" key={definition.id}>
            <span>{definition.label} <Info size={11} /></span>
            <OptionInput definition={definition} value={activeSelection.options[definition.id] ?? definition.defaultValue} onChange={(value) => updateOption(definition.id, value)} />
          </label>
        ))}
      </div>
      <div className="provisional-note"><AlertCircle size={12} /><span>オプション加算・原価率は暫定設定です。顧客提出前に正式条件をご確認ください。</span></div>
      <div className="combination-summary">
        <div className="combination-list">
          <strong>組み合わせ見積</strong>
          {pricing.lines.map((line, index) => (
            <button type="button" key={line.selectionId} onClick={() => setActiveId(line.selectionId)}>
              <span>{index + 1}</span><b>{line.name}</b><em>{line.requiresQuote ? '要見積' : formatCurrency(line.subtotal)}</em>
            </button>
          ))}
        </div>
        <div className="combination-stat"><FileStack /><span>選択サービス数<strong>{quote.selections.length}</strong><small>サービス</small></span></div>
        <div className="combination-stat"><Banknote /><span>見積小計<strong>{formatCurrency(pricing.baseSubtotal)}</strong><small>税抜</small></span></div>
        <div className="combination-stat"><Clock3 /><span>料金確定状況<strong className="status-text">{pricing.hasPendingPrice ? '要確認あり' : '入力済み'}</strong></span></div>
      </div>
    </section>
  )
}
