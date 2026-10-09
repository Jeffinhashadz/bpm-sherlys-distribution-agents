import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Background,
  MarkerType,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Edge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Check, Copy, Maximize2, Minimize2, RotateCcw, Search } from 'lucide-react'
import { actorName } from '../../data/actors'
import { FLOW_NODE_WIDTH, layoutGraph, type LayoutDirection } from '../../lib/flowLayout'
import { toMermaid } from '../../lib/mermaidSource'
import type { TransitionKind, BlueprintModule } from '../../types/blueprint'
import { BPMDetailDrawer } from './BPMDetailDrawer'
import { FlowNodeCard, type FlowNode, type FlowNodeData } from './FlowNodeCard'
import { MermaidPanel } from './MermaidPanel'

const nodeTypes = { bpm: FlowNodeCard }

const edgeColor: Record<TransitionKind, string> = {
  normal: '#8b93a1',
  yes: '#246246',
  no: '#8c3b3b',
  hold: '#8a5a12',
  exception: '#b8612f',
  retry: '#3d5a80',
  'cross-module': '#152033',
}

function Viewer({
  module,
  highlightFlowIds,
  stageId,
  onStageChange,
}: {
  module: BlueprintModule
  highlightFlowIds: string[]
  stageId: string
  onStageChange: (stageId: string) => void
}) {
  const [actorId, setActorId] = useState('all')
  const [focus, setFocus] = useState<'all' | 'exceptions' | 'integrations'>('all')
  const [query, setQuery] = useState('')
  const [direction, setDirection] = useState<LayoutDirection>('LR')
  const [selectedId, setSelectedId] = useState<string | null>(highlightFlowIds[0] ?? null)
  const [showMermaid, setShowMermaid] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [copied, setCopied] = useState(false)
  const [focusRequest, setFocusRequest] = useState<string | null>(null)
  const [isFull, setIsFull] = useState(false)
  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const { fitView, zoomIn, zoomOut } = useReactFlow()
  const shellRef = useRef<HTMLDivElement>(null)

  const actors = useMemo(() => {
    const ids = [...new Set(module.nodes.flatMap((node) => node.actorIds))]
    return ids.map((id) => ({ id, name: actorName(id) }))
  }, [module.nodes])

  const visible = useMemo(() => {
    let pool = module.nodes
    if (focus === 'exceptions') {
      const seeds = new Set(
        module.nodes
          .filter((node) => node.type === 'exception' || node.type === 'decision')
          .map((node) => node.id),
      )
      for (const transition of module.transitions) {
        if (['exception', 'hold', 'retry', 'no'].includes(transition.kind)) {
          seeds.add(transition.source)
          seeds.add(transition.target)
        }
      }
      pool = pool.filter((node) => seeds.has(node.id))
    }
    if (focus === 'integrations') {
      const seeds = new Set(
        module.nodes
          .filter((node) => node.type === 'integration' || node.relatedModuleIds.length > 0)
          .map((node) => node.id),
      )
      for (const transition of module.transitions) {
        if (transition.kind === 'cross-module' || seeds.has(transition.source) || seeds.has(transition.target)) {
          if (seeds.has(transition.source) || seeds.has(transition.target) || transition.kind === 'cross-module') {
            seeds.add(transition.source)
            seeds.add(transition.target)
          }
        }
      }
      pool = pool.filter((node) => seeds.has(node.id))
    }
    if (stageId !== 'all') pool = pool.filter((node) => node.stageId === stageId)
    if (actorId !== 'all') pool = pool.filter((node) => node.actorIds.includes(actorId))
    const needle = query.trim().toLowerCase()
    if (needle) {
      pool = pool.filter(
        (node) => node.flowId.toLowerCase().includes(needle) || node.title.toLowerCase().includes(needle),
      )
    }
    const ids = new Set(pool.map((node) => node.id))
    const transitions = module.transitions.filter((item) => ids.has(item.source) && ids.has(item.target))
    return { nodes: pool, transitions }
  }, [actorId, focus, module.nodes, module.transitions, query, stageId])

  const mermaid = useMemo(() => toMermaid(module, direction), [direction, module])

  const layoutKey = `${direction}|${visible.nodes.map((node) => node.id).join(',')}|${visible.transitions.map((item) => item.id).join(',')}|${highlightFlowIds.join(',')}`

  useEffect(() => {
    const highlight = new Set(highlightFlowIds)
    const draft: FlowNode[] = visible.nodes.map((node) => ({
      id: node.id,
      type: 'bpm',
      position: { x: 0, y: 0 },
      data: {
        flowId: node.flowId,
        title: node.title,
        actorName: node.actorIds.map(actorName).join(', '),
        nodeType: node.type,
        highlighted: highlight.has(node.flowId),
        evidenceStatus: node.evidenceStatus,
        direction,
      } satisfies FlowNodeData,
      style: { width: FLOW_NODE_WIDTH },
    }))
    const laidOut = layoutGraph(draft, visible.transitions, direction)
    const nextEdges: Edge[] = visible.transitions.map((transition) => {
      const stroke = edgeColor[transition.kind]
      const dashed = transition.kind === 'retry' || transition.kind === 'cross-module'
      return {
        id: transition.id,
        source: transition.source,
        target: transition.target,
        label: transition.label,
        sourceHandle: direction === 'LR' ? 'out-right' : 'out-bottom',
        targetHandle: direction === 'LR' ? 'in-left' : 'in-top',
        type: 'smoothstep',
        style: { stroke, strokeWidth: 1.4, strokeDasharray: dashed ? '5 4' : undefined },
        markerEnd: { type: MarkerType.ArrowClosed, color: stroke, width: 16, height: 16 },
        labelStyle: { fill: '#1a2332', fontSize: 11, fontWeight: 600 },
        labelBgStyle: { fill: '#fffcf8', fillOpacity: 0.96 },
        labelBgPadding: [6, 3],
        labelBgBorderRadius: 4,
      }
    })
    setNodes(laidOut)
    setEdges(nextEdges)
    const frame = requestAnimationFrame(() => {
      const highlighted = laidOut.filter((node) => node.data.highlighted)
      void fitView({
        nodes: highlighted.length > 0 ? highlighted : laidOut.slice(0, 8),
        padding: 0.2,
        duration: 180,
        minZoom: 0.55,
        maxZoom: 1,
      })
    })
    return () => cancelAnimationFrame(frame)
  }, [direction, fitView, highlightFlowIds, layoutKey, setEdges, setNodes, visible.nodes, visible.transitions])

  useEffect(() => {
    const onChange = () => setIsFull(document.fullscreenElement === shellRef.current)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const selected = module.nodes.find((node) => node.id === selectedId) ?? null

  async function copyMermaid() {
    await navigator.clipboard.writeText(mermaid)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  async function toggleFull() {
    const node = shellRef.current
    if (!node) return
    if (document.fullscreenElement) await document.exitFullscreen()
    else await node.requestFullscreen()
  }

  function reset() {
    setActorId('all')
    setFocus('all')
    setQuery('')
    setDirection('LR')
    setSelectedId(null)
    onStageChange('all')
  }

  function focusNode(flowId: string) {
    setQuery('')
    setActorId('all')
    setFocus('all')
    onStageChange('all')
    setSelectedId(flowId)
    setFocusRequest(flowId)
  }

  useEffect(() => {
    if (!focusRequest) return
    const frame = requestAnimationFrame(() => {
      void fitView({ nodes: [{ id: focusRequest }], padding: 0.45, duration: 200, maxZoom: 1 })
      setFocusRequest(null)
    })
    return () => cancelAnimationFrame(frame)
  }, [fitView, focusRequest])

  return (
    <div ref={shellRef} className="overflow-hidden rounded-xl border border-line bg-card">
      <div className="flex flex-col gap-3 border-b border-line px-3 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs text-muted" htmlFor="stage-filter">Stage</label>
          <select
            id="stage-filter"
            className="rounded-md border border-line bg-card px-2 py-1.5 text-sm"
            value={stageId}
            onChange={(event) => onStageChange(event.target.value)}
          >
            <option value="all">All stages</option>
            {module.stages.map((stage) => (
              <option key={stage.id} value={stage.id}>{stage.title}</option>
            ))}
          </select>
          <label className="text-xs text-muted" htmlFor="actor-filter">Person</label>
          <select
            id="actor-filter"
            className="rounded-md border border-line bg-card px-2 py-1.5 text-sm"
            value={actorId}
            onChange={(event) => setActorId(event.target.value)}
          >
            <option value="all">All people</option>
            {actors.map((actor) => (
              <option key={actor.id} value={actor.id}>{actor.name}</option>
            ))}
          </select>
          <div className="inline-flex rounded-md border border-line p-0.5" role="group" aria-label="Path focus">
            {(
              [
                ['all', 'All paths'],
                ['exceptions', 'Exception paths'],
                ['integrations', 'Integrations'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={focus === value}
                className={`rounded px-2 py-1 text-xs ${focus === value ? 'bg-navy text-white' : 'text-muted'}`}
                onClick={() => setFocus(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <form
            className="relative min-w-48 flex-1"
            onSubmit={(event) => {
              event.preventDefault()
              const match = module.nodes.find((node) => node.flowId.toLowerCase() === query.trim().toLowerCase())
              if (match) {
                setActorId('all')
                setFocus('all')
                onStageChange('all')
                setSelectedId(match.flowId)
                setFocusRequest(match.flowId)
              }
            }}
          >
            <Search size={14} className="pointer-events-none absolute top-2.5 left-2 text-muted" aria-hidden="true" />
            <label className="sr-only" htmlFor="flow-search">Search by Flow ID</label>
            <input
              id="flow-search"
              list="flow-ids"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Flow ID"
              className="w-full rounded-md border border-line bg-card py-1.5 pr-2 pl-7 font-mono text-sm"
            />
            <datalist id="flow-ids">
              {module.nodes.map((node) => (
                <option key={node.flowId} value={node.flowId}>{node.title}</option>
              ))}
            </datalist>
          </form>
          <button type="button" className="rounded-md border border-line px-2 py-1.5 text-xs" onClick={() => setDirection((value) => (value === 'LR' ? 'TB' : 'LR'))}>
            Layout {direction === 'LR' ? 'horizontal' : 'vertical'}
          </button>
          <button type="button" className="rounded-md border border-line px-2 py-1.5 text-xs" onClick={() => zoomIn()}>Zoom in</button>
          <button type="button" className="rounded-md border border-line px-2 py-1.5 text-xs" onClick={() => zoomOut()}>Zoom out</button>
          <button type="button" className="rounded-md border border-line px-2 py-1.5 text-xs" onClick={() => void fitView({ padding: 0.18 })}>Fit</button>
          <button type="button" className="inline-flex items-center gap-1 rounded-md border border-line px-2 py-1.5 text-xs" onClick={() => void toggleFull()}>
            {isFull ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            {isFull ? 'Exit' : 'Fullscreen'}
          </button>
          <button type="button" className="inline-flex items-center gap-1 rounded-md border border-line px-2 py-1.5 text-xs" onClick={() => void copyMermaid()}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy Mermaid'}
          </button>
          <button type="button" className="inline-flex items-center gap-1 rounded-md border border-line px-2 py-1.5 text-xs" onClick={reset}>
            <RotateCcw size={14} />
            Reset
          </button>
        </div>
        <p className="text-xs text-muted" aria-live="polite">
          {visible.nodes.length} {visible.nodes.length === 1 ? 'step' : 'steps'} in this view. Drag to pan, scroll to zoom.
        </p>
      </div>
      <div className="grid lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="bpm-canvas h-[560px] lg:h-[680px]">
          {visible.nodes.length === 0 ? (
            <p className="p-6 text-sm text-muted">No steps match this filter. Reset the view to see the full workflow.</p>
          ) : (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              onNodeClick={(_, node) => setSelectedId(node.id)}
              minZoom={0.35}
              maxZoom={1.6}
              nodesConnectable={false}
              elementsSelectable
              nodesFocusable
              panOnScroll
            >
              <Background color="#e3dbd1" gap={18} />
              <MiniMap pannable zoomable nodeStrokeWidth={2} maskColor="rgba(243,239,232,0.7)" />
            </ReactFlow>
          )}
        </div>
        <aside className="hidden max-h-[680px] overflow-auto border-l border-line lg:block">
          <BPMDetailDrawer
            module={module}
            node={selected}
            transitions={module.transitions}
            onSelect={focusNode}
            onClose={() => setSelectedId(null)}
          />
        </aside>
      </div>
      {selected ? (
        <div className="max-h-[70vh] overflow-auto border-t border-line lg:hidden">
          <BPMDetailDrawer
            module={module}
            node={selected}
            transitions={module.transitions}
            onSelect={focusNode}
            onClose={() => setSelectedId(null)}
          />
        </div>
      ) : null}
      <div className="flex flex-wrap gap-3 border-t border-line px-3 py-2 text-[11px] text-muted">
        <span>Solid grey: next</span>
        <span className="text-ok">Green: yes</span>
        <span className="text-danger">Red: no</span>
        <span className="text-warn">Amber: hold</span>
        <span className="text-copper">Copper: exception</span>
        <span>Dashed: retry or cross-module</span>
      </div>
      <div className="flex gap-2 border-t border-line px-3 py-2">
        <button type="button" className="text-sm text-copper" aria-expanded={showMermaid} onClick={() => setShowMermaid((value) => !value)}>
          {showMermaid ? 'Hide Mermaid overview' : 'Show Mermaid overview'}
        </button>
        <button type="button" className="text-sm text-copper" aria-expanded={showRegister} onClick={() => setShowRegister((value) => !value)}>
          {showRegister ? 'Hide flow register' : 'Show flow register'}
        </button>
      </div>
      {showMermaid ? <MermaidPanel source={mermaid} /> : null}
      {showRegister ? (
        <div className="max-h-72 overflow-auto border-t border-line">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-paper text-xs text-muted">
              <tr>
                <th className="px-3 py-2 font-medium">Flow ID</th>
                <th className="px-3 py-2 font-medium">Step</th>
                <th className="px-3 py-2 font-medium">Actor</th>
              </tr>
            </thead>
            <tbody>
              {module.nodes.map((node) => (
                <tr key={node.flowId} className="border-t border-line">
                  <td className="px-3 py-2">
                    <button type="button" className="font-mono text-xs text-copper" onClick={() => focusNode(node.flowId)}>
                      {node.flowId}
                    </button>
                  </td>
                  <td className="px-3 py-2">{node.title}</td>
                  <td className="px-3 py-2 text-muted">{node.actorIds.map(actorName).join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}

export function BPMFlowViewer({
  module,
  highlightFlowIds = [],
  stageId,
  onStageChange,
}: {
  module: BlueprintModule
  highlightFlowIds?: string[]
  stageId?: string
  onStageChange?: (stageId: string) => void
}) {
  const [localStage, setLocalStage] = useState('all')
  const stage = stageId ?? localStage
  const setStage = onStageChange ?? setLocalStage
  return (
    <ReactFlowProvider>
      <Viewer module={module} highlightFlowIds={highlightFlowIds} stageId={stage} onStageChange={setStage} />
    </ReactFlowProvider>
  )
}
