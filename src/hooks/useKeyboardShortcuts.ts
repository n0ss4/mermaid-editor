import { useEffect } from "react";
import type { ExportOptions } from "../export/types";
import { pngExporter } from "../export/png";

interface ShortcutHandlers {
  onNewTab: () => void;
  onCloseTab: () => void;
  onPrevTab: () => void;
  onNextTab: () => void;
  getExportOptions: () => ExportOptions | null;
}

export function useKeyboardShortcuts({
  onNewTab,
  onCloseTab,
  onPrevTab,
  onNextTab,
  getExportOptions,
}: ShortcutHandlers) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;

      if (e.key === "s") {
        e.preventDefault();
        const opts = getExportOptions();
        if (opts) pngExporter.export(opts);
        return;
      }

      if (e.key === "n") {
        e.preventDefault();
        onNewTab();
        return;
      }

      if (e.key === "w") {
        e.preventDefault();
        onCloseTab();
        return;
      }

      if (e.shiftKey && e.key === "[") {
        e.preventDefault();
        onPrevTab();
        return;
      }

      if (e.shiftKey && e.key === "]") {
        e.preventDefault();
        onNextTab();
        return;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onNewTab, onCloseTab, onPrevTab, onNextTab, getExportOptions]);
}
