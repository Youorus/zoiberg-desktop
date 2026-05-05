const { contextBridge, ipcRenderer } = require("electron");

console.log("✅ Preload Zoidberg chargé");

contextBridge.exposeInMainWorld("zoiberg", {
  predict: (filePath) => {
    console.log("📤 Preload predict:", filePath);
    return ipcRenderer.invoke("api:predict", filePath);
  },

  generateReport: (comment) => {
    console.log("📄 Preload generateReport:", comment);
    return ipcRenderer.invoke("api:generateReport", comment);
  },

  getModel: () => {
    console.log("🧠 Preload getModel");
    return ipcRenderer.invoke("api:getModel");
  },

  setModel: (modelName) => {
    console.log("🔁 Preload setModel:", modelName);
    return ipcRenderer.invoke("api:setModel", modelName);
  },
});