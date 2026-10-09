import { graphlib, layout } from '@dagrejs/dagre'

export const FLOW_NODE_WIDTH = 252
export const FLOW_NODE_HEIGHT = 112

export type LayoutDirection = 'LR' | 'TB'

type LayoutNode = { id: string }
type LayoutEdge = { source: string; target: string }

export function layoutGraph<T extends LayoutNode>(
  nodes: T[],
  edges: LayoutEdge[],
  direction: LayoutDirection,
): Array<T & { position: { x: number; y: number } }> {
  const graph = new graphlib.Graph()
  graph.setDefaultEdgeLabel(() => ({}))
  graph.setGraph({
    rankdir: direction,
    nodesep: direction === 'LR' ? 42 : 28,
    ranksep: direction === 'LR' ? 78 : 64,
    marginx: 20,
    marginy: 20,
  })

  for (const node of nodes) {
    graph.setNode(node.id, { width: FLOW_NODE_WIDTH, height: FLOW_NODE_HEIGHT })
  }
  for (const edge of edges) {
    if (graph.hasNode(edge.source) && graph.hasNode(edge.target)) {
      graph.setEdge(edge.source, edge.target)
    }
  }

  layout(graph)

  return nodes.map((node) => {
    const positioned = graph.node(node.id)
    return {
      ...node,
      position: {
        x: positioned.x - FLOW_NODE_WIDTH / 2,
        y: positioned.y - FLOW_NODE_HEIGHT / 2,
      },
    }
  })
}
