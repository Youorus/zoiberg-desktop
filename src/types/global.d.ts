import type { ZoibergApi } from "@/preload/api.types";

declare global {
  interface Window {
    /**
     * API sécurisée exposée via Electron preload
     * Permet de communiquer avec le main process
     */
    zoiberg: ZoibergApi;
  }
}

export {};