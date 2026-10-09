import type {
  BPMNode,
  BPMTransition,
  DevelopmentStatus,
  EvidenceStatus,
  NodeType,
  TransitionKind,
} from '../types/blueprint'

export type NodeInput = {
  flowId: string
  moduleId: string
  stageId: string
  type: NodeType
  title: string
  description: string
  actorIds: string[]
  inputs?: string[]
  outputs?: string[]
  systemActions?: string[]
  rules?: string[]
  exceptions?: string[]
  relatedModuleIds?: string[]
  automationOpportunity?: string
  developmentStatus?: DevelopmentStatus
  sourceReferences: string[]
  evidenceStatus: EvidenceStatus
  businessRule?: string
}

export function flowNode(input: NodeInput): BPMNode {
  return {
    inputs: [],
    outputs: [],
    systemActions: [],
    rules: [],
    exceptions: [],
    nextFlowIds: [],
    relatedModuleIds: [],
    developmentStatus: 'in-blueprint',
    ...input,
    id: input.flowId,
  }
}

export function link(
  source: string,
  target: string,
  kind: TransitionKind = 'normal',
  label?: string,
): BPMTransition {
  const slug = (label ?? kind)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return {
    id: `${source}__${target}__${slug}`,
    source,
    target,
    kind,
    label,
  }
}

export function withNext(nodes: BPMNode[], transitions: BPMTransition[]): BPMNode[] {
  return nodes.map((node) => ({
    ...node,
    nextFlowIds: transitions.filter((item) => item.source === node.id).map((item) => item.target),
  }))
}
