export type ModelType = "resnet50" | "cnn";

export type HealthResponse = {
  status: "ok" | "loading";
  models_loaded: string[];
  current_model: ModelType;
};

export type PredictionResponse = {
  model: ModelType;
  prediction: "NORMAL" | "PNEUMONIA";
  probability: number;
  confidence: number;
  threshold: number;
  date: string;
};

export type CurrentModelResponse = {
  current_model: ModelType;
};

export type SwitchModelResponse = {
  message: string;
  current_model: ModelType;
};

export type ReportResponse = {
  savedPath: string;
};
