import { ipcRenderer } from "electron";
import type { SelectedImage } from "../types/files.types";

export function createFilesPreloadApi() {
  return {
    selectImage: (): Promise<SelectedImage | null> => {
      return ipcRenderer.invoke("files:select-image");
    }
  };
}

export type FilesPreloadApi = ReturnType<typeof createFilesPreloadApi>;
