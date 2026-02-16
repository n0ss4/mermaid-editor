import { useCallback, useEffect, useRef } from "react";
import { encodeShareUrl, decodeShareUrl } from "../utils/sharing";

interface ShareState {
  code: string;
  mermaidTheme?: string;
}

export function useShareLink() {
  const share = useCallback((state: ShareState) => {
    const url = encodeShareUrl(state);
    window.history.replaceState(null, "", url);
    navigator.clipboard.writeText(url);
  }, []);

  return { share };
}

export function useInitialShareState(): ShareState | null {
  const ref = useRef<ShareState | null>(null);

  if (ref.current === undefined) {
    ref.current = decodeShareUrl(window.location.href);
  }

  useEffect(() => {
    if (ref.current) {
      const url = new URL(window.location.href);
      url.search = "";
      window.history.replaceState(null, "", url.toString());
    }
  }, []);

  return ref.current;
}
