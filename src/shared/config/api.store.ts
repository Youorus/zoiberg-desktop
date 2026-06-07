import Store from "electron-store";

const store = new Store<{ apiUrl: string }>({
  defaults: {
    apiUrl: process.env.VITE_MODEL_API_URL || "http://localhost:8000",
  },
});

export const getApiUrl = (): string => store.get("apiUrl");
export const setApiUrl = (url: string): void => store.set("apiUrl", url);
