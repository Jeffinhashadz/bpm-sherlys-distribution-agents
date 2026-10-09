import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { BlueprintModule } from '../../types/blueprint'

export function ModuleCard({ module }: { module: BlueprintModule }) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-line bg-card p-5">
      <p className="font-mono text-xs tracking-wide text-copper">Module {module.number}</p>
      <h3 className="mt-2 text-lg font-semibold tracking-tight">{module.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-muted">{module.shortDescription}</p>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-xs text-muted">Primary users</dt>
          <dd className="mt-1">{module.primaryUsers.slice(0, 2).join(', ')}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Workflow stages</dt>
          <dd className="mt-1">{module.stages.length}</dd>
        </div>
      </dl>
      <p className="mt-4 text-xs text-muted">Key outputs</p>
      <p className="mt-1 text-sm">{module.keyOutputs.slice(0, 3).join(' · ')}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {module.relatedGapIds.slice(0, 4).map((gapId) => (
          <Link key={gapId} to={`/gaps#${gapId}`} className="rounded-full border border-line px-2 py-0.5 font-mono text-[11px] text-muted hover:text-ink">
            {gapId}
          </Link>
        ))}
      </div>
      <Link
        to={`/modules/${module.slug}`}
        className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-copper"
      >
        Explore BPM
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </article>
  )
}
