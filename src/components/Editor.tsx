import React from "react";

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function Editor({ value, onChange }: EditorProps) {
  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-label">Editor</span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        placeholder="Paste mermaid syntax here..."
      />
    </div>
  );
}
