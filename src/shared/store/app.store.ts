import { create } from "zustand";
import type { PredictionResponse, ModelType } from "@/lib/api.types";

export type UploadedFile = {
  path: string;
  name: string;
  size: number;
  type: string;
};

export type AppView = "home" | "import" | "analysis" | "result";
export type ApiStatus = "idle" | "checking" | "ok" | "error";

interface AppState {
  currentView: AppView;
  uploadedFile: UploadedFile | null;
  analysisResult: PredictionResponse | null;
  selectedModel: ModelType;
  apiStatus: ApiStatus;
  apiUrl: string;

  setView: (view: AppView) => void;
  setUploadedFile: (file: UploadedFile | null) => void;
  setAnalysisResult: (result: PredictionResponse | null) => void;
  setSelectedModel: (model: ModelType) => void;
  setApiStatus: (status: ApiStatus) => void;
  setApiUrl: (url: string) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentView: "home",
  uploadedFile: null,
  analysisResult: null,
  selectedModel: "resnet50",
  apiStatus: "idle",
  apiUrl: "http://localhost:8000",

  setView: (view) => set({ currentView: view }),
  setUploadedFile: (file) => set({ uploadedFile: file }),
  setAnalysisResult: (result) => set({ analysisResult: result }),
  setSelectedModel: (model) => set({ selectedModel: model }),
  setApiStatus: (status) => set({ apiStatus: status }),
  setApiUrl: (url) => set({ apiUrl: url }),

  reset: () =>
    set({
      currentView: "home",
      uploadedFile: null,
      analysisResult: null,
    }),
}));
