import { useCallback } from "react";

export function useFileImport(onImport: (text: string) => void) {
  const handleFile = useCallback(
    async (file: File) => {
      const text = await file.text();
      if (text) onImport(text);
    },
    [onImport]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return { handleDrop, handleFile };
}
