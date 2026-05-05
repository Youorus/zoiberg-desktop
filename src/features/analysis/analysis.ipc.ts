import { ipcMain } from "electron";
import { analysisService } from "./analysis.service";
import type { ModelType } from "@/lib/api.types";

export const registerAnalysisIPC = () => {
  ipcMain.handle("api:predict", async (_, filePath: string) => {
    console.log("🔥 IPC predict reçu:", filePath);
    return analysisService.predictImage(filePath);
  });

  ipcMain.handle("api:generateReport", async (_, comment: string) => {
    console.log("📄 IPC generateReport reçu");
    return analysisService.generateReport(comment);
  });

  ipcMain.handle("api:getModel", async () => {
    console.log("🧠 IPC getModel reçu");
    return analysisService.getModel();
  });

  ipcMain.handle("api:setModel", async (_, modelName: ModelType) => {
    console.log("🔁 IPC setModel reçu:", modelName);
    return analysisService.setModel(modelName);
  });
};