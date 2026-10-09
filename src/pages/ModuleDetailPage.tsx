import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { actorName } from '../data/actors'
import { gaps } from '../data/gaps'
import { getModule, modules } from '../data/modules'
import { evidenceLabel } from '../lib/labels'
import { BPMFlowViewer } from '../components/bpm/BPMFlowViewer'
import { Badge } from '../components/ui/Badge'

const scopeLabel = {
  feature: 'Feature',
  milestone: 'Milestone',
  prerequisite: 'Prerequisite',
  acceptance: 'Acceptance',
  decision: 'Decision',
} as const

export function ModuleDetailPage() {
  const { slug } = useParams()
  const [params, setParams] = useSearchParams()
  const module = getModule(slug)
  const [stageId, setStageId] = useState('all')
  const highlight = useMemo(
    () => (params.get('flows') ?? '').split(',').map((item) => item.trim()).filter(Boolean),
    [params],
  )
  const gapId = params.get('gap')

  useEffect(() => {
    document.title = module ? `${module.title} · Sherlys Business OS` : 'Module · Sherlys Business OS'
  }, [module])

  useEffect(() => {
    if (highlight.length > 0) {
      document.getElementById('bpm')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [highlight.length, slug])

  if (!module) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="text-2xl font-semibold">This module is not in the blueprint.</h1>
        <Link to="/modules" className="mt-4 inline-block text-sm text-copper">Back to modules</Link>
      </div>
    )
  }

  const relatedGaps = gaps.filter((gap) => module.relatedGapIds.includes(gap.id))

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <p className="text-sm text-muted">
        <Link to="/modules" className="text-copper">Modules</Link>
        <span> / {module.number}</span>
      </p>

      <section id="intro" className="mt-4 scroll-mt-24">
        <p className="font-mono text-xs text-copper">Module {module.number}</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">{module.title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">{module.objective}</p>
        <dl className="mt-6 grid gap-4 rounded-xl border border-line bg-card p-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs text-muted">Responsible persons</dt>
            <dd className="mt-1">{module.actorIds.map(actorName).join(', ')}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Related modules</dt>
            <dd className="mt-1 flex flex-col gap-1">
              {module.integrations
                .map((item) => item.moduleId)
                .filter((value, index, list) => list.indexOf(value) === index)
                .map((moduleId) => {
                  const related = modules.find((item) => item.id === moduleId)
                  return related ? (
                    <Link key={moduleId} to={`/modules/${related.slug}`} className="text-copper">{related.title}</Link>
                  ) : null
                })}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Key outcomes</dt>
            <dd className="mt-1">{module.keyOutputs.join(', ')}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Source documents</dt>
            <dd className="mt-1 text-xs leading-5">{module.sourceDocuments.join(' · ')}</dd>
          </div>
        </dl>
      </section>

      <section id="stages" className="mt-10 scroll-mt-24">
        <h2 className="text-lg font-semibold">Workflow summary</h2>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
          <button type="button" aria-pressed={stageId === 'all'} className={`shrink-0 rounded-lg border px-3 py-2 text-left text-sm ${stageId === 'all' ? 'border-copper bg-copper-soft' : 'border-line bg-card'}`} onClick={() => setStageId('all')}>
            All stages
          </button>
          {module.stages.map((stage, index) => (
            <button key={stage.id} type="button" aria-pressed={stageId === stage.id} className={`w-48 shrink-0 rounded-lg border px-3 py-2 text-left ${stageId === stage.id ? 'border-copper bg-copper-soft' : 'border-line bg-card'}`} onClick={() => setStageId(stage.id)}>
              <span className="font-mono text-[11px] text-copper">{String(index + 1).padStart(2, '0')}</span>
              <span className="mt-1 block text-sm font-medium">{stage.title}</span>
              <span className="mt-1 block text-xs leading-5 text-muted">{stage.summary}</span>
            </button>
          ))}
        </div>
      </section>

      <section id="bpm" className="mt-8 scroll-mt-24">
        <h2 className="text-lg font-semibold">Interactive BPM</h2>
        {gapId ? (
          <p className="mt-2 text-sm text-muted">
            Opened from <Link to={`/gaps#${gapId}`} className="font-mono text-copper">{gapId}</Link>. Highlighted steps are the ones that address it.
          </p>
        ) : null}
        <div className="mt-3">
          <BPMFlowViewer module={module} highlightFlowIds={highlight} stageId={stageId} onStageChange={setStageId} />
        </div>
      </section>

      <section id="roles" className="mt-10 scroll-mt-24">
        <h2 className="text-lg font-semibold">Persons and responsibilities</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {module.responsibilities.map((role) => (
            <article key={role.actorId} className="rounded-xl border border-line bg-card p-4">
              <h3 className="font-medium">{actorName(role.actorId)}</h3>
              <ul className="mt-2 space-y-1 text-sm text-muted">
                {role.activities.map((activity) => (
                  <li key={activity}>{activity}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section id="rules" className="mt-10 scroll-mt-24">
        <h2 className="text-lg font-semibold">Business rules</h2>
        <div className="mt-3 divide-y divide-line rounded-xl border border-line bg-card">
          {module.rules.map((rule) => (
            <article key={rule.id} className="px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-medium">{rule.title}</h3>
                <Badge status={rule.evidenceStatus} />
              </div>
              <p className="mt-1 text-sm leading-6">{rule.statement}</p>
              <p className="mt-1 text-xs text-muted">{rule.sourceReference}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="gaps" className="mt-10 scroll-mt-24">
        <h2 className="text-lg font-semibold">Gap-to-solution mapping</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {relatedGaps.map((gap) => {
            const link = gap.links.find((item) => item.moduleId === module.id)
            return (
              <article key={gap.id} className="rounded-xl border border-line bg-card p-4">
                <Link to={`/gaps#${gap.id}`} className="font-mono text-xs text-copper">{gap.id}</Link>
                <h3 className="mt-1 font-medium">{gap.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{gap.proposal}</p>
                {link ? (
                  <button
                    type="button"
                    className="mt-3 text-sm text-copper"
                    onClick={() => {
                      const next = new URLSearchParams(params)
                      next.set('gap', gap.id)
                      next.set('flows', link.flowIds.join(','))
                      setParams(next)
                      setStageId('all')
                      document.getElementById('bpm')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                  >
                    Highlight {link.flowIds.length} linked steps
                  </button>
                ) : null}
              </article>
            )
          })}
        </div>
      </section>

      <section id="integrations" className="mt-10 scroll-mt-24">
        <h2 className="text-lg font-semibold">Integration mapping</h2>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          {(['inbound', 'outbound'] as const).map((direction) => (
            <div key={direction} className="rounded-xl border border-line bg-card p-4">
              <h3 className="text-sm font-medium capitalize">{direction}</h3>
              <ul className="mt-3 space-y-3">
                {module.integrations.filter((item) => item.direction === direction).map((item) => {
                  const related = getModule(item.moduleId)
                  return (
                    <li key={`${item.direction}-${item.moduleId}-${item.description}`}>
                      {related ? <Link to={`/modules/${related.slug}`} className="text-sm font-medium text-copper">{related.title}</Link> : null}
                      <p className="text-sm leading-6 text-muted">{item.description}</p>
                      <p className="text-xs text-muted">{evidenceLabel[item.evidenceStatus]}</p>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section id="scope" className="mt-10 scroll-mt-24">
        <h2 className="text-lg font-semibold">Development scope</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {module.scope.map((item) => (
            <article key={item.title} className="rounded-xl border border-line bg-card p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{scopeLabel[item.kind]}</Badge>
                <Badge status={item.evidenceStatus} />
              </div>
              <h3 className="mt-2 text-sm font-medium">{item.title}</h3>
              <p className="mt-1 text-sm leading-6 text-muted">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
