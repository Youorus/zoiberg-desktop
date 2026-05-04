import { ipcRenderer } from "electron";

export const createFilesPreloadApi = () => ({
  selectImage: () => ipcRenderer.invoke("files:select-image")
});
