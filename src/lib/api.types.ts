export type ModelType = "resnet50" | "cnn";

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

export type ZoibergApi = {
  /**
   * Envoie une image pour analyse
   */
  predict: (filePath: string) => Promise<PredictionResponse>;

  /**
   * Change le modèle utilisé par l’API
   */
  setModel: (model: ModelType) => Promise<SwitchModelResponse>;

  /**
   * Récupère le modèle actuellement utilisé
   */
  getModel: () => Promise<CurrentModelResponse>;

  /**
   * Génère un rapport PDF
   */
  generateReport: (comment: string) => Promise<ArrayBuffer>;
};