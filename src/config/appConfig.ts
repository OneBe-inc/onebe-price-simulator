import type { ServiceCategory } from '../types'

export const appConfig = {
  companyName: '株式会社OneBe',
  repositoryUrl: 'https://github.com/OneBe-inc/onebe-price-simulator',
  productionUrl: 'https://onebe-inc.github.io/onebe-price-simulator/',
  storageVersion: 1,
  autosaveDelay: 250,
}

export const categoryLabels: Record<ServiceCategory, string> = {
  brand: 'ブランド',
  web: 'Web',
  dtp: '印刷物 / DTP',
  marketing: '集客支援',
  'line-sns': 'LINE / SNS',
  content: '写真 / コンテンツ',
  consulting: 'コンサル / 顧問',
  other: 'その他',
}

export const categoryTabs: Array<{ id: ServiceCategory | 'all'; label: string }> = [
  { id: 'all', label: 'すべて' },
  { id: 'brand', label: 'ブランド' },
  { id: 'web', label: 'Web' },
  { id: 'dtp', label: '印刷物' },
  { id: 'marketing', label: '集客支援' },
  { id: 'line-sns', label: 'LINE / SNS' },
  { id: 'content', label: '写真 / コンテンツ' },
  { id: 'consulting', label: '運用 / 顧問' },
  { id: 'other', label: 'その他' },
]
