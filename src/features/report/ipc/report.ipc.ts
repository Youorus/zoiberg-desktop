import { ipcMain } from "electron";
import { exportReportInputSchema } from "../schemas/report.schema";
import { exportReportPdf } from "../services/report.service";

export function registerReportIpc(): void {
  ipcMain.handle("report:export-pdf", async (_event, input) => {
    const payload = exportReportInputSchema.parse(input);
    return exportReportPdf(payload);
  });
}
