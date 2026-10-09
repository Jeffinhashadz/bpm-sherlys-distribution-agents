import { useEffect, useState } from 'react'
import { releases } from '../data/roadmap'

export function RoadmapPage() {
  const [openId, setOpenId] = useState<string | null>(releases[0]?.milestones[0]?.id ?? null)

  useEffect(() => {
    document.title = 'Roadmap · Sherlys Business OS'
  }, [])

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-xs font-medium tracking-[0.16em] text-copper uppercase">06 — Implementation roadmap</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Three releases, no invented dates</h1>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
        There are no completion percentages and no committed delivery dates. A Tally credit read and a test invoice reference start in Release 1 so Release 2 billing is not the first attempt at the connector.
      </p>
      <div className="mt-8 space-y-8">
        {releases.map((release) => (
          <section key={release.id} className="rounded-xl border border-line bg-card p-5">
            <p className="font-mono text-xs text-copper">{release.id}</p>
            <h2 className="mt-1 text-xl font-semibold">{release.name}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{release.intent}</p>
            <p className="mt-3 rounded-lg bg-copper-soft px-3 py-2 text-sm">Acceptance gate: {release.gate}</p>
            <div className="mt-4 space-y-2">
              {release.milestones.map((milestone) => {
                const open = openId === milestone.id
                return (
                  <article key={milestone.id} className="rounded-lg border border-line">
                    <button
                      type="button"
                      className="flex w-full items-start justify-between gap-3 px-3 py-3 text-left"
                      aria-expanded={open}
                      onClick={() => setOpenId(open ? null : milestone.id)}
                    >
                      <span>
                        <span className="font-mono text-[11px] text-copper">{milestone.id}</span>
                        <span className="mt-1 block text-sm font-medium">{milestone.title}</span>
                        <span className="mt-1 block text-sm text-muted">{milestone.summary}</span>
                      </span>
                      <span className="text-xs text-muted">{open ? 'Hide' : 'Details'}</span>
                    </button>
                    {open ? (
                      <div className="space-y-3 border-t border-line px-3 py-3 text-sm">
                        <ul className="space-y-1 leading-6">
                          {milestone.details.map((detail) => (
                            <li key={detail}>{detail}</li>
                          ))}
                        </ul>
                        <div>
                          <h3 className="text-xs font-medium tracking-wide text-muted uppercase">Depends on</h3>
                          <p className="mt-1">{milestone.dependsOn.length > 0 ? milestone.dependsOn.join(', ') : 'No earlier milestone'}</p>
                        </div>
                        <div>
                          <h3 className="text-xs font-medium tracking-wide text-muted uppercase">Acceptance</h3>
                          <ul className="mt-1 space-y-1">
                            {milestone.acceptance.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : null}
                  </article>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
