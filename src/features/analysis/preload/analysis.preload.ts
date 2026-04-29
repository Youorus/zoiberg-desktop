import { ipcRenderer } from "electron";
import type { AnalyzeImageInput, AnalysisResult } from "../types/analysis.types";

/**
 * API preload du module analysis.
 *
 * Ce fichier contient les fonctions que React pourra appeler via :
 * window.zoiberg.analysis.*
 *
 * Il ne fait pas contextBridge.exposeInMainWorld lui-même.
 * Il exporte seulement un objet qui sera assemblé dans src/preload/index.ts.
 */
export function createAnalysisPreloadApi() {
  return {
    analyzeImage: (image: AnalyzeImageInput): Promise<AnalysisResult> => {
      return ipcRenderer.invoke("analysis:analyze-image", image);
    }
  };
}

export type AnalysisPreloadApi = ReturnType<typeof createAnalysisPreloadApi>;