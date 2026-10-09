import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { lifecycle } from '../data/company'
import { getModule } from '../data/modules'

export function ProcessMapPage() {
  useEffect(() => {
    document.title = 'Process Map · Sherlys Business OS'
  }, [])

  const primary = lifecycle.filter((step) => step.lane === 'primary')
  const cross = lifecycle.filter((step) => step.lane === 'cross-cutting')

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-xs font-medium tracking-[0.16em] text-copper uppercase">04 — Complete process map</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">How the business OS fits together</h1>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
        Stock becomes available only after receiving and damage separation. Orders then move through credit, loading, billing and delivery. Daily verification and admin monitoring run across that lifecycle.
      </p>
      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <ol className="relative space-y-3 border-l border-line pl-6">
          {primary.map((step, index) => (
            <li key={step.id} className="rounded-xl border border-line bg-card p-4">
              <span className="absolute -left-[5px] mt-1 h-2.5 w-2.5 rounded-full bg-copper" aria-hidden="true" />
              <p className="font-mono text-[11px] text-copper">{String(index + 1).padStart(2, '0')}</p>
              <h2 className="mt-1 font-semibold">{step.title}</h2>
              <p className="mt-1 text-sm leading-6 text-muted">{step.summary}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {step.moduleIds.map((moduleId) => {
                  const module = getModule(moduleId)
                  return module ? (
                    <Link key={moduleId} to={`/modules/${module.slug}`} className="rounded-full border border-line px-2 py-1 text-xs hover:border-copper">
                      {module.number} {module.title}
                    </Link>
                  ) : null
                })}
              </div>
            </li>
          ))}
        </ol>
        <aside className="h-fit rounded-xl border border-line bg-navy p-5 text-white lg:sticky lg:top-24">
          <h2 className="text-sm font-semibold">Cross-cutting controls</h2>
          <div className="mt-4 space-y-4">
            {cross.map((step) => (
              <div key={step.id}>
                <h3 className="text-sm font-medium">{step.title}</h3>
                <p className="mt-1 text-sm leading-6 text-white/70">{step.summary}</p>
                <div className="mt-2 flex flex-col gap-1">
                  {step.moduleIds.map((moduleId) => {
                    const module = getModule(moduleId)
                    return module ? (
                      <Link key={moduleId} to={`/modules/${module.slug}`} className="text-sm text-copper">
                        Open {module.title}
                      </Link>
                    ) : null
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
