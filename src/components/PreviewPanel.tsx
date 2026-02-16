import React from "react";

interface PreviewPanelProps {
  svgHtml: string;
  error: string;
  zoom: number;
  pan: { x: number; y: number };
  handlers: {
    onWheel: (e: React.WheelEvent) => void;
    onPointerDown: (e: React.PointerEvent) => void;
    onPointerMove: (e: React.PointerEvent) => void;
    onPointerUp: () => void;
  };
  controls: {
    zoomIn: () => void;
    zoomOut: () => void;
    fitToView: () => void;
  };
}

export function PreviewPanel({
  svgHtml,
  error,
  zoom,
  pan,
  handlers,
  controls,
}: PreviewPanelProps) {
  const zoomPercent = Math.round(zoom * 100);

  return (
    <div className="panel preview-panel">
      <div className="panel-header">
        <span className="panel-label">Preview</span>
        <div className="zoom-controls">
          <button
            className="btn-icon"
            onClick={controls.zoomOut}
            title="Zoom out"
          >
            -
          </button>
          <span className="zoom-label">{zoomPercent}%</span>
          <button
            className="btn-icon"
            onClick={controls.zoomIn}
            title="Zoom in"
          >
            +
          </button>
          <button
            className="btn-icon btn-fit"
            onClick={controls.fitToView}
            title="Fit to view"
          >
            Fit
          </button>
        </div>
      </div>
      <div
        className="preview-viewport"
        onWheel={handlers.onWheel}
        onPointerDown={handlers.onPointerDown}
        onPointerMove={handlers.onPointerMove}
        onPointerUp={handlers.onPointerUp}
      >
        {error ? (
          <p className="error-msg">{error}</p>
        ) : svgHtml ? (
          <div
            className="preview-canvas"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            }}
            dangerouslySetInnerHTML={{ __html: svgHtml }}
          />
        ) : (
          <p className="placeholder">Diagram will appear here</p>
        )}
      </div>
    </div>
  );
}
