import { ipcMain, dialog } from "electron";
import { readFile } from "fs/promises";

export function registerFilesIpc() {
  ipcMain.handle("files:select-image", async () => {
    const result = await dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg", "webp"] }]
    });

    if (result.canceled || result.filePaths.length === 0) {
      return null;
    }

    const filePath = result.filePaths[0];
    const fileBuffer = await readFile(filePath);
    const base64 = fileBuffer.toString("base64");
    const dataUrl = "data:image/png;base64,";

    return {
      path: filePath,
      name: filePath.split(/[/\\]/).pop() || "image",
      dataUrl: dataUrl
    };
  });
}
