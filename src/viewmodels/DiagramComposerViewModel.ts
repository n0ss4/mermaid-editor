import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { EditorMode } from "../models";
import type { DiagramDocument, DiagramNode, ParseWarning } from "../domain/diagram";
import { normalizeFlowchartDocument } from "../domain/diagram";
import type { IDiagramDocumentService } from "../services";

export type ComposerSelection =
  | { kind: "node"; id: string }
  | { kind: "edge"; id: string }
  | null;

export interface DiagramComposerViewModelValue {
  mode: EditorMode;
  setMode: (mode: EditorMode) => void;
  document: DiagramDocument;
  warnings: ParseWarning[];
  selection: ComposerSelection;
  setSelection: (selection: ComposerSelection) => void;
  addNode: () => string;
  addNodeAt: (x: number, y: number) => string;
  updateNodePosition: (id: string, x: number, y: number) => void;
  updateNodeLabel: (id: string, label: string) => void;
  removeSelected: () => void;
  connectNodes: (sourceId: string, targetId: string) => void;
  setDirection: (direction: DiagramDocument["direction"]) => void;
}

interface DiagramComposerDeps {
  activeTabId: string;
  code: string;
  editorMode: EditorMode;
  docCache?: DiagramDocument;
  updateTab: (id: string, changes: Record<string, unknown>) => void;
  diagramDocumentService: IDiagramDocumentService;
}

const EMPTY_DOC: DiagramDocument = {
  version: "1",
  kind: "flowchart",
  direction: "TD",
  nodes: [],
  edges: [],
  subgraphs: [],
  rawBlocks: [],
};

function nextNodeId(nodes: DiagramNode[]): string {
  let index = nodes.length + 1;
  const ids = new Set(nodes.map((n) => n.id));
  while (ids.has(`N${index}`)) index += 1;
  return `N${index}`;
}

export function useDiagramComposerViewModel({
  activeTabId,
  code,
  editorMode,
  docCache,
  updateTab,
  diagramDocumentService,
}: DiagramComposerDeps): DiagramComposerViewModelValue {
  const parsedFromCode = useMemo(() => diagramDocumentService.parseFlowchart(code), [code, diagramDocumentService]);
  const resolveDoc = useCallback(
    (sourceCode: string, parsedDoc: DiagramDocument, cached?: DiagramDocument): DiagramDocument => {
      if (!cached) return parsedDoc;
      const serializedCached = diagramDocumentService.serializeFlowchart(cached);
      return serializedCached === sourceCode ? cached : parsedDoc;
    },
    [diagramDocumentService]
  );

  const [document, setDocument] = useState<DiagramDocument>(
    resolveDoc(code, parsedFromCode.doc ?? EMPTY_DOC, docCache)
  );
  const [warnings, setWarnings] = useState<ParseWarning[]>(parsedFromCode.warnings);
  const [selection, setSelection] = useState<ComposerSelection>(null);
  const prevTabIdRef = useRef(activeTabId);

  useEffect(() => {
    setDocument(resolveDoc(code, parsedFromCode.doc, docCache));
    setWarnings(parsedFromCode.warnings);
  }, [code, docCache, parsedFromCode, resolveDoc]);

  useEffect(() => {
    if (prevTabIdRef.current !== activeTabId) {
      prevTabIdRef.current = activeTabId;
      setSelection(null);
    }
  }, [activeTabId]);

  const commit = useCallback(
    (next: DiagramDocument) => {
      const normalized = normalizeFlowchartDocument(next);
      const nextCode = diagramDocumentService.serializeFlowchart(normalized);
      setDocument(normalized);
      setWarnings(diagramDocumentService.parseFlowchart(nextCode).warnings);
      updateTab(activeTabId, { code: nextCode, docCache: normalized });
    },
    [activeTabId, updateTab, diagramDocumentService]
  );

  const setMode = useCallback(
    (mode: EditorMode) => {
      updateTab(activeTabId, { editorMode: mode });
    },
    [activeTabId, updateTab]
  );

  const addNode = useCallback(() => {
    const id = nextNodeId(document.nodes);
    const col = document.nodes.length % 4;
    const row = Math.floor(document.nodes.length / 4);
    const node: DiagramNode = {
      id,
      label: id,
      shape: "rect",
      x: 120 + col * 240,
      y: 100 + row * 140,
      width: 160,
      height: 72,
    };
    commit({ ...document, nodes: [...document.nodes, node] });
    setSelection({ kind: "node", id });
    return id;
  }, [document, commit]);

  const addNodeAt = useCallback(
    (x: number, y: number) => {
      const id = nextNodeId(document.nodes);
      const node: DiagramNode = {
        id,
        label: id,
        shape: "rect",
        x: Math.round(x / 10) * 10,
        y: Math.round(y / 10) * 10,
        width: 160,
        height: 72,
      };
      commit({ ...document, nodes: [...document.nodes, node] });
      setSelection({ kind: "node", id });
      return id;
    },
    [document, commit]
  );

  const updateNodePosition = useCallback(
    (id: string, x: number, y: number) => {
      const snap = (v: number) => Math.round(v / 10) * 10;
      const nodes = document.nodes.map((n) => (n.id === id ? { ...n, x: snap(x), y: snap(y) } : n));
      setDocument({ ...document, nodes });
    },
    [document]
  );

  const updateNodeLabel = useCallback(
    (id: string, label: string) => {
      const nodes = document.nodes.map((n) => (n.id === id ? { ...n, label } : n));
      commit({ ...document, nodes });
    },
    [document, commit]
  );

  const removeSelected = useCallback(() => {
    if (!selection) return;
    if (selection.kind === "node") {
      const nodes = document.nodes.filter((n) => n.id !== selection.id);
      const edges = document.edges.filter((e) => e.source !== selection.id && e.target !== selection.id);
      commit({ ...document, nodes, edges });
    } else {
      const edges = document.edges.filter((e) => e.id !== selection.id);
      commit({ ...document, edges });
    }
    setSelection(null);
  }, [selection, document, commit]);

  const connectNodes = useCallback(
    (sourceId: string, targetId: string) => {
      if (sourceId === targetId) return;
      const exists = document.edges.some((e) => e.source === sourceId && e.target === targetId);
      if (exists) return;
      const edgeId = `e-${document.edges.length + 1}`;
      commit({
        ...document,
        edges: [...document.edges, { id: edgeId, source: sourceId, target: targetId, style: "solid" }],
      });
      setSelection({ kind: "edge", id: edgeId });
    },
    [document, commit]
  );

  const setDirection = useCallback(
    (direction: DiagramDocument["direction"]) => {
      commit({ ...document, direction });
    },
    [document, commit]
  );

  useEffect(() => {
    // Persist position changes after drag ends through a short idle debounce.
    const timer = setTimeout(() => {
      updateTab(activeTabId, { docCache: document });
    }, 120);
    return () => clearTimeout(timer);
  }, [document, activeTabId, updateTab]);

  return {
    mode: editorMode,
    setMode,
    document,
    warnings,
    selection,
    setSelection,
    addNode,
    addNodeAt,
    updateNodePosition,
    updateNodeLabel,
    removeSelected,
    connectNodes,
    setDirection,
  };
}
