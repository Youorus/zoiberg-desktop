export type ModelType = "cnn" | "resnet50" | "vit";

export interface PredictionResponse {
  model: ModelType;
  prediction: "NORMAL" | "PNEUMONIA";
  probability: number;
  confidence: number;
  threshold: number;
  date: string;
}
