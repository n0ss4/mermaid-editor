import React from "react";
import type { Exporter } from "../export/types";

interface ToolbarProps {
  exporters: Exporter[];
  svgHtml: string;
  exportScale: number;
  onScaleChange: (scale: number) => void;
  onClear: () => void;
  canExport: boolean;
}

export function Toolbar({
  exporters,
  svgHtml,
  exportScale,
  onScaleChange,
  onClear,
  canExport,
}: ToolbarProps) {
  const handleExport = (exporter: Exporter) => {
    exporter.export({ svgHtml, scale: exportScale });
  };

  return (
    <div className="toolbar">
      {exporters.map((exp) => (
        <button
          key={exp.name}
          className="btn-primary"
          onClick={() => handleExport(exp)}
          disabled={!canExport}
        >
          {exp.extension ? `Export ${exp.name}` : `Copy to ${exp.name}`}
        </button>
      ))}
      <button className="btn-secondary" onClick={onClear}>
        Clear
      </button>
      <div className="scale-select">
        <label htmlFor="export-scale">Export scale</label>
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
