import { pricingConfig } from '../config/pricingConfig'
import { serviceOptions } from './serviceOptions'
import type { OptionGroup, PriceStatus, PricingType, Service, ServiceCategory } from '../types'

interface ServiceSeed {
  id: string
  category: ServiceCategory
  name: string
  shortDescription: string
  icon: string
  optionGroup?: OptionGroup
  pricingType?: PricingType
  basePrice?: number | null
  unit?: string
  minimumQuantity?: number
  recommended?: boolean
  notes?: string
  priceStatus?: PriceStatus
}

const createService = (seed: ServiceSeed): Service => {
  const optionGroup = seed.optionGroup ?? 'generic'
  return {
    id: seed.id,
    category: seed.category,
    name: seed.name,
    shortDescription: seed.shortDescription,
    description: seed.shortDescription,
    icon: seed.icon,
    pricingType: seed.pricingType ?? (seed.basePrice == null ? 'custom' : 'fixed'),
    basePrice: seed.basePrice ?? null,
    unit: seed.unit ?? '式',
    minimumQuantity: seed.minimumQuantity ?? 1,
    recommended: seed.recommended ?? false,
    availableOptions: serviceOptions[optionGroup].map((option) => option.id),
    estimatedDuration: '要確認',
    internalCost: null,
    agencyRate: pricingConfig.agencyRate,
    active: true,
    notes: seed.notes ?? '正式条件・料金は要確認',
    priceStatus: seed.priceStatus ?? (seed.basePrice == null ? 'custom' : 'provisional'),
    optionGroup,
  }
}

