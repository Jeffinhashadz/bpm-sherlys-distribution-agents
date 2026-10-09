import type { BlueprintModule } from '../types/blueprint'
import type { LayoutDirection } from './flowLayout'

function safeId(flowId: string): string {
  return flowId.replace(/[^A-Za-z0-9_]/g, '_')
}

function safeLabel(value: string): string {
  return value.replace(/["|[\]{}()<>]/g, '').replace(/\s+/g, ' ').trim()
}

export function toMermaid(bpmModule: BlueprintModule, direction: LayoutDirection = 'LR'): string {
  const lines = [`flowchart ${direction}`]
  for (const node of bpmModule.nodes) {
    const id = safeId(node.flowId)
    const label = safeLabel(`${node.flowId} ${node.title}`)
    if (node.type === 'decision') lines.push(`  ${id}{"${label}"}`)
    else if (node.type === 'start' || node.type === 'end') lines.push(`  ${id}(["${label}"])`)
    else lines.push(`  ${id}["${label}"]`)
  }
  for (const transition of bpmModule.transitions) {
    const source = safeId(transition.source)
    const target = safeId(transition.target)
    if (transition.label) lines.push(`  ${source} -->|"${safeLabel(transition.label)}"| ${target}`)
    else lines.push(`  ${source} --> ${target}`)
  }
  return lines.join('\n')
}
