import { Link } from 'react-router-dom'
import { actorNames } from '../../data/actors'
import { getModule } from '../../data/modules'
import { developmentLabel, evidenceLabel, nodeTypeLabel, transitionLabel } from '../../lib/labels'
import type { BlueprintModule, BPMNode, BPMTransition } from '../../types/blueprint'
import { Badge } from '../ui/Badge'

function List({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null
  return (
    <div>
      <h3 className="text-xs font-medium tracking-wide text-muted uppercase">{title}</h3>
      <ul className="mt-1 space-y-1 text-sm">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

export function BPMDetailDrawer({
  module,
  node,
  transitions,
  onSelect,
  onClose,
}: {
  module: BlueprintModule
  node: BPMNode | null
  transitions: BPMTransition[]
  onSelect: (flowId: string) => void
  onClose: () => void
}) {
  if (!node) {
    return (
      <div className="p-4 text-sm text-muted">
        Select a flow step to see the actor, inputs, outputs, rule and source.
      </div>
    )
  }

  const outgoing = transitions.filter((item) => item.source === node.id)
  const stage = module.stages.find((item) => item.id === node.stageId)

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs text-copper">{node.flowId}</p>
          <h2 className="mt-1 text-base font-semibold">{node.title}</h2>
        </div>
        <button type="button" className="text-sm text-muted lg:hidden" onClick={onClose}>
          Close
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <Badge status={node.evidenceStatus} />
        <Badge>{developmentLabel[node.developmentStatus]}</Badge>
        <Badge>{nodeTypeLabel[node.type]}</Badge>
      </div>
      <p className="text-sm leading-6">{node.description}</p>
      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-xs text-muted">Actor</dt>
          <dd>{actorNames(node.actorIds)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Stage</dt>
          <dd>{stage?.title ?? node.stageId}</dd>
        </div>
      </dl>
      <List title="Inputs" items={node.inputs} />
      <List title="System actions" items={node.systemActions} />
      <List title="Output" items={node.outputs} />
      <List title="Business rules" items={node.rules} />
      <List title="Exception paths" items={node.exceptions} />
      {node.businessRule ? (
        <p className="rounded-lg bg-copper-soft px-3 py-2 text-sm text-ink">{node.businessRule}</p>
      ) : null}
      {node.automationOpportunity ? (
        <div>
          <h3 className="text-xs font-medium tracking-wide text-muted uppercase">Automation opportunity</h3>
          <p className="mt-1 text-sm">{node.automationOpportunity}</p>
        </div>
      ) : null}
      {outgoing.length > 0 ? (
        <div>
          <h3 className="text-xs font-medium tracking-wide text-muted uppercase">Next flow</h3>
          <div className="mt-2 flex flex-col gap-1">
            {outgoing.map((item) => (
              <button
                key={item.id}
                type="button"
                className="rounded-md border border-line px-2 py-1.5 text-left text-sm hover:border-copper"
                onClick={() => onSelect(item.target)}
              >
                <span className="font-mono text-xs text-copper">{item.target}</span>
                <span className="mt-0.5 block text-xs text-muted">
                  {item.label ? `${item.label} · ${transitionLabel[item.kind]}` : transitionLabel[item.kind]}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
      {node.relatedModuleIds.length > 0 ? (
        <div>
          <h3 className="text-xs font-medium tracking-wide text-muted uppercase">Related module</h3>
          <div className="mt-2 flex flex-col gap-1">
            {node.relatedModuleIds.map((moduleId) => {
              const related = getModule(moduleId)
              return related ? (
                <Link key={moduleId} to={`/modules/${related.slug}`} className="text-sm text-copper">
                  {related.title}
                </Link>
              ) : null
            })}
          </div>
        </div>
      ) : null}
      <div>
        <h3 className="text-xs font-medium tracking-wide text-muted uppercase">Source reference</h3>
        <ul className="mt-1 space-y-1 text-xs leading-5 text-muted">
          {node.sourceReferences.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-muted">Status: {evidenceLabel[node.evidenceStatus]}</p>
      </div>
    </div>
  )
}
