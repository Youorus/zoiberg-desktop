import { ipcMain, app } from "electron";
import path from "node:path";
import fs from "node:fs";
import { analysisService } from "./analysis.service";
import { getApiUrl, setApiUrl } from "../../shared/config/api.store";
import type { ModelType, PredictionResponse } from "@/lib/api.types";

export const registerAnalysisIPC = () => {
  ipcMain.handle("api:getUrl", () => ({ url: getApiUrl() }));

  ipcMain.handle("api:setUrl", (_, url: string) => {
    setApiUrl(url.trim());
    return { url: getApiUrl() };
  });

  ipcMain.handle("api:health", async () => {
    return analysisService.health();
  });

  ipcMain.handle("api:predict", async (_, filePath: string) => {
    return analysisService.predictImage(filePath);
  });

  ipcMain.handle(
    "api:generateReport",
    async (_, predictionData: PredictionResponse, comment: string) => {
      const buffer = await analysisService.generateReport(predictionData, comment);
      const docPath = app.getPath("documents");
      const fileName = `Rapport_Pneumonie_${Date.now()}.pdf`;
      const filePath = path.join(docPath, fileName);
      fs.writeFileSync(filePath, buffer);
      return { savedPath: filePath };
    }
  );

  ipcMain.handle("api:getModel", async () => {
    return analysisService.getModel();
  });

  ipcMain.handle("api:setModel", async (_, modelName: ModelType) => {
    return analysisService.setModel(modelName);
  });
};
