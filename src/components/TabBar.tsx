import React, { useState, useRef, useCallback } from "react";
import { Plus, X } from "lucide-react";
import type { Tab } from "../hooks/useTabStore";

interface TabBarProps {
  tabs: Tab[];
  activeTabId: string;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
  onAdd: () => void;
  onRename: (id: string, name: string) => void;
}

export function TabBar({ tabs, activeTabId, onSelect, onClose, onAdd, onRename }: TabBarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const editRef = useRef<HTMLSpanElement>(null);

  const handleDoubleClick = useCallback((id: string) => {
    setEditingId(id);
    requestAnimationFrame(() => {
      const el = editRef.current;
      if (el) {
        el.focus();
        const range = document.createRange();
        range.selectNodeContents(el);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    });
  }, []);

  const commitRename = useCallback(
    (id: string) => {
      const el = editRef.current;
      if (el) {
        const name = el.textContent?.trim() || "Untitled";
        onRename(id, name);
      }
      setEditingId(null);
    },
    [onRename]
  );

  return (
    <div className="tab-bar">
      <div className="tab-bar-scroll">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab${tab.id === activeTabId ? " tab-active" : ""}`}
            onClick={() => onSelect(tab.id)}
            onDoubleClick={() => handleDoubleClick(tab.id)}
          >
            {editingId === tab.id ? (
              <span
                ref={editRef}
                className="tab-name"
                contentEditable
                suppressContentEditableWarning
                onBlur={() => commitRename(tab.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    commitRename(tab.id);
                  }
                  if (e.key === "Escape") setEditingId(null);
                }}
              >
                {tab.name}
              </span>
            ) : (
              <span className="tab-name">{tab.name}</span>
            )}
            {tabs.length > 1 && (
              <button
                className="tab-close"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose(tab.id);
                }}
                title="Close tab"
              >
                <X size={12} />
              </button>
            )}
          </div>
        ))}
      </div>
      <button className="tab-add" onClick={onAdd} title="New tab">
        <Plus size={14} />
      </button>
    </div>
  );
}
