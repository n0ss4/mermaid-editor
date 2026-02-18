import type { IDiagramDocumentService } from "./interfaces";
import {
  parseFlowchart,
  serializeFlowchart,
  validateFlowchartDocument,
  type DiagramDocument,
  type ParseResult,
  type ValidationIssue,
} from "../domain/diagram";

export class DiagramDocumentService implements IDiagramDocumentService {
  parseFlowchart(code: string): ParseResult {
    return parseFlowchart(code);
  }

  serializeFlowchart(doc: DiagramDocument): string {
    return serializeFlowchart(doc);
  }

  validate(doc: DiagramDocument): ValidationIssue[] {
    return validateFlowchartDocument(doc);
  }
}
