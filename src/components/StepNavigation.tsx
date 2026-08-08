const steps = [
  ['01', '基本情報', '見積の前提条件を入力'],
  ['02', 'サービス選択', 'サービスを選んで追加'],
  ['03', '詳細オプション', '仕様・オプションを設定'],
  ['04', '確認', '内容と金額を確認'],
  ['05', '出力', '見積書の出力・保存'],
] as const

export const StepNavigation = ({ onStep }: { onStep: (step: number) => void }) => (
  <div className="step-navigation no-print" aria-label="見積作成ステップ">
    {steps.map(([number, title, subtitle], index) => (
      <button type="button" key={number} className={`step-item ${index === 0 ? 'is-active' : ''}`} onClick={() => onStep(index + 1)}>
        <span className="step-number">{number}</span>
        <span className="min-w-0 text-left">
          <strong>{title}</strong>
          <small>{subtitle}</small>
        </span>
        {index < steps.length - 1 && <span className="step-line" aria-hidden="true" />}
      </button>
    ))}
  </div>
)
