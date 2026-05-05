import { create } from "zustand";
import { PredictionResponse } from "@/lib/api.types";

/**
 * Fichier uploadé (Electron)
 */
export type UploadedFile = {
  path: string;
  name: string;
  size: number;
  type: string;
};

/**
 * Vues de l'application
 */
export type AppView = "home" | "import" | "analysis" | "result";

/**
 * State global de l'application
 */
interface AppState {
  currentView: AppView;

  uploadedFile: UploadedFile | null;
  analysisResult: PredictionResponse | null;

  // Actions
  setView: (view: AppView) => void;
  setUploadedFile: (file: UploadedFile | null) => void;
  setAnalysisResult: (result: PredictionResponse | null) => void;

  // Reset global (très utile)
  reset: () => void;
}

/**
 * Store Zustand
 */
export const useAppStore = create<AppState>((set) => ({
  currentView: "home",

  uploadedFile: null,
  analysisResult: null,

  setView: (view) => set({ currentView: view }),

  setUploadedFile: (file) => set({ uploadedFile: file }),

  setAnalysisResult: (result) => set({ analysisResult: result }),

  reset: () =>
    set({
      currentView: "home",
      uploadedFile: null,
      analysisResult: null,
    }),
}));