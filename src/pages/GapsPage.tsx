import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { actorNames } from '../data/actors'
import { gaps } from '../data/gaps'
import { getModule, modules } from '../data/modules'
import { evidenceLabel, priorityLabel } from '../lib/labels'
import { Badge } from '../components/ui/Badge'

export function GapsPage() {
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const moduleFilter = params.get('module') ?? 'all'
  const priority = params.get('priority') ?? 'all'

  useEffect(() => {
    document.title = 'Gap Analysis · Sherlys Business OS'
  }, [])

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return gaps.filter((gap) => {
      if (moduleFilter !== 'all' && !gap.moduleIds.includes(moduleFilter)) return false
      if (priority !== 'all' && gap.priority !== priority) return false
      if (!needle) return true
      return `${gap.id} ${gap.title} ${gap.limitation}`.toLowerCase().includes(needle)
    })
  }, [moduleFilter, priority, query])

  function update(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (value === 'all') next.delete(key)
    else next.set(key, value)
    setParams(next)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-xs font-medium tracking-[0.16em] text-copper uppercase">02 — Gap analysis</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Operational Gaps & Automation Opportunities</h1>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
        Each item is a process-design gap found in the blueprint manuals. Priority here means design priority for the future system. It is not a measured incident severity, and it is not evidence of financial loss.
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        <label className="sr-only" htmlFor="gap-search">Search gaps</label>
        <input id="gap-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search gaps" className="rounded-md border border-line bg-card px-3 py-2 text-sm" />
        <select aria-label="Filter by module" value={moduleFilter} onChange={(event) => update('module', event.target.value)} className="rounded-md border border-line bg-card px-3 py-2 text-sm">
          <option value="all">All modules</option>
          {modules.map((module) => (
            <option key={module.id} value={module.id}>{module.title}</option>
          ))}
        </select>
        <select aria-label="Filter by priority" value={priority} onChange={(event) => update('priority', event.target.value)} className="rounded-md border border-line bg-card px-3 py-2 text-sm">
          <option value="all">All priorities</option>
          <option value="foundation">Foundation</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
        </select>
      </div>
      <p className="mt-3 text-xs text-muted" aria-live="polite">{visible.length} gaps</p>
      <div className="mt-4 space-y-4">
        {visible.map((gap) => (
          <article key={gap.id} id={gap.id} className="scroll-mt-24 rounded-xl border border-line bg-card p-5">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-mono text-sm text-copper">{gap.id}</p>
              <Badge status={gap.validationStatus} />
              <Badge>{priorityLabel[gap.priority]}</Badge>
            </div>
            <h2 className="mt-2 text-lg font-semibold">{gap.title}</h2>
            <dl className="mt-4 grid gap-4 text-sm md:grid-cols-2">
              <div>
                <dt className="text-xs text-muted">Current documented workflow</dt>
                <dd className="mt-1 leading-6">{gap.currentWorkflow}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Identified limitation or dependency</dt>
                <dd className="mt-1 leading-6">{gap.limitation}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Possible operational impact</dt>
                <dd className="mt-1 leading-6">{gap.impact}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Proposed automation or control</dt>
                <dd className="mt-1 leading-6">{gap.proposal}</dd>
              </div>
            </dl>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-xs text-muted">Responsible actor</dt>
                <dd>{actorNames(gap.actorIds)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Validation status</dt>
                <dd>{evidenceLabel[gap.validationStatus]}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Source reference</dt>
                <dd>{gap.sourceReference}</dd>
              </div>
            </dl>
            <div className="mt-4 flex flex-wrap gap-2">
              {gap.links.map((link) => {
                const module = getModule(link.moduleId)
                if (!module) return null
                return (
                  <Link
                    key={`${gap.id}-${link.moduleId}`}
                    to={`/modules/${module.slug}?gap=${gap.id}&flows=${link.flowIds.join(',')}#bpm`}
                    className="rounded-lg border border-line px-3 py-1.5 text-sm hover:border-copper"
                  >
                    {module.number} {module.title}
                    <span className="ml-2 font-mono text-[11px] text-muted">{link.flowIds.slice(0, 3).join(', ')}</span>
                  </Link>
                )
              })}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
