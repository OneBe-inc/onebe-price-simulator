import { Calculator, CircleHelp, FileDown, FolderClock, Info } from 'lucide-react'

interface HeaderProps {
  onGuide: () => void
  onNotice: () => void
  onSaved: () => void
  onExport: () => void
}

export const Header = ({ onGuide, onNotice, onSaved, onExport }: HeaderProps) => (
  <header className="app-header no-print">
    <div className="flex min-w-0 items-center gap-3">
      <div className="brand-mark"><Calculator size={20} strokeWidth={1.7} /></div>
      <div className="flex min-w-0 items-baseline gap-3">
        <h1 className="truncate text-[17px] font-bold tracking-[0.02em] text-navy">料金シミュレーター</h1>
        <span className="hidden text-[10px] font-semibold tracking-[0.08em] text-slate-400 sm:inline">社内 / 代理店向け</span>
      </div>
    </div>
    <nav className="header-actions" aria-label="ヘッダー操作">
      <button type="button" onClick={onGuide}><CircleHelp size={15} />使い方ガイド</button>
      <button type="button" onClick={onNotice}><Info size={15} />注意事項</button>
      <button type="button" onClick={onSaved}><FolderClock size={15} />保存した見積</button>
      <button type="button" className="header-export" onClick={onExport}><FileDown size={15} />見積書を出力</button>
    </nav>
  </header>
)
