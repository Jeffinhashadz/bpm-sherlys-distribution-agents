import type { EvidenceStatus } from '../../types/blueprint'
import { evidenceLabel } from '../../lib/labels'

const tones: Record<EvidenceStatus, string> = {
  documented: 'bg-ink/5 text-ink',
  'identified-gap': 'bg-copper-soft text-copper',
  proposed: 'bg-navy/8 text-navy',
  'pending-validation': 'bg-warn/10 text-warn',
}

export function Badge({
  status,
  children,
}: {
  status?: EvidenceStatus
  children?: string
}) {
  const label = children ?? (status ? evidenceLabel[status] : '')
  const tone = status ? tones[status] : 'bg-ink/5 text-ink'
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wide ${tone}`}>
      {label}
    </span>
  )
}
