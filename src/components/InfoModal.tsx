import { CircleAlert, MousePointerClick, Save, Settings2, SquareCheckBig } from 'lucide-react'
import { Modal } from './Modal'

export const GuideModal = ({ onClose }: { onClose: () => void }) => (
  <Modal title="料金シミュレーターの使い方" eyebrow="GUIDE" onClose={onClose} wide>
    <ol className="guide-list">
      <li><MousePointerClick /><div><strong>基本情報と価格タイプを設定</strong><p>顧客・案件情報を入力し、社内価格または代理店価格を選びます。</p></div></li>
      <li><SquareCheckBig /><div><strong>サービスを複数選択</strong><p>カテゴリや検索を使い、見積対象のサービスを追加します。</p></div></li>
      <li><Settings2 /><div><strong>仕様・数量を調整</strong><p>選択したサービスごとにページ数、部数、納期などを設定します。</p></div></li>
      <li><Save /><div><strong>保存・複製・出力</strong><p>見積をブラウザに保存し、必要に応じて複製または印刷します。</p></div></li>
    </ol>
  </Modal>
)

export const NoticeModal = ({ onClose }: { onClose: () => void }) => (
  <Modal title="料金・データの取り扱い" eyebrow="NOTICE" onClose={onClose}>
    <div className="notice-box"><CircleAlert /><p>本シミュレーターに登録された金額は、提示資料に基づく参考初期値または暫定設定です。「要見積」の項目を含め、顧客提出前に正式条件を確認してください。</p></div>
    <div className="notice-copy">
      <h3>保存先</h3><p>作成中・保存済みの見積は、このブラウザのlocalStorageに保存されます。別端末・別ブラウザとは共有されません。</p>
      <h3>社内情報</h3><p>原価・粗利益・粗利率は社内確認用です。顧客向け見積書には表示されません。</p>
      <h3>印刷</h3><p>印刷画面で「PDFに保存」を選択すると、顧客提出用のPDFとして保存できます。</p>
    </div>
  </Modal>
)
