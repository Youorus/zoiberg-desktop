import { apiClient } from "../../shared/api/api.client";
import type { ModelType, PredictionResponse } from "@/lib/api.types";

export const analysisService = {
  health: async () => apiClient.health(),

  predictImage: async (filePath: string): Promise<PredictionResponse> =>
    apiClient.predict(filePath),

  generateReport: async (
    predictionData: PredictionResponse,
    comment: string
  ): Promise<Buffer> => apiClient.generateReport(predictionData, comment),

  getModel: async () => apiClient.getModel(),

  setModel: async (modelName: ModelType) => apiClient.switchModel(modelName),
};
