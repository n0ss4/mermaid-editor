import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Download, Clipboard } from "lucide-react";
import type { Exporter } from "../export/types";
import { MERMAID_THEMES } from "../utils/constants";
import type { MermaidTheme } from "../utils/constants";

interface ExportDropdownProps {
  exporters: Exporter[];
  svgHtml: string;
  exportScale: number;
  onScaleChange: (scale: number) => void;
  canExport: boolean;
  mermaidTheme: MermaidTheme;
  onMermaidThemeChange: (theme: MermaidTheme) => void;
}

export function ExportDropdown({
  exporters,
  svgHtml,
  exportScale,
  onScaleChange,
  canExport,
  mermaidTheme,
  onMermaidThemeChange,
}: ExportDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const handleExport = (exporter: Exporter) => {
    exporter.export({ svgHtml, scale: exportScale });
    setOpen(false);
  };

  const downloadExporters = exporters.filter((e) => e.extension);
  const clipboardExporters = exporters.filter((e) => !e.extension);

  return (
    <div className="export-dropdown" ref={ref}>
      <button
        className="btn-secondary btn-sm"
        onClick={() => setOpen(!open)}
        disabled={!canExport}
      >
        <Download size={14} /> Export <ChevronDown size={12} />
      </button>
      {open && (
        <div className="export-dropdown-menu">
          {downloadExporters.map((exp) => (
            <button
              key={`dl-${exp.name}`}
              className="export-dropdown-item"
              onClick={() => handleExport(exp)}
            >
              <Download size={13} /> Download {exp.name}
            </button>
          ))}
          <div className="export-dropdown-divider" />
          {clipboardExporters.map((exp) => (
            <button
              key={`cp-${exp.name}`}
              className="export-dropdown-item"
              onClick={() => handleExport(exp)}
            >
              <Clipboard size={13} /> Copy {exp.name}
            </button>
          ))}
          <div className="export-dropdown-divider" />
          <div className="export-dropdown-row">
            <label>Theme</label>
            <select
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
          <div className="export-dropdown-row">
            <label>Scale</label>
            <select
              value={exportScale}
              onChange={(e) => onScaleChange(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 6, 8].map((s) => (
                <option key={s} value={s}>{s}x</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
