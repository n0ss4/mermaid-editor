import type { DiagramDocument, DiagramEdge, DiagramNode } from "../types";

function sortNodes(nodes: DiagramNode[]): DiagramNode[] {
  return [...nodes].sort((a, b) => a.id.localeCompare(b.id));
}

function sortEdges(edges: DiagramEdge[]): DiagramEdge[] {
  return [...edges]
    .map((edge, index) => ({ ...edge, id: edge.id || `e-${index + 1}` }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

export function normalizeFlowchartDocument(doc: DiagramDocument): DiagramDocument {
  return {
    ...doc,
    nodes: sortNodes(doc.nodes),
    edges: sortEdges(doc.edges),
    subgraphs: [...doc.subgraphs].sort((a, b) => a.id.localeCompare(b.id)),
    rawBlocks: [...doc.rawBlocks].sort((a, b) => a.id.localeCompare(b.id)),
  };
}
