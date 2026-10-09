import { company } from '../../data/company'

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>{company.publicName}</p>
        <p>{company.notice}</p>
      </div>
    </footer>
  )
}
