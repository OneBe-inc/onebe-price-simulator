import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  title: string
  eyebrow?: string
  children: ReactNode
  onClose: () => void
  wide?: boolean
}

export const Modal = ({ title, eyebrow, children, onClose, wide = false }: ModalProps) => {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div className="modal-backdrop no-print" role="presentation" onMouseDown={onClose}>
      <section
        className={`modal-panel ${wide ? 'is-wide' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header>
          <div>
            {eyebrow && <span>{eyebrow}</span>}
            <h2 id="modal-title">{title}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="閉じる"><X size={18} /></button>
        </header>
        <div className="modal-body">{children}</div>
      </section>
    </div>
  )
}
