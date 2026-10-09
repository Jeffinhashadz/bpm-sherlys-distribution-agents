import type { BlueprintModule, ProcessGap } from '../types/blueprint'

const branchKinds = new Set(['yes', 'no', 'hold', 'exception', 'retry'])

export function validateBlueprint(modules: BlueprintModule[], gaps: ProcessGap[]): string[] {
  const errors: string[] = []
  const seen = new Map<string, string>()

  for (const bpmModule of modules) {
    const nodeIds = new Set(bpmModule.nodes.map((node) => node.id))
    if (bpmModule.nodes.length === 0) errors.push(`${bpmModule.id} has no flows`)

    for (const node of bpmModule.nodes) {
      const prior = seen.get(node.flowId)
      if (prior) errors.push(`Duplicate Flow ID ${node.flowId} in ${prior} and ${bpmModule.id}`)
      seen.set(node.flowId, bpmModule.id)
      if (node.id !== node.flowId) errors.push(`${node.flowId} id does not match flowId`)
      if (node.moduleId !== bpmModule.id) errors.push(`${node.flowId} moduleId mismatch`)
      if (!node.title.trim() || !node.description.trim()) errors.push(`${node.flowId} missing text`)
      if (node.actorIds.length === 0) errors.push(`${node.flowId} has no actor`)
      if (!bpmModule.stages.some((stage) => stage.id === node.stageId)) {
        errors.push(`${node.flowId} uses unknown stage ${node.stageId}`)
      }
    }

    for (const transition of bpmModule.transitions) {
      if (!nodeIds.has(transition.source) || !nodeIds.has(transition.target)) {
        errors.push(`${bpmModule.id} edge ${transition.id} references a missing flow`)
      }
      if (branchKinds.has(transition.kind) && !transition.label?.trim()) {
        errors.push(`${transition.id} is missing a branch label`)
      }
    }

    for (const node of bpmModule.nodes) {
      if (node.type !== 'decision') continue
      const outgoing = bpmModule.transitions.filter((item) => item.source === node.id)
      if (outgoing.length < 2) errors.push(`${node.flowId} decision needs at least two branches`)
      if (outgoing.some((item) => !item.label?.trim())) {
        errors.push(`${node.flowId} has an unlabeled decision branch`)
      }
    }

    for (const node of bpmModule.nodes) {
      const connected = bpmModule.transitions.some(
        (item) => item.source === node.id || item.target === node.id,
      )
      if (!connected) errors.push(`${node.flowId} is isolated`)
    }
  }

  const moduleIds = new Set(modules.map((bpmModule) => bpmModule.id))
  for (const gap of gaps) {
    for (const moduleId of gap.moduleIds) {
      if (!moduleIds.has(moduleId)) errors.push(`${gap.id} references unknown module ${moduleId}`)
    }
    for (const link of gap.links) {
      if (!moduleIds.has(link.moduleId)) errors.push(`${gap.id} link module ${link.moduleId} missing`)
      const bpmModule = modules.find((item) => item.id === link.moduleId)
      for (const flowId of link.flowIds) {
        if (!bpmModule?.nodes.some((node) => node.flowId === flowId)) {
          errors.push(`${gap.id} highlights missing flow ${flowId}`)
        }
      }
    }
  }

  return errors
}
