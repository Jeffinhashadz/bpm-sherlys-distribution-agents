import { Handle, Position, type Node, type NodeProps } from '@xyflow/react'
import type { EvidenceStatus, NodeType } from '../../types/blueprint'

export type FlowNodeData = {
  flowId: string
  title: string
  actorName: string
  nodeType: NodeType
  highlighted: boolean
  evidenceStatus: EvidenceStatus
  direction: 'LR' | 'TB'
}

export type FlowNode = Node<FlowNodeData, 'bpm'>

const accent: Record<NodeType, string> = {
  start: 'border-l-navy',
  action: 'border-l-muted',
  system: 'border-l-[#3d5a80]',
  decision: 'border-l-copper',
  approval: 'border-l-ok',
  integration: 'border-l-navy',
  exception: 'border-l-danger',
  data: 'border-l-[#6b5b4b]',
  end: 'border-l-navy',
}

export function FlowNodeCard({ data, selected }: NodeProps<FlowNode>) {
  const handleClass = '!h-2 !w-2 !border-0 !bg-navy'
  return (
    <div
      className={`h-[112px] w-[252px] rounded-lg border border-line border-l-4 bg-card px-3 py-2 text-left ${accent[data.nodeType]} ${
        selected ? 'ring-2 ring-copper' : ''
      } ${data.highlighted ? 'bg-copper-soft' : ''}`}
      aria-label={`${data.flowId} ${data.title}`}
    >
      <Handle id="in-left" type="target" position={Position.Left} className={`${handleClass} ${data.direction === 'LR' ? '' : '!opacity-0'}`} />
      <Handle id="in-top" type="target" position={Position.Top} className={`${handleClass} ${data.direction === 'TB' ? '' : '!opacity-0'}`} />
      <p className="font-mono text-[10px] tracking-wide text-copper">{data.flowId}</p>
      <p className="mt-1 line-clamp-2 text-[13px] font-semibold leading-snug">{data.title}</p>
      <p className="mt-1 truncate text-[11px] text-muted">{data.actorName}</p>
      <Handle id="out-right" type="source" position={Position.Right} className={`${handleClass} ${data.direction === 'LR' ? '' : '!opacity-0'}`} />
      <Handle id="out-bottom" type="source" position={Position.Bottom} className={`${handleClass} ${data.direction === 'TB' ? '' : '!opacity-0'}`} />
    </div>
  )
}
