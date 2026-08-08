import { useEffect, useState } from 'react'
import { Header } from './components/Header'
import { GuideModal, NoticeModal } from './components/InfoModal'
import { CustomerModal } from './features/quote/CustomerModal'
import { useQuote } from './context/QuoteContext'
import { QuotePreviewPage } from './pages/QuotePreviewPage'
import { SavedQuotesPage } from './pages/SavedQuotesPage'
import { SimulatorPage } from './pages/SimulatorPage'
import type { Quote } from './types'

type View = 'simulator' | 'saved' | 'preview'
type Dialog = 'customer' | 'guide' | 'notice' | null

export const App = () => {
  const { load } = useQuote()
  const [view, setView] = useState<View>('simulator')
  const [dialog, setDialog] = useState<Dialog>(null)
  const [printOnOpen, setPrintOnOpen] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(''), 2400)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const openPreview = (print = false) => {
    setPrintOnOpen(print)
    setView('preview')
    window.scrollTo({ top: 0 })
  }
  const openQuote = (quote: Quote) => {
    load(quote)
    setView('simulator')
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="app-shell">
      <Header onGuide={() => setDialog('guide')} onNotice={() => setDialog('notice')} onSaved={() => setView('saved')} onExport={() => openPreview(true)} />
      {view === 'simulator' && <SimulatorPage onCustomer={() => setDialog('customer')} onSaved={() => setToast('見積を保存しました')} onPreview={openPreview} />}
      {view === 'saved' && <SavedQuotesPage onBack={() => setView('simulator')} onOpen={openQuote} />}
      {view === 'preview' && <QuotePreviewPage onBack={() => { setPrintOnOpen(false); setView('simulator') }} onSaved={() => setToast('見積を保存しました')} printOnOpen={printOnOpen} />}
      <footer className="app-footer no-print"><span>© 2026 OneBe Inc.</span><span>料金シミュレーター / 社内・代理店向け</span></footer>
      {dialog === 'customer' && <CustomerModal onClose={() => setDialog(null)} />}
      {dialog === 'guide' && <GuideModal onClose={() => setDialog(null)} />}
      {dialog === 'notice' && <NoticeModal onClose={() => setDialog(null)} />}
      {toast && <div className="toast no-print" role="status">{toast}</div>}
    </div>
  )
}
