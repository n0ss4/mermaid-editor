import React from "react";
import { ZoomIn, ZoomOut, Scan, Maximize, Minimize } from "lucide-react";

interface PreviewPanelProps {
  svgHtml: string;
  error: string;
  zoom: number;
  pan: { x: number; y: number };
  viewportRef: React.RefObject<HTMLDivElement>;
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
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}

export function PreviewPanel({
  svgHtml,
  error,
  zoom,
  pan,
  viewportRef,
  handlers,
  controls,
  isFullscreen,
  toggleFullscreen,
}: PreviewPanelProps) {
  const zoomPercent = Math.round(zoom * 100);

  return (
    <div
      className={`panel preview-panel${isFullscreen ? " preview-fullscreen" : ""}`}
    >
      <div className="panel-header">
        <span className="panel-label">Preview</span>
        <div className="zoom-controls">
          <button
            className="btn-icon"
            onClick={controls.zoomOut}
            title="Zoom out"
          >
            <ZoomOut size={14} />
          </button>
          <span className="zoom-label">{zoomPercent}%</span>
          <button
            className="btn-icon"
            onClick={controls.zoomIn}
            title="Zoom in"
          >
            <ZoomIn size={14} />
          </button>
          <button
            className="btn-icon"
            onClick={controls.fitToView}
            title="Fit to view"
          >
            <Scan size={14} />
          </button>
          <button
            className="btn-icon"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
          </button>
        </div>
      </div>
      <div
        className="preview-viewport"
        ref={viewportRef}
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
