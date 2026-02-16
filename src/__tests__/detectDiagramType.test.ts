import { test, expect, describe } from "bun:test";
import { detectDiagramType } from "../utils/detectDiagramType";

describe("detectDiagramType", () => {
  test("detects flowchart", () => {
    expect(detectDiagramType("flowchart TD\n  A --> B")).toBe("flowchart");
  });

  test("detects graph as flowchart", () => {
    expect(detectDiagramType("graph LR\n  A --> B")).toBe("flowchart");
  });

  test("detects sequence diagram", () => {
    expect(detectDiagramType("sequenceDiagram\n  Alice->>Bob: Hi")).toBe("sequence");
  });

  test("detects class diagram", () => {
    expect(detectDiagramType("classDiagram\n  class Animal")).toBe("class");
  });

  test("detects state diagram", () => {
    expect(detectDiagramType("stateDiagram-v2\n  [*] --> Idle")).toBe("state");
  });

  test("detects ER diagram", () => {
    expect(detectDiagramType("erDiagram\n  CUSTOMER ||--o{ ORDER : places")).toBe("er");
  });

  test("detects gantt", () => {
    expect(detectDiagramType("gantt\n  title Plan")).toBe("gantt");
  });

  test("detects pie chart", () => {
    expect(detectDiagramType('pie title Share\n  "A" : 50')).toBe("pie");
  });

  test("detects git graph", () => {
    expect(detectDiagramType("gitGraph\n  commit")).toBe("git");
  });

  test("detects mindmap", () => {
    expect(detectDiagramType("mindmap\n  root((Topic))")).toBe("mindmap");
  });

  test("detects timeline", () => {
    expect(detectDiagramType("timeline\n  2023 : Event")).toBe("timeline");
  });

  test("skips comments", () => {
    expect(detectDiagramType("%% this is a comment\nflowchart TD")).toBe("flowchart");
  });

  test("skips whitespace lines", () => {
    expect(detectDiagramType("  \n\n  gantt\n  title Plan")).toBe("gantt");
  });

  test("returns unknown for unrecognized input", () => {
    expect(detectDiagramType("hello world")).toBe("unknown");
  });

  test("returns unknown for empty input", () => {
    expect(detectDiagramType("")).toBe("unknown");
  });

  test("returns unknown for only comments", () => {
    expect(detectDiagramType("%% just a comment")).toBe("unknown");
  });
});
