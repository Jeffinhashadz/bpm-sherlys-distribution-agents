import { useEffect, useId, useRef, useState } from 'react'

export function MermaidPanel({ source }: { source: string }) {
  const host = useRef<HTMLDivElement>(null)
  const reactId = useId().replace(/:/g, '')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const draw = async () => {
      setError(null)
      const mermaid = (await import('mermaid')).default
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'strict',
        theme: 'neutral',
        fontFamily: 'Inter, sans-serif',
      })
      try {
        const { svg } = await mermaid.render(`bpm${reactId}${source.length}`, source)
        if (!cancelled && host.current) host.current.innerHTML = svg
      } catch {
        if (!cancelled) setError('The overview could not be drawn. The Mermaid source below can still be copied.')
      }
    }
    void draw()
    return () => {
      cancelled = true
    }
  }, [reactId, source])

  return (
    <div className="border-t border-line bg-paper px-3 py-3">
      {error ? <p className="mb-2 text-sm text-danger">{error}</p> : null}
      <div ref={host} className="overflow-auto rounded-lg border border-line bg-card p-3" />
      <pre className="mt-3 max-h-40 overflow-auto rounded-lg border border-line bg-card p-3 font-mono text-[11px] leading-5 text-muted">
        {source}
      </pre>
    </div>
  )
}
