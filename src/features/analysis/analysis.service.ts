import { apiClient } from "../../shared/api/api.client";
import type { ModelType, PredictionResponse } from "@/lib/api.types";

export const analysisService = {
  predictImage: async (filePath: string): Promise<PredictionResponse> => {
    return apiClient.predict(filePath);
  },

  generateReport: async (comment: string): Promise<Buffer> => {
    return apiClient.generateReport(comment);
  },

  getModel: async () => {
    return apiClient.getModel();
  },

  setModel: async (modelName: ModelType) => {
    return apiClient.switchModel(modelName);
  },
};