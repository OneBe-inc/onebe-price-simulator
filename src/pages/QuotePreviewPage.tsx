import { ArrowLeft, FileDown, Save } from 'lucide-react'
import { useEffect } from 'react'
import { formatCurrency, formatRate } from '../config/pricingConfig'
import { useQuote } from '../context/QuoteContext'
import { formatJapaneseDate } from '../lib/date'

interface QuotePreviewPageProps {
  onBack: () => void
  onSaved: () => void
  printOnOpen?: boolean
}

export const QuotePreviewPage = ({ onBack, onSaved, printOnOpen = false }: QuotePreviewPageProps) => {
  const { quote, pricing, save } = useQuote()

  useEffect(() => {
    if (!printOnOpen) return
    const timeout = window.setTimeout(() => window.print(), 350)
    return () => window.clearTimeout(timeout)
  }, [printOnOpen])

  const handleSave = () => {
    save()
    onSaved()
  }

  return (
    <main className="quote-preview-page">
      <div className="preview-toolbar no-print">
        <button type="button" onClick={onBack}><ArrowLeft size={15} />編集へ戻る</button>
        <span>顧客提出用プレビュー</span>
        <div><button type="button" onClick={handleSave}><Save size={14} />保存</button><button type="button" className="primary-button compact" onClick={() => window.print()}><FileDown size={14} />印刷 / PDF保存</button></div>
      </div>
      <article className="quotation-sheet">
        <header className="quotation-header">
          <div><span>QUOTATION</span><h1>御 見 積 書</h1></div>
          <div className="quotation-company"><strong>株式会社OneBe</strong><small>見積番号　{quote.quoteNumber}</small><small>発行日　{formatJapaneseDate(quote.customer.quoteDate)}</small></div>
        </header>
        <section className="quotation-recipient">
          <div><strong>{quote.customer.companyName || '顧客名 未入力'}　御中</strong><p>{quote.customer.contactName ? `${quote.customer.contactName} 様` : 'ご担当者様'}</p><span>案件名：{quote.customer.projectName || '未入力'}</span></div>
          <dl><div><dt>有効期限</dt><dd>{formatJapaneseDate(quote.customer.validUntil)}</dd></div><div><dt>価格区分</dt><dd>{quote.priceMode === 'agency' ? '代理店価格' : '標準価格'}</dd></div></dl>
        </section>
        <section className="quotation-total"><span>下記の通りお見積申し上げます。</span><div><small>お見積金額（税込）</small><strong>{formatCurrency(pricing.total)}</strong></div></section>
        <table className="quotation-table">
          <thead><tr><th>No.</th><th>項目 / 仕様</th><th>数量</th><th>単価</th><th>小計（税抜）</th></tr></thead>
          <tbody>
            {pricing.lines.map((line, index) => (
              <tr key={line.selectionId}><td>{String(index + 1).padStart(2, '0')}</td><td><strong>{line.name}</strong><small>{line.specification}</small>{line.requiresQuote && <em>料金要確認</em>}</td><td>{line.quantity.toLocaleString('ja-JP')} {line.quantityLabel}</td><td>{line.requiresQuote ? '—' : formatCurrency(line.unitPrice)}</td><td>{line.requiresQuote ? '要見積' : formatCurrency(line.subtotal)}</td></tr>
            ))}
            {pricing.lines.length === 0 && <tr><td colSpan={5} className="quotation-empty">明細がありません。</td></tr>}
          </tbody>
        </table>
        <section className="quotation-bottom">
          <div className="quotation-notes"><strong>備考</strong><p>{quote.customer.notes || '記載事項なし'}</p>{pricing.hasPendingPrice && <small>「要見積」の項目は、正式条件確認後に金額を確定します。</small>}</div>
          <dl className="quotation-amounts">
            <div><dt>小計</dt><dd>{formatCurrency(pricing.baseSubtotal)}</dd></div>
            <div><dt>値引（{pricing.discountRate.toFixed(1)}%）</dt><dd>-{formatCurrency(pricing.discountAmount)}</dd></div>
            {quote.priceMode === 'agency' && <div><dt>代理店価格（掛率 {formatRate(pricing.agencyRate)}）</dt><dd>{formatCurrency(pricing.agencyWholesale)}</dd></div>}
            <div><dt>消費税（{formatRate(pricing.taxRate)}）</dt><dd>{formatCurrency(pricing.taxAmount)}</dd></div>
            <div className="amount-total"><dt>合計（税込）</dt><dd>{formatCurrency(pricing.total)}</dd></div>
          </dl>
        </section>
        <footer className="quotation-footer"><span>株式会社OneBe</span><small>本見積書は料金シミュレーターから出力されました。</small></footer>
      </article>
    </main>
  )
}
