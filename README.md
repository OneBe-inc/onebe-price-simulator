# OneBe 料金シミュレーター

株式会社OneBeの営業担当・ディレクター・代理店が、サービス選択から見積書出力までをブラウザで行うための静的Webアプリです。React / TypeScript / Vite / Tailwind CSSで構築し、バックエンドや外部データベースを使用せずGitHub Pagesだけで動作します。

## URL

- Repository: https://github.com/OneBe-inc/onebe-price-simulator
- GitHub Pages: https://onebe-inc.github.io/onebe-price-simulator/

## 主な機能

- 8カテゴリ・60サービスの検索、絞り込み、複数選択
- Web / DTP / ポスティング / LINE / コンサル向け動的オプション
- 社内価格・代理店価格（掛率85%）の切り替え
- 値引率・値引額の相互計算
- 消費税、暫定原価、粗利益、粗利率のリアルタイム計算
- 顧客情報、案件情報、見積番号、有効期限、備考の管理
- 作成中見積の自動保存、保存済み一覧、再表示、複製、削除
- 顧客提出用Print Viewとブラウザの「PDFに保存」
- Desktop / Laptop / Tablet / Mobile対応

## 開発環境

- Node.js 22以上
- npm

```bash
npm install
npm run dev
```

ローカル開発URLはViteの表示に従ってください。GitHub PagesのRepository Pathに合わせ、`vite.config.ts` の `base` は `/onebe-price-simulator/` に設定しています。

## 検証コマンド

```bash
npm test
npm run lint
npm run build
npm run preview
```

`npm run build` の出力先は `dist/` です。

## GitHub Pagesへのdeploy

`.github/workflows/deploy.yml` が `main` branchへのpushを検知し、次を実行します。

1. Repository checkout
2. Node.jsセットアップ
3. `npm ci`
4. Unit Test / Lint / Production Build
5. Pages artifactのupload
6. GitHub Pagesへのdeploy

Repository SettingsのPages Sourceは `GitHub Actions` を使用します。

## 料金・サービスの変更方法

### サービスを追加する

`src/data/services.ts` の `services` 配列へサービスを追加します。料金未確定の場合は `basePrice: null`、`priceStatus: 'custom'` とし、確定価格のように表示しないでください。

### 料金を変更する

- サービス基本料金: `src/data/services.ts`
- 税率、代理店掛率、納期係数、暫定オプション加算: `src/config/pricingConfig.ts`
- 計算ロジック: `src/lib/pricingEngine.ts`

### オプションを追加する

1. `src/data/serviceOptions.ts` に入力定義と初期値を追加します。
2. 金額へ影響する場合は `src/config/pricingConfig.ts` に設定値を追加します。
3. `src/lib/pricingEngine.ts` に計算と見積仕様文を追加します。

### 税率を変更する

`src/config/pricingConfig.ts` の `taxRate` を変更します。初期設定は `0.1`（10%）です。

### 代理店掛率を変更する

`src/config/pricingConfig.ts` の `agencyRate` を変更します。初期設定は `0.85`（85%）です。

## データ保存仕様

データはブラウザの `localStorage` だけに保存され、サーバーへ送信されません。別端末・別ブラウザとは共有されません。

- 作成中見積: `onebe-price-simulator:draft`
- 保存済み見積: `onebe-price-simulator:saved-quotes`
- 最近使ったサービス: `onebe-price-simulator:recent-services`
- UI設定: `onebe-price-simulator:ui-settings`

UIからlocalStorageを直接操作せず、`src/repositories/quoteRepository.ts` の `QuoteRepository` interfaceと `LocalStorageQuoteRepository` を経由します。

## 暫定料金・要確認データ

現時点で正式料金の一次資料が提示されていないため、数値が入っている項目もすべて参考初期値または暫定設定として表示しています。

- ロゴ制作: 300,000円
- コーポレートサイト制作（1〜3ページ）: 500,000円
- 名刺デザイン: 100,000円
- ITパートナー: 200,000円 / 月
- 外部CBO / 外部CDO: 300,000円 / 月
- ブランディング顧問: 100,000〜500,000円 / 月（計算上の初期値は100,000円）
- ポスティング: 配布のみ5円 / 枚、印刷込み10円 / 枚
- オプション加算、暫定印刷単価、暫定原価率55%: 正式条件要確認
- 上記以外のサービス: 要見積（個別見積単価を入力可能）

顧客提出前に必ず正式条件を確認してください。

## ディレクトリ構成

```text
src/
  components/
  config/
  context/
  data/
  features/
    quote/
    services/
  lib/
  pages/
  repositories/
  storage/
  tests/
  types/
```
