import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import { SAMPLE } from "./utils/constants";
import { useMermaidRenderer } from "./hooks/useMermaidRenderer";
import { useZoomPan } from "./hooks/useZoomPan";
import { DropZone } from "./components/DropZone";
import { Editor } from "./components/Editor";
import { PreviewPanel } from "./components/PreviewPanel";
import { Toolbar } from "./components/Toolbar";
import { pngExporter } from "./export/png";
import { svgExporter } from "./export/svg";
import { clipboardExporter } from "./export/clipboard";

const exporters = [pngExporter, svgExporter, clipboardExporter];

function App() {
  const [code, setCode] = useState(SAMPLE);
  const [exportScale, setExportScale] = useState(4);
  const { svgHtml, error } = useMermaidRenderer(code);
  const { zoom, pan, handlers, controls } = useZoomPan(svgHtml);

  return (
    <>
      <header>
        <h1>Mermaid to PNG</h1>
        <p>Paste or drop a .mmd file, preview live, export high-res PNG</p>
      </header>

      <DropZone onFileImport={setCode} />

      <div className="layout">
        <Editor value={code} onChange={setCode} />
        <PreviewPanel
          svgHtml={svgHtml}
          error={error}
          zoom={zoom}
          pan={pan}
          handlers={handlers}
          controls={controls}
        />
      </div>

      <Toolbar
        exporters={exporters}
        svgHtml={svgHtml}
        exportScale={exportScale}
        onScaleChange={setExportScale}
        onClear={() => setCode("")}
        canExport={!!svgHtml}
      />
    </>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
