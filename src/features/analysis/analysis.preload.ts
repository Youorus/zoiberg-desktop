import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("zoiberg", {
  predict: (filePath: string) =>
    ipcRenderer.invoke("api:predict", filePath),

  generateReport: (comment: string) =>
    ipcRenderer.invoke("api:generateReport", comment),
});