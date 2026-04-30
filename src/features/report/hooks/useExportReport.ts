import { useMutation } from "@tanstack/react-query";
import type { ExportReportInput, ExportReportResult } from "../types/report.types";

export function useExportReport() {
  return useMutation<ExportReportResult, Error, ExportReportInput>({
    mutationFn: async (payload) => window.zoiberg.report.exportPdf(payload)
  });
}
