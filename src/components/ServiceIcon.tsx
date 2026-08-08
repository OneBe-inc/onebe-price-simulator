import {
  BriefcaseBusiness,
  Camera,
  CirclePlus,
  FileText,
  MessageCircle,
  Monitor,
  Palette,
  PenTool,
  Send,
  type LucideIcon,
} from 'lucide-react'
import type { Service } from '../types'

const categoryIcons: Record<Service['category'], LucideIcon> = {
  brand: Palette,
  web: Monitor,
  dtp: FileText,
  marketing: Send,
  'line-sns': MessageCircle,
  content: Camera,
  consulting: BriefcaseBusiness,
  other: CirclePlus,
}

const namedIcons: Record<string, LucideIcon> = {
  logo: PenTool,
  'corporate-site': Monitor,
  posting: Send,
  photography: Camera,
}

export const ServiceIcon = ({ service, size = 24 }: { service: Service; size?: number }) => {
  const Icon = namedIcons[service.id] ?? categoryIcons[service.category]
  return <Icon size={size} strokeWidth={1.8} aria-hidden="true" />
}
