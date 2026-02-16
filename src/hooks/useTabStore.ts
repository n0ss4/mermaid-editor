import { useReducer, useEffect, useRef, useCallback } from "react";
import { SAMPLE } from "../utils/constants";
import type { MermaidTheme } from "../utils/constants";

export interface Tab {
  id: string;
  name: string;
  code: string;
  mermaidTheme: MermaidTheme;
  exportScale: number;
  createdAt: number;
}

interface TabState {
  tabs: Tab[];
  activeTabId: string;
}

type TabAction =
  | { type: "ADD_TAB"; tab?: Partial<Tab> }
  | { type: "CLOSE_TAB"; id: string }
  | { type: "SET_ACTIVE"; id: string }
  | { type: "UPDATE_TAB"; id: string; changes: Partial<Tab> }
  | { type: "RENAME_TAB"; id: string; name: string };

const STORAGE_KEY = "mermaid-editor-tabs";
const MAX_TABS = 20;

function createTab(overrides?: Partial<Tab>): Tab {
  return {
    id: crypto.randomUUID(),
    name: overrides?.name ?? "Untitled",
    code: overrides?.code ?? "",
    mermaidTheme: overrides?.mermaidTheme ?? "default",
    exportScale: overrides?.exportScale ?? 4,
    createdAt: Date.now(),
    ...overrides,
  };
}

function tabReducer(state: TabState, action: TabAction): TabState {
  switch (action.type) {
    case "ADD_TAB": {
      if (state.tabs.length >= MAX_TABS) return state;
      const tab = createTab(action.tab);
      return { tabs: [...state.tabs, tab], activeTabId: tab.id };
    }
    case "CLOSE_TAB": {
      const remaining = state.tabs.filter((t) => t.id !== action.id);
      if (remaining.length === 0) {
        const fresh = createTab();
        return { tabs: [fresh], activeTabId: fresh.id };
      }
      const newActive =
        state.activeTabId === action.id
          ? remaining[Math.min(
              state.tabs.findIndex((t) => t.id === action.id),
              remaining.length - 1
            )].id
          : state.activeTabId;
      return { tabs: remaining, activeTabId: newActive };
    }
    case "SET_ACTIVE":
      return { ...state, activeTabId: action.id };
    case "UPDATE_TAB":
      return {
        ...state,
        tabs: state.tabs.map((t) =>
          t.id === action.id ? { ...t, ...action.changes } : t
        ),
      };
    case "RENAME_TAB":
      return {
        ...state,
        tabs: state.tabs.map((t) =>
          t.id === action.id ? { ...t, name: action.name } : t
        ),
      };
    default:
      return state;
  }
}

function loadState(): TabState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as TabState;
      if (parsed.tabs?.length > 0 && parsed.activeTabId) {
        return parsed;
      }
    }
  } catch {}
  const tab = createTab({ name: "Diagram 1", code: SAMPLE });
  return { tabs: [tab], activeTabId: tab.id };
}

export function useTabStore() {
  const [state, dispatch] = useReducer(tabReducer, null, loadState);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [state]);

  const activeTab = state.tabs.find((t) => t.id === state.activeTabId) ?? state.tabs[0];

  const addTab = useCallback((tab?: Partial<Tab>) => dispatch({ type: "ADD_TAB", tab }), []);
  const closeTab = useCallback((id: string) => dispatch({ type: "CLOSE_TAB", id }), []);
  const setActive = useCallback((id: string) => dispatch({ type: "SET_ACTIVE", id }), []);
  const updateTab = useCallback(
    (id: string, changes: Partial<Tab>) => dispatch({ type: "UPDATE_TAB", id, changes }),
    []
  );
  const renameTab = useCallback(
    (id: string, name: string) => dispatch({ type: "RENAME_TAB", id, name }),
    []
  );

  return {
    tabs: state.tabs,
    activeTabId: state.activeTabId,
    activeTab,
    addTab,
    closeTab,
    setActive,
    updateTab,
    renameTab,
  };
}

// Export for testing
export { tabReducer, createTab, loadState, STORAGE_KEY };
