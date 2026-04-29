import { dialog, ipcMain } from "electron";
import type { SelectedImage } from "../types/files.types";
import { loadSelectedImage } from "../services/files.service";

export function registerFilesIpc(): void {
  ipcMain.handle("files:select-image", async (): Promise<SelectedImage | null> => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: "Selectionner une image pulmonaire",
      properties: ["openFile"],
      filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg"] }]
    });

    if (canceled || filePaths.length === 0) {
      return null;
    }

    return loadSelectedImage(filePaths[0]);
  });
}
