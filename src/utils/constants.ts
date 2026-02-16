import mermaid from "mermaid";

export const SAMPLE = `gantt
  title Project Timeline
  dateFormat  YYYY-MM-DD
  axisFormat  %d/%m

  section Phase 1
  Research       :2026-03-01, 5d
  Design         :2026-03-06, 5d

  section Phase 2
  Development    :2026-03-11, 10d
  Testing        :2026-03-21, 5d

  section Launch
  Release        :milestone, 2026-03-26, 0d`;

mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  securityLevel: "loose",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
});
