import type {
  ModelType,
  PredictionResponse,
  HealthResponse,
  CurrentModelResponse,
  SwitchModelResponse,
  ReportResponse,
} from "@/lib/api.types";

declare global {
  interface Window {
    zoiberg: {
      getApiUrl: () => Promise<{ url: string }>;
      setApiUrl: (url: string) => Promise<{ url: string }>;
      health: () => Promise<HealthResponse>;
      predict: (filePath: string) => Promise<PredictionResponse>;
      generateReport: (
        predictionData: PredictionResponse,
        comment: string
      ) => Promise<ReportResponse>;
      getModel: () => Promise<CurrentModelResponse>;
      setModel: (modelName: ModelType) => Promise<SwitchModelResponse>;
    };
  }
}

export {};
