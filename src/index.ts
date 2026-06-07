import { app, BrowserWindow, shell } from "electron";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { registerAnalysisIPC } from "./features/analysis/analysis.ipc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow: BrowserWindow | null = null;

const devServerUrl =
  process.env.VITE_DEV_SERVER_URL || process.env.ELECTRON_RENDERER_URL;
const isDev = !!devServerUrl;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 800,
    minHeight: 600,
    title: "Zoidberg 2.0 — Aide au diagnostic pulmonaire",
    backgroundColor: "#F0F4F8",
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: isDev
        ? join(process.cwd(), "src/preload/index.cjs")
        : join(__dirname, "index.mjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  mainWindow.once("ready-to-show", () => {
    if (!mainWindow) return;
    mainWindow.show();
    mainWindow.maximize();
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  if (isDev && devServerUrl) {
    mainWindow.loadURL(devServerUrl);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  registerAnalysisIPC();
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
