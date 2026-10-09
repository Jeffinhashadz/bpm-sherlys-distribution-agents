import { describe, expect, it } from 'vitest'
import { gaps } from './gaps'
import { modules } from './modules'
import { releases } from './roadmap'
import { layoutGraph } from '../lib/flowLayout'
import { toMermaid } from '../lib/mermaidSource'
import { validateBlueprint } from '../lib/flowValidation'

const routes = ['/', '/gaps', '/modules', '/process-map', '/architecture', '/roadmap']

describe('blueprint integrity', () => {
  it('keeps flow ids, edges and decision labels valid', () => {
    expect(validateBlueprint(modules, gaps)).toEqual([])
  })

  it('gives every module a direct route', () => {
    const slugs = modules.map((module) => module.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const slug of slugs) {
      expect(routes.concat(`/modules/${slug}`).some((route) => route.endsWith(slug))).toBe(true)
    }
  })

  it('lays out every module without missing positions', () => {
    for (const module of modules) {
      const laidOut = layoutGraph(
        module.nodes.map((node) => ({ id: node.id })),
        module.transitions,
        'LR',
      )
      expect(laidOut).toHaveLength(module.nodes.length)
      for (const node of laidOut) {
        expect(Number.isFinite(node.position.x)).toBe(true)
        expect(Number.isFinite(node.position.y)).toBe(true)
      }
    }
  })

  it('builds mermaid from the same flow ids', () => {
    for (const module of modules) {
      const source = toMermaid(module)
      expect(source.startsWith('flowchart LR')).toBe(true)
      expect(source.includes('<script')).toBe(false)
      for (const node of module.nodes) {
        expect(source).toContain(node.flowId.replace(/-/g, '_'))
      }
    }
  })

  it('keeps the early Tally proof ahead of release 3', () => {
    const release1 = releases.find((release) => release.id === 'R1')
    expect(release1?.milestones.some((item) => item.id === 'R1-TALLY-POC')).toBe(true)
    const billing = releases.flatMap((release) => release.milestones).find((item) => item.id === 'R2-BILL')
    expect(billing?.dependsOn).toContain('R1-TALLY-POC')
  })
})
