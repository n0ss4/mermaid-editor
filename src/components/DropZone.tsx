import React, { useRef } from "react";
import { useFileImport } from "../hooks/useFileImport";

interface DropZoneProps {
  onFileImport: (text: string) => void;
}

export function DropZone({ onFileImport }: DropZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { handleDrop, handleFile } = useFileImport(onFileImport);

  return (
    <div
      className="drop-zone"
      role="button"
      tabIndex={0}
      onClick={() => fileInputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.currentTarget.classList.add("active");
      }}
      onDragLeave={(e) => e.currentTarget.classList.remove("active")}
      onDrop={(e) => {
        e.currentTarget.classList.remove("active");
        handleDrop(e);
      }}
    >
      <p>
        Drop a <strong>.mmd</strong> file here or <span>browse</span>
      </p>
      <input
        ref={fileInputRef}
        type="file"
        accept=".mmd,.mermaid,.md,.txt"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
    </div>
  );
}
