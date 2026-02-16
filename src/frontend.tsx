import React, { useState, useCallback, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { LayoutGrid, Share2 } from "lucide-react";
import "./style.css";
import type { MermaidTheme } from "./utils/constants";
import { detectDiagramType } from "./utils/detectDiagramType";
import { useMermaidRenderer } from "./hooks/useMermaidRenderer";
import { useZoomPan } from "./hooks/useZoomPan";
import { useThemeProvider, ThemeContext, useTheme } from "./hooks/useTheme";
import { useFullscreen } from "./hooks/useFullscreen";
import { useShareLink, useInitialShareState } from "./hooks/useShareLink";
import { useTabStore } from "./hooks/useTabStore";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { CodeEditor } from "./components/CodeEditor";
import { PreviewPanel } from "./components/PreviewPanel";
import { TabBar } from "./components/TabBar";
import { ExportDropdown } from "./components/ExportDropdown";
import { ResizeHandle } from "./components/ResizeHandle";
import { ThemeToggle } from "./components/ThemeToggle";
import { TemplateGallery } from "./components/TemplateGallery";
import { SyntaxReference } from "./components/SyntaxReference";
import { pngExporter } from "./export/png";
import { svgExporter } from "./export/svg";
import { clipboardExporter } from "./export/clipboard";
import { clipboardSvgExporter } from "./export/clipboard-svg";

const exporters = [pngExporter, svgExporter, clipboardExporter, clipboardSvgExporter];

function AppInner() {
  const shared = useInitialShareState();
  const {
    tabs, activeTabId, activeTab,
    addTab, closeTab, setActive, updateTab, renameTab,
  } = useTabStore();

  const [showTemplates, setShowTemplates] = useState(false);
  const [splitFraction, setSplitFraction] = useState(0.42);
  const sharedApplied = useRef(false);

  useEffect(() => {
    if (shared && !sharedApplied.current) {
      sharedApplied.current = true;
      updateTab(activeTabId, {
        code: shared.code,
        ...(shared.mermaidTheme ? { mermaidTheme: shared.mermaidTheme as MermaidTheme } : {}),
      });
    }
  }, [shared, activeTabId, updateTab]);

  const code = activeTab.code;
  const exportScale = activeTab.exportScale;
  const mermaidTheme = activeTab.mermaidTheme;

  const setCode = useCallback(
    (c: string) => updateTab(activeTabId, { code: c }),
    [activeTabId, updateTab]
  );
  const setExportScale = useCallback(
    (s: number) => updateTab(activeTabId, { exportScale: s }),
    [activeTabId, updateTab]
  );
  const setMermaidTheme = useCallback(
    (t: MermaidTheme) => updateTab(activeTabId, { mermaidTheme: t }),
    [activeTabId, updateTab]
  );

  const { svgHtml, error } = useMermaidRenderer(code, mermaidTheme);
  const { zoom, pan, viewportRef, handlers, controls } = useZoomPan(svgHtml);
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const { share } = useShareLink();

  const diagramType = detectDiagramType(code);

  const handleShare = () => {
    share({ code, mermaidTheme });
  };

  const handleTemplateSelect = useCallback(
    (templateCode: string) => {
      setCode(templateCode);
    },
    [setCode]
  );

  const handleNewTab = useCallback(() => addTab(), [addTab]);
  const handleCloseTab = useCallback(
    () => closeTab(activeTabId),
    [closeTab, activeTabId]
  );
  const handlePrevTab = useCallback(() => {
    const idx = tabs.findIndex((t) => t.id === activeTabId);
    if (idx > 0) setActive(tabs[idx - 1].id);
  }, [tabs, activeTabId, setActive]);
  const handleNextTab = useCallback(() => {
    const idx = tabs.findIndex((t) => t.id === activeTabId);
    if (idx < tabs.length - 1) setActive(tabs[idx + 1].id);
  }, [tabs, activeTabId, setActive]);
  const getExportOptions = useCallback(() => {
    if (!svgHtml) return null;
    return { svgHtml, scale: exportScale };
  }, [svgHtml, exportScale]);

  useKeyboardShortcuts({
    onNewTab: handleNewTab,
    onCloseTab: handleCloseTab,
    onPrevTab: handlePrevTab,
    onNextTab: handleNextTab,
    getExportOptions,
  });

  const gridColumns = `${splitFraction}fr 6px ${1 - splitFraction}fr`;

  return (
    <>
      <header className="app-header">
        <h1>Mermaid Editor</h1>
        <div className="header-controls">
          <button
            className="btn-secondary btn-sm"
            onClick={() => setShowTemplates(true)}
          >
            <LayoutGrid size={14} /> Templates
          </button>
          <button className="btn-secondary btn-sm" onClick={handleShare}>
            <Share2 size={14} /> Share
          </button>
          <ExportDropdown
            exporters={exporters}
            svgHtml={svgHtml}
            exportScale={exportScale}
            onScaleChange={setExportScale}
            canExport={!!svgHtml}
            mermaidTheme={mermaidTheme}
            onMermaidThemeChange={setMermaidTheme}
          />
          <ThemeToggle />
        </div>
      </header>

      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        onSelect={setActive}
        onClose={closeTab}
        onAdd={handleNewTab}
        onRename={renameTab}
      />

      <div className="layout" style={{ gridTemplateColumns: gridColumns }}>
        <div className="editor-column">
          <CodeEditor value={code} onChange={setCode} error={error} />
          <SyntaxReference diagramType={diagramType} />
        </div>
        <ResizeHandle onResize={setSplitFraction} />
        <PreviewPanel
          svgHtml={svgHtml}
          error={error}
          zoom={zoom}
          pan={pan}
          viewportRef={viewportRef}
          handlers={handlers}
          controls={controls}
          isFullscreen={isFullscreen}
          toggleFullscreen={toggleFullscreen}
        />
      </div>

      {showTemplates && (
        <TemplateGallery
          onSelect={handleTemplateSelect}
          onClose={() => setShowTemplates(false)}
        />
      )}
    </>
  );
}

function App() {
  const themeCtx = useThemeProvider();

  return (
    <ThemeContext.Provider value={themeCtx}>
      <AppInner />
    </ThemeContext.Provider>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
