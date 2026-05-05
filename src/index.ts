import { app, BrowserWindow, shell } from "electron";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { registerAnalysisIPC } from "./features/analysis/analysis.ipc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow: BrowserWindow | null = null;
const isDev = !!process.env.ELECTRON_RENDERER_URL;
function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 720,
    minHeight: 560,
    title: "Zoidberg 2.0",
    backgroundColor: "#020617",
    show: false,
    autoHideMenuBar: true,

webPreferences: {
  preload: isDev
    ? join(process.cwd(), "src/preload/index.cjs")
    : join(__dirname, "preload/index.js"),
  contextIsolation: true,
  nodeIntegration: false,
  sandbox: false,
}
  });

  mainWindow.once("ready-to-show", () => {
    if (!mainWindow) return;
    mainWindow.show();
    mainWindow.maximize();
    mainWindow.webContents.openDevTools();
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

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  console.log("🚀 Electron main process started");

  registerAnalysisIPC();
  console.log("✅ IPC registered");

  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});