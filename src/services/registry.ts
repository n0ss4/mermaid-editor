import type {
  IStorageService,
  IRenderService,
  IShareService,
  IExportService,
  IFileService,
  IClipboardService,
  IHistoryService,
  ICustomTemplateService,
} from "./interfaces";
import { StorageService } from "./StorageService";
import { MermaidRenderService } from "./MermaidRenderService";
import { ShareService } from "./ShareService";
import { ExportService } from "./ExportService";
import { FileService } from "./FileService";
import { ClipboardService } from "./ClipboardService";
import { HistoryService } from "./HistoryService";
import { CustomTemplateService } from "./CustomTemplateService";

export interface ServiceRegistry {
  storage: IStorageService;
  render: IRenderService;
  share: IShareService;
  export: IExportService;
  file: IFileService;
  clipboard: IClipboardService;
  history: IHistoryService;
  customTemplates: ICustomTemplateService;
}

export function createServiceRegistry(): ServiceRegistry {
  return {
    storage: new StorageService(),
    render: new MermaidRenderService(),
    share: new ShareService(),
    export: new ExportService(),
    file: new FileService(),
    clipboard: new ClipboardService(),
    history: new HistoryService(),
    customTemplates: new CustomTemplateService(),
  };
}
