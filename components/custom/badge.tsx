import { priorityData } from '@/datas/priority'

import { Badge as BadgeUI } from '../ui/badge'

export function Badge({
  priority,
}: {
  priority: 'low' | 'normal' | 'high' | 'urgent'
}) {
  const priorityItem = priorityData.find((p) => p.value === priority)
  const { className, label } = priorityItem ?? { className: '', label: '' }

  return <BadgeUI className={className}>{label}</BadgeUI>
}
