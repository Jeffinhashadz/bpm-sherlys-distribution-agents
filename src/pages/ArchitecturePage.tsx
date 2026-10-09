import { useEffect } from 'react'
import { assumptions, architectureStatus, inventorySplit, layers, services } from '../data/architecture'
import { pendingDecisions } from '../data/decisions'
import { Badge } from '../components/ui/Badge'

export function ArchitecturePage() {
  useEffect(() => {
    document.title = 'Architecture · Sherlys Business OS'
  }, [])

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-xs font-medium tracking-[0.16em] text-copper uppercase">05 — System architecture</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Planned technical architecture</h1>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">{architectureStatus} This presentation site is a static Vite application. The stack below is the future ERP.</p>
      <div className="mt-4"><Badge status="proposed">Proposed</Badge></div>

      <div className="mt-8 grid gap-3">
        {layers.map((layer, index) => (
          <article key={layer.id} className="grid gap-3 rounded-xl border border-line bg-card p-5 md:grid-cols-[180px_1fr]">
            <p className="font-mono text-xs text-copper">0{index + 1} {layer.title}</p>
            <div>
              <p className="text-sm leading-6">{layer.summary}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {layer.items.map((item) => (
                  <li key={item} className="rounded-full border border-line px-2 py-1 text-xs">{item}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Shared services</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {services.map((service) => (
            <article key={service.name} className="rounded-xl border border-line bg-card p-4">
              <h3 className="text-sm font-medium">{service.name}</h3>
              <p className="mt-1 text-sm leading-6 text-muted">{service.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Two inventory meanings</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
          Supabase is the proposed store for warehouse operations. It does not replace Tally as the official accounting inventory book.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {[inventorySplit.operational, inventorySplit.official].map((column) => (
            <article key={column.title} className="rounded-xl border border-line bg-card p-5">
              <h3 className="font-semibold">{column.title}</h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
                {column.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Documented assumptions</h2>
        <ul className="mt-3 space-y-2 text-sm leading-6">
          {assumptions.map((item) => (
            <li key={item} className="rounded-lg border border-line bg-card px-3 py-2">{item}</li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Decisions still open</h2>
        <div className="mt-3 space-y-3">
          {pendingDecisions.map((decision) => (
            <article key={decision.id} className="rounded-xl border border-line bg-card p-4">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-mono text-xs text-copper">{decision.id}</p>
                <Badge status={decision.evidenceStatus} />
              </div>
              <h3 className="mt-1 text-sm font-medium">{decision.title}</h3>
              <p className="mt-1 text-sm leading-6 text-muted">{decision.context}</p>
              <p className="mt-2 text-xs text-muted">Needs confirmation from {decision.neededFrom}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
