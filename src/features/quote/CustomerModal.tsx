import { useQuote } from '../../context/QuoteContext'
import type { CustomerInfo } from '../../types'
import { Modal } from '../../components/Modal'

const fields: Array<{ key: keyof CustomerInfo; label: string; type?: string; placeholder?: string }> = [
  { key: 'companyName', label: '法人名 / 屋号', placeholder: '例：株式会社OneBe' },
  { key: 'contactName', label: '担当者', placeholder: '担当者名を入力' },
  { key: 'projectName', label: '案件名', placeholder: '案件名を入力' },
  { key: 'quoteDate', label: '見積日', type: 'date' },
  { key: 'validUntil', label: '有効期限', type: 'date' },
]

export const CustomerModal = ({ onClose }: { onClose: () => void }) => {
  const { quote, dispatch } = useQuote()
  const update = (field: keyof CustomerInfo, value: string) => dispatch({ type: 'SET_CUSTOMER', field, value })

  return (
    <Modal title="ご依頼情報を編集" eyebrow="01 / 基本情報" onClose={onClose} wide>
      <div className="form-grid">
        {fields.map((field) => (
          <label key={field.key} className={field.key === 'projectName' ? 'span-2' : ''}>
            <span>{field.label}</span>
            <input
              type={field.type ?? 'text'}
              value={quote.customer[field.key]}
              placeholder={field.placeholder}
              onChange={(event) => update(field.key, event.target.value)}
            />
          </label>
        ))}
        <label>
          <span>見積番号</span>
          <input value={quote.quoteNumber} readOnly aria-readonly="true" />
        </label>
        <label className="span-2">
          <span>備考</span>
          <textarea
            value={quote.customer.notes}
            placeholder="見積条件・補足事項を入力"
            rows={4}
            onChange={(event) => update('notes', event.target.value)}
          />
        </label>
      </div>
      <div className="modal-footer">
        <p>入力内容はこのブラウザに自動保存されます。</p>
        <button type="button" className="primary-button compact" onClick={onClose}>入力内容を反映</button>
      </div>
    </Modal>
  )
}
