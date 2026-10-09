import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Overview' },
  { to: '/gaps', label: 'Gaps' },
  { to: '/modules', label: 'Modules' },
  { to: '/process-map', label: 'Process Map' },
  { to: '/architecture', label: 'Architecture' },
  { to: '/roadmap', label: 'Roadmap' },
]

function itemClass(active: boolean, mobile = false) {
  const base = mobile
    ? 'block rounded-lg px-3 py-2 text-sm'
    : 'rounded-md px-2.5 py-1.5 text-sm'
  return active
    ? `${base} bg-white/10 text-white`
    : `${base} text-white/75 hover:bg-white/8 hover:text-white`
}

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy text-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <NavLink to="/" className="min-w-0" onClick={() => setOpen(false)}>
          <span className="block text-[11px] font-medium tracking-[0.16em] text-copper">SHERLYS</span>
          <span className="block truncate text-sm font-semibold">Business OS Blueprint</span>
        </NavLink>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'} className={({ isActive }) => itemClass(isActive)}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-white lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open ? (
        <nav id="mobile-nav" className="border-t border-white/10 px-4 py-3 lg:hidden" aria-label="Mobile">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => itemClass(isActive, true)}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      ) : null}
    </header>
  )
}
