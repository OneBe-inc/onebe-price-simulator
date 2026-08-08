import type { OptionGroup, OptionValue, ServiceOptionDefinition } from '../types'

const urgency: ServiceOptionDefinition = {
  id: 'urgency',
  label: '納期',
  type: 'select',
  defaultValue: 'normal',
  choices: [
    { label: '通常', value: 'normal' },
    { label: '短納期（×1.2）', value: 'rush' },
    { label: '特急（×1.5）', value: 'express' },
  ],
}

export const serviceOptions: Record<OptionGroup, ServiceOptionDefinition[]> = {
  web: [
    { id: 'pages', label: 'ページ数', type: 'number', defaultValue: 3, min: 1, max: 100, step: 1, suffix: 'ページ' },
    {
      id: 'designLevel',
      label: 'デザインレベル',
      type: 'select',
      defaultValue: 'standard',
      choices: [
        { label: 'ライト', value: 'light' },
        { label: 'スタンダード', value: 'standard' },
        { label: 'プレミアム', value: 'premium' },
      ],
    },
    { id: 'cms', label: 'CMS', type: 'toggle', defaultValue: false },
    { id: 'responsive', label: 'レスポンシブ', type: 'toggle', defaultValue: true },
    {
      id: 'copywriting',
      label: '原稿',
      type: 'select',
      defaultValue: 'none',
      choices: [
        { label: '支給', value: 'none' },
        { label: '一部作成', value: 'partial' },
        { label: '全ページ作成', value: 'full' },
      ],
    },
    { id: 'photography', label: '撮影', type: 'toggle', defaultValue: false },
    { id: 'direction', label: 'ディレクション', type: 'toggle', defaultValue: true },
    { id: 'revisions', label: '修正回数', type: 'number', defaultValue: 3, min: 0, max: 20, step: 1, suffix: '回' },
    { id: 'seo', label: 'SEO基本設定', type: 'toggle', defaultValue: false },
    { id: 'publish', label: '公開作業', type: 'toggle', defaultValue: true },
    { id: 'maintenance', label: '保守', type: 'toggle', defaultValue: false },
    urgency,
  ],
  dtp: [
    {
      id: 'size',
      label: 'サイズ',
      type: 'select',
      defaultValue: 'standard',
      choices: [
        { label: '標準', value: 'standard' },
        { label: 'A4', value: 'a4' },
        { label: 'A3', value: 'a3' },
        { label: 'その他', value: 'other' },
      ],
    },
    {
      id: 'sides',
      label: '面数',
      type: 'select',
      defaultValue: 'single',
      choices: [
        { label: '片面', value: 'single' },
        { label: '両面', value: 'double' },
      ],
    },
    { id: 'proposals', label: 'デザイン案数', type: 'number', defaultValue: 1, min: 1, max: 10, step: 1, suffix: '案' },
    { id: 'revisions', label: '修正回数', type: 'number', defaultValue: 3, min: 0, max: 20, step: 1, suffix: '回' },
    { id: 'printing', label: '印刷', type: 'toggle', defaultValue: true },
    {
      id: 'paper',
      label: '用紙',
      type: 'select',
      defaultValue: 'standard',
      choices: [
        { label: '標準紙', value: 'standard' },
        { label: '高級紙', value: 'premium' },
      ],
    },
    { id: 'processing', label: '加工', type: 'toggle', defaultValue: false },
    { id: 'delivery', label: '配送', type: 'toggle', defaultValue: true },
    urgency,
  ],
  posting: [
    { id: 'area', label: '配布エリア', type: 'text', defaultValue: '', hint: '市区町村・地域を入力' },
    {
      id: 'printing',
      label: '印刷',
      type: 'select',
      defaultValue: 'distributionOnly',
      choices: [
        { label: '配布のみ 5円 / 枚', value: 'distributionOnly' },
        { label: '印刷込み 10円 / 枚', value: 'withPrint' },
      ],
    },
    {
      id: 'residenceType',
      label: '配布先',
      type: 'select',
      defaultValue: 'all',
      choices: [
        { label: '指定なし', value: 'all' },
        { label: '戸建', value: 'house' },
        { label: '集合住宅', value: 'apartment' },
      ],
    },
    { id: 'period', label: '配布期間', type: 'text', defaultValue: '', hint: '希望期間を入力' },
    { id: 'design', label: 'デザイン制作', type: 'toggle', defaultValue: false },
    urgency,
  ],
  line: [
    { id: 'initialSetup', label: '初期構築', type: 'toggle', defaultValue: true },
    { id: 'richMenu', label: 'リッチメニュー', type: 'toggle', defaultValue: false },
    { id: 'scenario', label: 'シナリオ', type: 'toggle', defaultValue: false },
    { id: 'tag', label: 'タグ設計', type: 'toggle', defaultValue: false },
    { id: 'distributionPlan', label: '配信設計', type: 'toggle', defaultValue: false },
    { id: 'monthlyOperation', label: '月次運用', type: 'toggle', defaultValue: false },
    { id: 'posts', label: '投稿本数', type: 'number', defaultValue: 0, min: 0, max: 100, step: 1, suffix: '本' },
    urgency,
  ],
  consulting: [
    { id: 'months', label: '契約月数', type: 'number', defaultValue: 1, min: 1, max: 60, step: 1, suffix: 'か月' },
    { id: 'meetings', label: '月間MTG数', type: 'number', defaultValue: 1, min: 0, max: 20, step: 1, suffix: '回' },
    { id: 'hours', label: '月間稼働時間', type: 'number', defaultValue: 5, min: 0, max: 200, step: 1, suffix: '時間' },
    { id: 'deliverable', label: '成果物', type: 'toggle', defaultValue: false },
    { id: 'additionalSupport', label: '追加支援', type: 'toggle', defaultValue: false },
    urgency,
  ],
  generic: [
    { id: 'scope', label: '仕様・範囲', type: 'text', defaultValue: '', hint: '見積条件を入力' },
    { id: 'revisions', label: '修正回数', type: 'number', defaultValue: 3, min: 0, max: 20, step: 1, suffix: '回' },
    urgency,
  ],
}

export const getDefaultOptions = (group: OptionGroup) =>
  Object.fromEntries(serviceOptions[group].map((option) => [option.id, option.defaultValue])) as Record<
    string,
    OptionValue
  >
