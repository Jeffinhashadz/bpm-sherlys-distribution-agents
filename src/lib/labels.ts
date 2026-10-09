import type {
  DesignPriority,
  DevelopmentStatus,
  EvidenceStatus,
  NodeType,
  TransitionKind,
} from '../types/blueprint'

export const evidenceLabel: Record<EvidenceStatus, string> = {
  documented: 'Documented',
  'identified-gap': 'Identified gap',
  proposed: 'Proposed',
  'pending-validation': 'Pending validation',
}

export const developmentLabel: Record<DevelopmentStatus, string> = {
  'documented-only': 'Documented only',
  'in-blueprint': 'In blueprint',
  proposed: 'Proposed',
  'pending-decision': 'Pending decision',
}

export const priorityLabel: Record<DesignPriority, string> = {
  foundation: 'Foundation',
  high: 'High',
  medium: 'Medium',
}

export const nodeTypeLabel: Record<NodeType, string> = {
  start: 'Start',
  action: 'User action',
  system: 'System action',
  decision: 'Decision',
  approval: 'Approval',
  integration: 'Integration',
  exception: 'Exception',
  data: 'Data operation',
  end: 'End',
}

export const transitionLabel: Record<TransitionKind, string> = {
  normal: 'Next',
  yes: 'Yes',
  no: 'No',
  hold: 'Hold',
  exception: 'Exception',
  retry: 'Retry',
  'cross-module': 'Cross-module',
}
