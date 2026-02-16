import { useState, useEffect, useRef, useCallback } from "react";
import mermaid from "mermaid";
import { DEFAULT_MERMAID_CONFIG } from "../utils/constants";
import type { MermaidTheme } from "../utils/constants";

export function useMermaidRenderer(code: string, mermaidTheme: MermaidTheme = "default") {
  const [svgHtml, setSvgHtml] = useState("");
  const [error, setError] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const renderDiagram = useCallback(async (source: string, theme: MermaidTheme) => {
    if (!source.trim()) {
      setSvgHtml("");
      setError("");
      return;
    }
    try {
      mermaid.initialize({ ...DEFAULT_MERMAID_CONFIG, theme });
      const id = `mermaid-${Date.now()}`;
      const { svg } = await mermaid.render(id, source.trim());
      setSvgHtml(svg);
      setError("");
    } catch (e: any) {
      setError(e?.message || "Invalid syntax");
      setSvgHtml("");
    }
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => renderDiagram(code, mermaidTheme), 400);
    return () => clearTimeout(debounceRef.current);
  }, [code, mermaidTheme, renderDiagram]);

  return { svgHtml, error };
}
