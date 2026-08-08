import { Check, ChevronRight, ClipboardList, FileDown, Pencil, Save, ShieldCheck, UserRound, WalletCards } from 'lucide-react'
import { ServiceIcon } from '../../components/ServiceIcon'
import { formatCurrency, formatRate } from '../../config/pricingConfig'
import { useQuote } from '../../context/QuoteContext'
import { serviceMap } from '../../data/services'
import { formatJapaneseDate } from '../../lib/date'

interface QuoteSummaryProps {
  onEditCustomer: () => void
  onSaved: () => void
  onPreview: (print?: boolean) => void
}

export const QuoteSummary = ({ onEditCustomer, onSaved, onPreview }: QuoteSummaryProps) => {
  const { quote, pricing, dispatch, save } = useQuote()
  const setDiscountRate = (raw: number) => {
    const rate = Math.min(100, Math.max(0, raw))
    const amount = Math.round(pricing.baseSubtotal * rate / 100)
    dispatch({ type: 'SET_DISCOUNT', rate, amount })
  }
  const setDiscountAmount = (raw: number) => {
    const amount = Math.min(pricing.baseSubtotal, Math.max(0, raw))
    const rate = pricing.baseSubtotal > 0 ? (amount / pricing.baseSubtotal) * 100 : 0
    dispatch({ type: 'SET_DISCOUNT', rate, amount })
  }
  const saveQuote = () => {
    save()
    onSaved()
  }

  return (
    <aside className="quote-summary no-print" aria-label="見積もりサマリー">
      <header className="summary-main-header"><h2>見積もりサマリー</h2><button type="button" onClick={onEditCustomer}><Pencil size={12} />編集</button></header>

      <section className="summary-section">
        <div className="summary-section-title"><span><UserRound size={14} />ご依頼情報</span><button type="button" onClick={onEditCustomer}>編集</button></div>
        <strong className="customer-name">{quote.customer.companyName || '顧客名 未入力'}</strong>
        <div className="request-grid">
          <span>ご担当：<b>{quote.customer.contactName || '未入力'}</b></span>
          <span>見積番号：<b>{quote.quoteNumber}</b></span>
          <span>案件：<b>{quote.customer.projectName || '未入力'}</b></span>
          <span>見積日：<b>{formatJapaneseDate(quote.customer.quoteDate)}</b></span>
          <span>価格タイプ：<b>{quote.priceMode === 'internal' ? '社内価格（標準）' : '代理店価格（掛率適用）'}</b></span>
          <span>有効期限：<b>{formatJapaneseDate(quote.customer.validUntil)}</b></span>
        </div>
      </section>

      <section className="summary-section">
        <div className="summary-section-title"><span><ClipboardList size={14} />選択中のサービス</span><small>{quote.selections.length}件</small></div>
        <div className="summary-service-list">
          {quote.selections.length === 0 && <p className="summary-empty">サービスが選択されていません。</p>}
          {quote.selections.map((selection, index) => {
            const service = serviceMap.get(selection.serviceId)
            const line = pricing.lines.find((item) => item.selectionId === selection.id)
            return service && line ? (
              <div key={selection.id}>
                <span className="summary-service-icon"><ServiceIcon service={service} size={17} /></span>
                <b className="summary-index">{index + 1}</b>
                <span className="summary-service-copy"><strong>{service.name}</strong><small>{line.specification}</small></span>
                <em>{line.requiresQuote ? '要見積' : formatCurrency(line.subtotal)}</em>
              </div>
            ) : null
          })}
        </div>
      </section>

      <section className="summary-section breakdown-section">
        <div className="summary-section-title"><span>見積内訳</span></div>
        <div className="breakdown-table" role="table">
          <div className="breakdown-head" role="row"><span>項目</span><span>数量</span><span>単価</span><span>小計（税抜）</span></div>
          {pricing.lines.map((line) => (
            <div className="breakdown-row" role="row" key={line.selectionId}>
              <span>{line.name}{line.priceStatus === 'provisional' && <small>暫定</small>}</span>
              <span>{line.quantity.toLocaleString('ja-JP')} {line.quantityLabel}</span>
              <span>{line.requiresQuote ? '—' : formatCurrency(line.unitPrice)}</span>
              <strong>{line.requiresQuote ? '要見積' : formatCurrency(line.subtotal)}</strong>
            </div>
          ))}
        </div>
        <div className="amount-rows">
          <div><span>小計（税抜）</span><strong>{formatCurrency(pricing.baseSubtotal)}</strong></div>
          <div className="discount-controls">
            <span>値引</span>
            <label><input type="number" min="0" max="100" step="0.1" value={Number(quote.discountRate.toFixed(1))} onChange={(event) => setDiscountRate(Number(event.target.value) || 0)} /><i>%</i></label>
            <label><i>¥</i><input type="number" min="0" step="1000" value={quote.discountAmount || ''} placeholder="0" onChange={(event) => setDiscountAmount(Number(event.target.value) || 0)} /></label>
            <strong className={pricing.discountAmount > 0 ? 'negative' : ''}>-{formatCurrency(pricing.discountAmount)}</strong>
          </div>
          {quote.priceMode === 'agency' && <>
            <div><span>通常価格</span><strong>{formatCurrency(pricing.discountedSubtotal)}</strong></div>
            <div><span>代理店掛率</span><strong>{formatRate(pricing.agencyRate)}</strong></div>
            <div className="agency-row"><span>代理店卸価格</span><strong>{formatCurrency(pricing.agencyWholesale)}</strong></div>
            <div><span>顧客提示価格</span><strong>{formatCurrency(pricing.customerPrice)}</strong></div>
            <div><span>代理店マージン</span><strong>{formatCurrency(pricing.agencyMargin)}</strong></div>
          </>}
          <div><span>消費税（{formatRate(pricing.taxRate)}）</span><strong>{formatCurrency(pricing.taxAmount)}</strong></div>
        </div>
      </section>

      <section className="internal-section">
        <label className="internal-toggle"><span><ShieldCheck size={13} />社内情報を表示</span><button type="button" role="switch" aria-checked={quote.showInternalInfo} className={quote.showInternalInfo ? 'is-on' : ''} onClick={() => dispatch({ type: 'SET_INTERNAL_VISIBILITY', value: !quote.showInternalInfo })}><i /></button></label>
        {quote.showInternalInfo && <div className="internal-grid">
          <span>暫定原価<strong>{formatCurrency(pricing.internalCost)}</strong></span>
          <span>粗利益<strong className={pricing.grossProfit < 0 ? 'negative' : ''}>{formatCurrency(pricing.grossProfit)}</strong></span>
          <span>粗利率<strong className={pricing.grossMarginRate < 0 ? 'negative' : ''}>{formatRate(pricing.grossMarginRate)}</strong></span>
        </div>}
      </section>

      <section className="summary-total">
        <div><strong>合計金額（税込）</strong><span>{formatCurrency(pricing.total)}</span></div>
        <small>税抜 {formatCurrency(pricing.taxableSubtotal)}</small>
        <div className="summary-badges">
          <span><Check size={10} />{quote.priceMode === 'agency' ? '代理店掛率適用' : '社内価格'}</span>
          {pricing.hasPendingPrice && <span className="warning-badge">要見積項目あり</span>}
        </div>
      </section>

      <section className="summary-schedule">
        <strong>見積スケジュール</strong>
        <div><span>発行日<b>{formatJapaneseDate(quote.customer.quoteDate)}</b></span><i /><span>有効期限<b>{formatJapaneseDate(quote.customer.validUntil)}</b></span></div>
      </section>

      <div className="summary-actions">
        <button type="button" className="primary-button" onClick={() => onPreview(false)}>見積内容を確認する<ChevronRight size={17} /></button>
        <div className="summary-secondary-actions">
          <button type="button" onClick={saveQuote}><Save size={14} />見積を保存</button>
          <button type="button" onClick={() => onPreview(true)}><FileDown size={14} />見積書PDFを出力</button>
        </div>
      </div>
      <div className="summary-data-note"><WalletCards size={12} />このブラウザに自動保存されています</div>
    </aside>
  )
}
