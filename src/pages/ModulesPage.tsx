import { useEffect } from 'react'
import { modules } from '../data/modules'
import { ModuleCard } from '../components/modules/ModuleCard'

export function ModulesPage() {
  useEffect(() => {
    document.title = 'Modules · Sherlys Business OS'
  }, [])

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-xs font-medium tracking-[0.16em] text-copper uppercase">03 — Module explorer</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Six integrated modules</h1>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
        Each module opens the same working layout: purpose, stages, an interactive flow, roles, rules, the gaps it addresses, and the build scope.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => (
          <ModuleCard key={module.id} module={module} />
        ))}
      </div>
    </div>
  )
}
