import { ArrowLeft, CalendarDays, Copy, ExternalLink, FileText, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { formatCurrency } from '../config/pricingConfig'
import { calculatePricing } from '../lib/pricingEngine'
import { quoteRepository } from '../repositories/quoteRepository'
import type { Quote } from '../types'

interface SavedQuotesPageProps {
  onBack: () => void
  onOpen: (quote: Quote) => void
}

export const SavedQuotesPage = ({ onBack, onOpen }: SavedQuotesPageProps) => {
  const [quotes, setQuotes] = useState(() => quoteRepository.list())
  const withPricing = useMemo(() => quotes.map((quote) => ({ quote, pricing: calculatePricing(quote) })), [quotes])

  const duplicate = (id: string) => {
    const next = quoteRepository.duplicate(id)
    if (next) {
      setQuotes(quoteRepository.list())
      onOpen(next)
    }
  }

  const remove = (id: string) => {
    if (!window.confirm('この保存済み見積を削除しますか？')) return
    quoteRepository.delete(id)
    setQuotes(quoteRepository.list())
  }

  return (
    <main className="saved-page no-print">
      <div className="page-title-row">
        <button type="button" className="back-button" onClick={onBack}><ArrowLeft size={15} />シミュレーターへ戻る</button>
        <div><span>SAVED QUOTES</span><h2>保存した見積</h2><p>このブラウザに保存されている見積を開く、複製、削除できます。</p></div>
      </div>
      {withPricing.length === 0 ? (
        <section className="saved-empty"><FileText size={28} /><h3>保存済みの見積はありません</h3><p>シミュレーター右側の「見積を保存」から保存できます。</p><button type="button" className="primary-button compact" onClick={onBack}>最初の見積を作成</button></section>
      ) : (
        <div className="saved-table">
          <div className="saved-table-head"><span>見積番号 / 顧客</span><span>案件</span><span>更新日</span><span>サービス</span><span>合計（税込）</span><span>操作</span></div>
          {withPricing.map(({ quote, pricing }) => (
            <article key={quote.id}>
              <span><b>{quote.quoteNumber}</b><small>{quote.customer.companyName || '顧客名 未入力'}</small></span>
              <span>{quote.customer.projectName || '案件名 未入力'}</span>
              <span className="date-cell"><CalendarDays size={12} />{new Date(quote.updatedAt).toLocaleString('ja-JP')}</span>
              <span>{quote.selections.length}件</span>
              <strong>{formatCurrency(pricing.total)}</strong>
              <span className="saved-actions">
                <button type="button" onClick={() => onOpen(quote)}><ExternalLink size={13} />開く</button>
                <button type="button" onClick={() => duplicate(quote.id)}><Copy size={13} />複製</button>
                <button type="button" className="delete" onClick={() => remove(quote.id)}><Trash2 size={13} />削除</button>
              </span>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}
