import type { IShareService } from "./interfaces";
import type { ShareState } from "../models";
import { encodeShareUrl, decodeShareUrl } from "../utils/sharing";

export class ShareService implements IShareService {
  encodeAndApply(state: ShareState): string {
    const url = encodeShareUrl(state);
    globalThis.history.replaceState(null, "", url);
    return url;
  }

  decodeFromUrl(url: string): ShareState | null {
    return decodeShareUrl(url);
  }

  clearUrlParams(): void {
    const url = new URL(globalThis.location.href);
    url.search = "";
    globalThis.history.replaceState(null, "", url.toString());
  }
}
