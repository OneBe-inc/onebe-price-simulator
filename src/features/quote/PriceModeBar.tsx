import { CircleCheck, Info } from 'lucide-react'
import { useQuote } from '../../context/QuoteContext'

export const PriceModeBar = () => {
  const { quote, dispatch } = useQuote()
  return (
    <section className="price-mode-bar no-print" aria-label="価格タイプ">
      <strong className="shrink-0 text-[12px] text-navy">価格タイプ</strong>
      <div className="segmented-control" role="group" aria-label="価格タイプを選択">
        <button
          type="button"
          className={quote.priceMode === 'internal' ? 'is-selected' : ''}
          onClick={() => dispatch({ type: 'SET_PRICE_MODE', value: 'internal' })}
        >
          {quote.priceMode === 'internal' && <CircleCheck size={13} />} 社内価格
          <span>（標準）</span>
        </button>
        <button
          type="button"
          className={quote.priceMode === 'agency' ? 'is-selected' : ''}
          onClick={() => dispatch({ type: 'SET_PRICE_MODE', value: 'agency' })}
        >
          {quote.priceMode === 'agency' && <CircleCheck size={13} />} 代理店価格
          <span>（掛率適用）</span>
        </button>
      </div>
      <span className="ml-auto hidden items-center gap-1 text-[9px] font-medium text-slate-400 lg:flex"><Info size={11} />価格タイプは後から変更できます</span>
    </section>
  )
}
