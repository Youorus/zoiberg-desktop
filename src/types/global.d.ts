import type { ZoibergApi } from "@/preload/api.types";

declare global {
  interface Window {
    zoiberg: ZoibergApi;
  }
}

export {};