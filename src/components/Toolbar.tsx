import React from "react";
import { Download, Clipboard, Trash2 } from "lucide-react";
import type { Exporter } from "../export/types";
import { MERMAID_THEMES } from "../utils/constants";
import type { MermaidTheme } from "../utils/constants";

interface ToolbarProps {
  exporters: Exporter[];
  svgHtml: string;
  exportScale: number;
  onScaleChange: (scale: number) => void;
  onClear: () => void;
  canExport: boolean;
  mermaidTheme: MermaidTheme;
  onMermaidThemeChange: (theme: MermaidTheme) => void;
}

export function Toolbar({
  exporters,
  svgHtml,
  exportScale,
  onScaleChange,
  onClear,
  canExport,
  mermaidTheme,
  onMermaidThemeChange,
}: ToolbarProps) {
  const handleExport = (exporter: Exporter) => {
    exporter.export({ svgHtml, scale: exportScale });
  };

  return (
    <div className="toolbar">
      {exporters.map((exp) => (
        <button
          key={exp.name + (exp.extension || "")}
          className="btn-primary"
          onClick={() => handleExport(exp)}
          disabled={!canExport}
        >
          {exp.extension ? (
            <><Download size={14} /> Export {exp.name}</>
          ) : (
            <><Clipboard size={14} /> Copy {exp.name}</>
          )}
        </button>
      ))}
      <button className="btn-secondary" onClick={onClear}>
        <Trash2 size={14} /> Clear
      </button>
      <div className="scale-select">
        <label htmlFor="mermaid-theme">Theme</label>
        <select
          id="mermaid-theme"
          value={mermaidTheme}
          onChange={(e) => onMermaidThemeChange(e.target.value as MermaidTheme)}
        >
          {MERMAID_THEMES.map((t) => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <div className="scale-select">
        <label htmlFor="export-scale">Scale</label>
        <select
          id="export-scale"
          value={exportScale}
          onChange={(e) => onScaleChange(Number(e.target.value))}
        >
          <option value={1}>1x</option>
          <option value={2}>2x</option>
          <option value={3}>3x</option>
          <option value={4}>4x</option>
          <option value={6}>6x</option>
          <option value={8}>8x</option>
        </select>
      </div>
    </div>
  );
}
