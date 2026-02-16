export type DiagramType =
  | "flowchart"
  | "sequence"
  | "class"
  | "state"
  | "er"
  | "gantt"
  | "pie"
  | "git"
  | "mindmap"
  | "timeline"
  | "unknown";

const DIAGRAM_PATTERNS: [RegExp, DiagramType][] = [
  [/^flowchart\b|^graph\b/i, "flowchart"],
  [/^sequenceDiagram\b/i, "sequence"],
  [/^classDiagram\b/i, "class"],
  [/^stateDiagram\b|^stateDiagram-v2\b/i, "state"],
  [/^erDiagram\b/i, "er"],
  [/^gantt\b/i, "gantt"],
  [/^pie\b/i, "pie"],
  [/^gitGraph\b/i, "git"],
  [/^mindmap\b/i, "mindmap"],
  [/^timeline\b/i, "timeline"],
];

export function detectDiagramType(code: string): DiagramType {
  const lines = code.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("%%")) continue;
    for (const [pattern, type] of DIAGRAM_PATTERNS) {
      if (pattern.test(trimmed)) return type;
    }
    return "unknown";
  }
  return "unknown";
}
