import { useState, useEffect, useRef, useCallback } from "react";
import mermaid from "mermaid";

export function useMermaidRenderer(code: string) {
  const [svgHtml, setSvgHtml] = useState("");
  const [error, setError] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const renderDiagram = useCallback(async (source: string) => {
    if (!source.trim()) {
      setSvgHtml("");
      setError("");
      return;
    }
    try {
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
    debounceRef.current = setTimeout(() => renderDiagram(code), 400);
    return () => clearTimeout(debounceRef.current);
  }, [code, renderDiagram]);

  return { svgHtml, error };
}
