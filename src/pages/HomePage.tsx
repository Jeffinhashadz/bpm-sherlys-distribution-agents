import { useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { company, facts, improvements, lifecycle } from '../data/company'
import { gaps } from '../data/gaps'
import { getModule, modules } from '../data/modules'
import { ModuleCard } from '../components/modules/ModuleCard'

export function HomePage() {
  useEffect(() => {
    document.title = 'Overview · Sherlys Business OS'
  }, [])

  return (
    <div>
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-16">
          <p className="text-xs font-medium tracking-[0.16em] text-copper uppercase">{company.label}</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">{company.heroTitle}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/75">{company.heroSubtitle}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/modules" className="rounded-lg bg-copper px-4 py-2 text-sm font-medium text-white">Explore Modules</Link>
            <Link to="/process-map" className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white">View Complete BPM</Link>
            <Link to="/gaps" className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white">Review Process Gaps</Link>
          </div>
          <dl className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {facts.map((fact) => (
              <div key={fact.label} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <dt className="text-2xl font-semibold">{fact.value}</dt>
                <dd className="mt-1 text-sm text-white/80">{fact.label}</dd>
                <dd className="text-xs text-white/55">{fact.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-14 px-4 py-12">
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="text-xl font-semibold">One operating record</h2>
            <p className="mt-3 text-sm leading-7 text-muted">{company.context}</p>
            <p className="mt-3 text-sm leading-7 text-muted">
              Source manuals use the name {company.legalSourceName}. This site uses {company.publicName}. The manuals are blueprint prototypes. They are not a measured operating history.
            </p>
          </div>
          <aside className="rounded-xl border border-line bg-card p-5 text-sm leading-6">
            <p className="text-xs font-medium tracking-wide text-copper uppercase">How to read this site</p>
            <ul className="mt-3 space-y-2 text-muted">
              <li><span className="text-ink">Documented</span> — stated in a source manual.</li>
              <li><span className="text-ink">Identified gap</span> — a missing link between those manuals.</li>
              <li><span className="text-ink">Proposed</span> — a recommended future control.</li>
              <li><span className="text-ink">Pending validation</span> — needs a business confirmation.</li>
            </ul>
          </aside>
        </section>

        <section>
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-xl font-semibold">Operational lifecycle</h2>
            <Link to="/process-map" className="inline-flex items-center gap-1 text-sm text-copper">Open the map <ArrowRight size={14} /></Link>
          </div>
          <ol className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {lifecycle.filter((step) => step.lane === 'primary').slice(0, 6).map((step, index) => (
              <li key={step.id} className="rounded-xl border border-line bg-card px-4 py-3">
                <p className="font-mono text-[11px] text-copper">{String(index + 1).padStart(2, '0')}</p>
                <p className="mt-1 text-sm font-medium">{step.title}</p>
                <p className="mt-1 text-xs leading-5 text-muted">{step.summary}</p>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Six modules</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {modules.map((module) => (
              <ModuleCard key={module.id} module={module} />
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Process gaps to review</h2>
              <p className="mt-2 max-w-2xl text-sm text-muted">These are design requirements found by reading the manuals together. They are not confirmed operational failures.</p>
            </div>
            <Link to="/gaps" className="text-sm text-copper">Full register</Link>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {gaps.slice(0, 4).map((gap) => (
              <article key={gap.id} id={gap.id} className="rounded-xl border border-line bg-card p-4">
                <p className="font-mono text-xs text-copper">{gap.id}</p>
                <h3 className="mt-1 font-semibold">{gap.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{gap.limitation}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {gap.links.map((link) => {
                    const module = getModule(link.moduleId)
                    if (!module) return null
                    const flows = link.flowIds.join(',')
                    return (
                      <Link key={link.moduleId} to={`/modules/${module.slug}?gap=${gap.id}&flows=${flows}#bpm`} className="text-sm text-copper">
                        {module.title}
                      </Link>
                    )
                  })}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-line bg-card p-5">
          <h2 className="text-xl font-semibold">Expected operational improvements</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted">Qualitative outcomes of connecting the modules. Quantified impact can be added when an operational baseline exists.</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {improvements.map((item) => (
              <li key={item} className="rounded-lg border border-line px-3 py-2 text-sm">{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
