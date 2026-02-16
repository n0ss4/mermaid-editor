import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";

interface ShareState {
  code: string;
  mermaidTheme?: string;
}

export function encodeShareUrl(state: ShareState): string {
  const data = JSON.stringify(state);
  const compressed = compressToEncodedURIComponent(data);
  const url = new URL(window.location.href);
  url.search = "";
  url.searchParams.set("d", compressed);
  return url.toString();
}

export function decodeShareUrl(url: string): ShareState | null {
  try {
    const parsed = new URL(url);
    const d = parsed.searchParams.get("d");
    if (!d) return null;
    const json = decompressFromEncodedURIComponent(d);
    if (!json) return null;
    const state = JSON.parse(json);
    if (!state || typeof state.code !== "string") return null;
    return state;
  } catch {
    return null;
  }
}
