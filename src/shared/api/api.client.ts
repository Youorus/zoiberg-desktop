import axios from "axios";
import fs from "node:fs";
import FormData from "form-data";
import type { ModelType, PredictionResponse } from "@/lib/api.types";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const apiClient = {
  predict: async (filePath: string): Promise<PredictionResponse> => {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));

    const { data } = await API.post("/predict", formData, {
      headers: formData.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    return data;
  },

  switchModel: async (model: ModelType) => {
    const { data } = await API.post("/model", model, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return data;
  },

  getModel: async () => {
    const { data } = await API.get("/model");
    return data;
  },

  generateReport: async (comment: string): Promise<Buffer> => {
    const { data } = await API.post("/report", comment, {
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "arraybuffer",
    });

    return Buffer.from(data);
  },
};