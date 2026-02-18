import { useState } from "react";
import { useEditorVM } from "../viewmodels";
import { CodeEditor } from "./CodeEditor";
import { SyntaxReference } from "./SyntaxReference";
import { OutlinePanel } from "./OutlinePanel";

export function EditorPanel() {
  const { code, setCode, error, diagramType, parsedElements } = useEditorVM();
  const [showOutline, setShowOutline] = useState(false);

  return (
    <div className="editor-column">
      <CodeEditor value={code} onChange={setCode} error={error} />
      {showOutline ? (
        <div className="syntax-ref">
          <button
            className="syntax-ref-toggle"
            onClick={() => setShowOutline(false)}
          >
            <span>Outline</span>
          </button>
          <OutlinePanel elements={parsedElements} />
        </div>
      ) : (
        <SyntaxReference
          diagramType={diagramType}
          parsedElements={parsedElements}
          onToggleOutline={() => setShowOutline(true)}
        />
      )}
    </div>
  );
}
