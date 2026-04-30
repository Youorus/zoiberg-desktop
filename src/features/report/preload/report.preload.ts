import { ipcRenderer } from "electron";
import type { ExportReportInput, ExportReportResult } from "../types/report.types";

export function createReportPreloadApi() {
  return {
    exportPdf: (payload: ExportReportInput): Promise<ExportReportResult> => {
      return ipcRenderer.invoke("report:export-pdf", payload);
    }
  };
}

export type ReportPreloadApi = ReturnType<typeof createReportPreloadApi>;