export const services: Service[] = [
  createService({ id: 'branding-support', category: 'brand', name: 'ブランディング支援', shortDescription: 'ブランド構築を横断的に支援します。', icon: 'Palette' }),
  createService({ id: 'brand-strategy', category: 'brand', name: 'ブランド戦略', shortDescription: 'ブランドの方針と実行計画を整理します。', icon: 'Target' }),
  createService({ id: 'mvv', category: 'brand', name: 'MVV策定', shortDescription: '理念・使命・価値観を言語化します。', icon: 'Compass' }),
  createService({ id: 'brand-concept', category: 'brand', name: 'ブランドコンセプト策定', shortDescription: 'ブランドの中核となる考え方を設計します。', icon: 'MessageSquareText' }),
  createService({ id: 'naming', category: 'brand', name: 'ネーミング', shortDescription: '名称候補と選定基準を整理します。', icon: 'CaseUpper' }),
  createService({ id: 'logo', category: 'brand', name: 'ロゴ制作', shortDescription: '事業や商品のロゴデザインを制作します。', icon: 'PenTool', basePrice: 300_000, recommended: true, notes: '参考初期値・暫定価格' }),
  createService({ id: 'brand-guideline', category: 'brand', name: 'ブランドガイドライン', shortDescription: 'ブランド表現の運用基準をまとめます。', icon: 'BookOpen' }),

  createService({ id: 'corporate-site', category: 'web', name: 'コーポレートサイト制作', shortDescription: '企業情報を伝えるWebサイトを制作します。', icon: 'Monitor', optionGroup: 'web', basePrice: 500_000, recommended: true, notes: '1〜3ページの参考初期値・暫定価格' }),
  createService({ id: 'recruit-site', category: 'web', name: '採用サイト制作', shortDescription: '採用情報に特化したサイトを制作します。', icon: 'Users', optionGroup: 'web' }),
  createService({ id: 'landing-page', category: 'web', name: 'LP制作', shortDescription: '単一目的のランディングページを制作します。', icon: 'PanelTop', optionGroup: 'web' }),
  createService({ id: 'service-site', category: 'web', name: 'サービスサイト制作', shortDescription: 'サービス訴求に特化したサイトを制作します。', icon: 'LayoutTemplate', optionGroup: 'web' }),
  createService({ id: 'web-renewal', category: 'web', name: 'Webサイトリニューアル', shortDescription: '既存サイトの構成と表現を見直します。', icon: 'RefreshCw', optionGroup: 'web' }),
  createService({ id: 'wordpress', category: 'web', name: 'WordPress構築', shortDescription: 'WordPressによる更新環境を構築します。', icon: 'Blocks', optionGroup: 'web' }),
  createService({ id: 'site-maintenance', category: 'web', name: 'サイト保守', shortDescription: '公開後のサイト保守を支援します。', icon: 'ShieldCheck', optionGroup: 'web', pricingType: 'monthly', unit: '月' }),
  createService({ id: 'web-operation', category: 'web', name: 'Web運用', shortDescription: '更新・改善を継続的に支援します。', icon: 'Activity', optionGroup: 'web', pricingType: 'monthly', unit: '月' }),
  createService({ id: 'seo', category: 'web', name: 'SEO支援', shortDescription: '検索流入の改善方針を整理します。', icon: 'Search', optionGroup: 'web' }),
  createService({ id: 'web-content', category: 'web', name: 'コンテンツ制作', shortDescription: 'Web掲載用のコンテンツを制作します。', icon: 'FileText', optionGroup: 'web' }),

  createService({ id: 'business-card', category: 'dtp', name: '名刺', shortDescription: '名刺のデザインと印刷条件を設定します。', icon: 'CreditCard', optionGroup: 'dtp', basePrice: 100_000, minimumQuantity: 100, recommended: true, notes: '名刺デザインの参考初期値・印刷費は暫定' }),
  createService({ id: 'shop-card', category: 'dtp', name: 'ショップカード', shortDescription: '店舗用カードをデザインします。', icon: 'Badge', optionGroup: 'dtp', minimumQuantity: 100 }),
  createService({ id: 'leaflet', category: 'dtp', name: 'チラシ', shortDescription: '配布用チラシをデザインします。', icon: 'FileText', optionGroup: 'dtp', minimumQuantity: 100 }),
  createService({ id: 'flyer', category: 'dtp', name: 'フライヤー', shortDescription: '告知用フライヤーをデザインします。', icon: 'Files', optionGroup: 'dtp', minimumQuantity: 100 }),
  createService({ id: 'pamphlet', category: 'dtp', name: 'パンフレット', shortDescription: '複数ページの冊子をデザインします。', icon: 'BookOpen', optionGroup: 'dtp', minimumQuantity: 100 }),
  createService({ id: 'company-profile', category: 'dtp', name: '会社案内', shortDescription: '企業紹介用の冊子を制作します。', icon: 'BookCopy', optionGroup: 'dtp', minimumQuantity: 100 }),
  createService({ id: 'poster', category: 'dtp', name: 'ポスター', shortDescription: '掲示用ポスターをデザインします。', icon: 'GalleryVerticalEnd', optionGroup: 'dtp', minimumQuantity: 1 }),
  createService({ id: 'envelope', category: 'dtp', name: '封筒', shortDescription: '業務用封筒をデザインします。', icon: 'Mail', optionGroup: 'dtp', minimumQuantity: 100 }),
  createService({ id: 'menu', category: 'dtp', name: 'メニュー', shortDescription: '店舗メニューをデザインします。', icon: 'NotebookTabs', optionGroup: 'dtp', minimumQuantity: 1 }),
  createService({ id: 'signboard', category: 'dtp', name: '看板', shortDescription: '掲出条件に合わせて看板をデザインします。', icon: 'PanelTop', optionGroup: 'dtp' }),
  createService({ id: 'other-dtp', category: 'dtp', name: 'その他DTP', shortDescription: '個別仕様の印刷物を制作します。', icon: 'Printer', optionGroup: 'dtp' }),

  createService({ id: 'posting', category: 'marketing', name: 'ポスティング', shortDescription: '指定エリアへ販促物を配布します。', icon: 'Send', optionGroup: 'posting', pricingType: 'perUnit', basePrice: 5, unit: '枚', minimumQuantity: 1_000, recommended: true, notes: '配布のみ5円/枚、印刷込み10円/枚の参考初期値' }),
  createService({ id: 'gbp', category: 'marketing', name: 'Google Business Profile支援', shortDescription: 'Google Business Profileの整備を支援します。', icon: 'MapPin' }),
  createService({ id: 'customer-journey', category: 'marketing', name: '集客導線設計', shortDescription: '認知から問い合わせまでの導線を整理します。', icon: 'Route' }),
  createService({ id: 'campaign', category: 'marketing', name: 'キャンペーン企画', shortDescription: '販促キャンペーンを企画します。', icon: 'Megaphone' }),
  createService({ id: 'store-promotion', category: 'marketing', name: '店舗販促', shortDescription: '店舗の販促施策を設計します。', icon: 'Store' }),
  createService({ id: 'ad-creative', category: 'marketing', name: '広告クリエイティブ', shortDescription: '広告掲載用の表現を制作します。', icon: 'PanelTop' }),

  createService({ id: 'line-account', category: 'line-sns', name: 'LINE公式アカウント構築', shortDescription: 'LINE公式アカウントの初期環境を整えます。', icon: 'MessageCircle', optionGroup: 'line' }),
  createService({ id: 'line-rich-menu', category: 'line-sns', name: 'LINEリッチメニュー', shortDescription: 'LINE用のリッチメニューを制作します。', icon: 'PanelsTopLeft', optionGroup: 'line' }),
  createService({ id: 'line-operation', category: 'line-sns', name: 'LINE運用支援', shortDescription: 'LINEの継続運用を支援します。', icon: 'MessageSquareMore', optionGroup: 'line', pricingType: 'monthly', unit: '月' }),
  createService({ id: 'line-delivery', category: 'line-sns', name: 'LINE配信設計', shortDescription: '配信内容とタイミングを設計します。', icon: 'ListTree', optionGroup: 'line' }),
  createService({ id: 'instagram', category: 'line-sns', name: 'Instagram支援', shortDescription: 'Instagram活用を支援します。', icon: 'Instagram', optionGroup: 'line' }),
  createService({ id: 'sns-operation', category: 'line-sns', name: 'SNS運用支援', shortDescription: 'SNSの継続運用を支援します。', icon: 'Share2', optionGroup: 'line', pricingType: 'monthly', unit: '月' }),
  createService({ id: 'sns-creative', category: 'line-sns', name: 'SNSクリエイティブ', shortDescription: 'SNS投稿用の素材を制作します。', icon: 'Images', optionGroup: 'line' }),

  createService({ id: 'photography', category: 'content', name: '写真撮影', shortDescription: '用途に合わせて写真を撮影します。', icon: 'Camera' }),
  createService({ id: 'product-photo', category: 'content', name: '商品撮影', shortDescription: '商品紹介用の写真を撮影します。', icon: 'Package' }),
  createService({ id: 'store-photo', category: 'content', name: '店舗撮影', shortDescription: '店舗の空間や設備を撮影します。', icon: 'Store' }),
  createService({ id: 'portrait-photo', category: 'content', name: '人物撮影', shortDescription: 'プロフィールや広報用の人物を撮影します。', icon: 'UserRound' }),
  createService({ id: 'writing', category: 'content', name: 'ライティング', shortDescription: '用途に合わせた文章を作成します。', icon: 'FilePenLine' }),
  createService({ id: 'copywriting', category: 'content', name: 'コピーライティング', shortDescription: '訴求の軸となるコピーを作成します。', icon: 'Quote' }),
  createService({ id: 'interview', category: 'content', name: '取材', shortDescription: '記事制作に必要な取材を行います。', icon: 'Mic2' }),

  createService({ id: 'branding-advisor', category: 'consulting', name: 'ブランディング顧問', shortDescription: 'ブランド活動を継続的に支援します。', icon: 'Crown', optionGroup: 'consulting', pricingType: 'monthly', basePrice: 100_000, unit: '月', recommended: true, notes: '参考初期値100,000〜500,000円/月・暫定価格' }),
  createService({ id: 'external-cbo', category: 'consulting', name: '外部CBO', shortDescription: 'ブランド責任者機能を外部から支援します。', icon: 'BriefcaseBusiness', optionGroup: 'consulting', pricingType: 'monthly', basePrice: 300_000, unit: '月', notes: '外部CxOの参考初期値・暫定価格' }),
  createService({ id: 'external-cdo', category: 'consulting', name: '外部CDO', shortDescription: 'デザイン責任者機能を外部から支援します。', icon: 'BadgeCheck', optionGroup: 'consulting', pricingType: 'monthly', basePrice: 300_000, unit: '月', notes: '外部CxOの参考初期値・暫定価格' }),
  createService({ id: 'it-partner', category: 'consulting', name: 'ITパートナー', shortDescription: 'IT課題の整理と実行を継続支援します。', icon: 'MonitorCog', optionGroup: 'consulting', pricingType: 'monthly', basePrice: 200_000, unit: '月', recommended: true, notes: '参考初期値・暫定価格' }),
  createService({ id: 'marketing-support', category: 'consulting', name: 'マーケティング支援', shortDescription: 'マーケティング施策を継続支援します。', icon: 'ChartNoAxesCombined', optionGroup: 'consulting', pricingType: 'monthly', unit: '月' }),
  createService({ id: 'restaurant-consulting', category: 'consulting', name: '飲食店コンサル', shortDescription: '飲食店運営の課題整理を支援します。', icon: 'Utensils', optionGroup: 'consulting', pricingType: 'monthly', unit: '月' }),
  createService({ id: 'project-management', category: 'consulting', name: 'プロジェクトマネジメント', shortDescription: 'プロジェクトの進行を支援します。', icon: 'KanbanSquare', optionGroup: 'consulting' }),
  createService({ id: 'requirements', category: 'consulting', name: '要件定義支援', shortDescription: '実行前の要件と優先順位を整理します。', icon: 'ListChecks', optionGroup: 'consulting' }),

  createService({ id: 'system-development', category: 'other', name: 'システム開発', shortDescription: '個別要件に応じてシステムを開発します。', icon: 'Code2' }),
  createService({ id: 'ai-support', category: 'other', name: 'AI導入支援', shortDescription: 'AI活用の検討と導入を支援します。', icon: 'Sparkles' }),
  createService({ id: 'business-improvement', category: 'other', name: '業務改善', shortDescription: '業務フローの整理と改善を支援します。', icon: 'Workflow' }),
  createService({ id: 'custom', category: 'other', name: 'その他カスタム案件', shortDescription: '一覧にない個別案件を見積もります。', icon: 'CirclePlus' }),
]

export const serviceMap = new Map(services.map((service) => [service.id, service]))
