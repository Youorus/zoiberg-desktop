import { contextBridge, ipcRenderer } from "electron";
import type { ModelType, PredictionResponse } from "@/lib/api.types";

contextBridge.exposeInMainWorld("zoiberg", {
  getApiUrl: () =>
    ipcRenderer.invoke("api:getUrl"),

  setApiUrl: (url: string) =>
    ipcRenderer.invoke("api:setUrl", url),

  health: () =>
    ipcRenderer.invoke("api:health"),

  predict: (filePath: string) =>
    ipcRenderer.invoke("api:predict", filePath),

  generateReport: (predictionData: PredictionResponse, comment: string) =>
    ipcRenderer.invoke("api:generateReport", predictionData, comment),

  getModel: () =>
    ipcRenderer.invoke("api:getModel"),

  setModel: (modelName: ModelType) =>
    ipcRenderer.invoke("api:setModel", modelName),
});
