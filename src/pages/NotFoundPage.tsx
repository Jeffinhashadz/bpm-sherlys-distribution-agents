import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-2xl font-semibold">This page is not part of the blueprint.</h1>
      <Link to="/" className="mt-4 inline-block text-sm text-copper">Return to the overview</Link>
    </div>
  )
}
