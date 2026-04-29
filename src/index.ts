import { app, BrowserWindow, shell } from "electron";
import { join } from "path";
import { registerAnalysisIpc } from "@/features/analysis";
import { registerFilesIpc } from "@/features/files";

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,

    minWidth: 720,
    minHeight: 560,

    maxWidth: 1440,
    maxHeight: 960,

    title: "Zoiberg",
    backgroundColor: "#020617",
    show: false,

    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  if (process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

app.whenReady().then(() => {
  registerAnalysisIpc();
  registerFilesIpc();

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
