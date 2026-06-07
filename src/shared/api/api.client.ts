import axios from "axios";
import fs from "node:fs";
import FormData from "form-data";
import type { ModelType, PredictionResponse } from "@/lib/api.types";
import { getApiUrl } from "../config/api.store";

const getAPI = () =>
  axios.create({
    baseURL: getApiUrl(),
    timeout: 30000,
  });

export const apiClient = {
  health: async () => {
    const { data } = await getAPI().get("/health");
    return data;
  },

  predict: async (filePath: string): Promise<PredictionResponse> => {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));
    const { data } = await getAPI().post("/predict", formData, {
      headers: formData.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      timeout: 60000,
    });
    return data;
  },

  switchModel: async (model: ModelType) => {
    const { data } = await getAPI().post("/model", { model_name: model });
    return data;
  },

  getModel: async () => {
    const { data } = await getAPI().get("/model");
    return data;
  },

  generateReport: async (
    predictionData: PredictionResponse,
    comment: string
  ): Promise<Buffer> => {
    const { data } = await getAPI().post(
      "/report",
      { prediction_data: predictionData, comment },
      { responseType: "arraybuffer" }
    );
    return Buffer.from(data);
  },
};
