export type EvidenceStatus =
  | 'documented'
  | 'identified-gap'
  | 'proposed'
  | 'pending-validation'

export type DevelopmentStatus =
  | 'documented-only'
  | 'in-blueprint'
  | 'proposed'
  | 'pending-decision'

export type NodeType =
  | 'start'
  | 'action'
  | 'system'
  | 'decision'
  | 'approval'
  | 'integration'
  | 'exception'
  | 'data'
  | 'end'

export type TransitionKind =
  | 'normal'
  | 'yes'
  | 'no'
  | 'hold'
  | 'exception'
  | 'retry'
  | 'cross-module'

export type DesignPriority = 'foundation' | 'high' | 'medium'

export interface BPMActor {
  id: string
  name: string
  responsibility: string
  moduleIds: string[]
}

export interface BPMNode {
  id: string
  flowId: string
  title: string
  description: string
  actorIds: string[]
  moduleId: string
  stageId: string
  type: NodeType
  inputs: string[]
  outputs: string[]
  systemActions: string[]
  rules: string[]
  exceptions: string[]
  nextFlowIds: string[]
  relatedModuleIds: string[]
  automationOpportunity?: string
  developmentStatus: DevelopmentStatus
  sourceReferences: string[]
  evidenceStatus: EvidenceStatus
  businessRule?: string
}

export interface BPMTransition {
  id: string
  source: string
  target: string
  label?: string
  kind: TransitionKind
}

export interface ModuleStage {
  id: string
  title: string
  summary: string
}

export interface BusinessRule {
  id: string
  title: string
  statement: string
  evidenceStatus: EvidenceStatus
  sourceReference: string
}

export interface RoleActivity {
  actorId: string
  activities: string[]
}

export interface IntegrationLink {
  direction: 'inbound' | 'outbound'
  moduleId: string
  description: string
  evidenceStatus: EvidenceStatus
}

export interface ScopeItem {
  title: string
  detail: string
  kind: 'feature' | 'milestone' | 'prerequisite' | 'acceptance' | 'decision'
  evidenceStatus: EvidenceStatus
}

export interface BlueprintModule {
  id: string
  number: string
  slug: string
  title: string
  shortDescription: string
  objective: string
  primaryUsers: string[]
  keyOutputs: string[]
  actorIds: string[]
  stages: ModuleStage[]
  nodes: BPMNode[]
  transitions: BPMTransition[]
  relatedGapIds: string[]
  rules: BusinessRule[]
  responsibilities: RoleActivity[]
  integrations: IntegrationLink[]
  scope: ScopeItem[]
  sourceDocuments: string[]
}

export interface GapLink {
  moduleId: string
  flowIds: string[]
}

export interface ProcessGap {
  id: string
  title: string
  moduleIds: string[]
  currentWorkflow: string
  limitation: string
  impact: string
  proposal: string
  actorIds: string[]
  priority: DesignPriority
  sourceReference: string
  validationStatus: EvidenceStatus
  links: GapLink[]
}

export interface PendingDecision {
  id: string
  title: string
  context: string
  neededFrom: string
  evidenceStatus: EvidenceStatus
}

export interface LifecycleStep {
  id: string
  title: string
  summary: string
  moduleIds: string[]
  lane: 'primary' | 'cross-cutting'
}

export interface ArchitectureLayer {
  id: string
  title: string
  summary: string
  items: string[]
}

export interface Milestone {
  id: string
  title: string
  summary: string
  details: string[]
  acceptance: string[]
  dependsOn: string[]
}

export interface Release {
  id: string
  name: string
  intent: string
  milestones: Milestone[]
  gate: string
}
