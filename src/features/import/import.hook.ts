import { useState } from "react";
import { useAppStore } from "../../shared/store/app.store";

export type ModelType = "resnet50" | "cnn";

export const useImport = () => {
  const setView = useAppStore((s) => s.setView);
  const setUploadedFile = useAppStore((s) => s.setUploadedFile);

  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<ModelType>("resnet50");
  const [selectedFile, setSelectedFile] = useState<(File & { path: string }) | null>(null);
  const [loading, setLoading] = useState(false);

  const validateFile = (file: File & { path: string }) => {
    const validTypes = ["image/png", "image/jpeg", "image/jpg"];

    if (!file) return "Aucun fichier sélectionné.";
    if (!validTypes.includes(file.type)) return "Format non supporté (PNG ou JPG uniquement).";
    if (file.size > 5 * 1024 * 1024) return "Fichier trop volumineux (max 5Mo).";
    if (!file.path) return "Erreur lors de la lecture du fichier.";

    return null;
  };

  const handleFileSelect = (file: File & { path: string }) => {
    setError(null);

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSelectedFile(file);
  };

  const startAnalysis = async () => {
    if (!selectedFile) {
      setError("Veuillez sélectionner une image avant de lancer l’analyse.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (!window.zoiberg?.setModel) {
        throw new Error("API de sélection du modèle indisponible.");
      }

      await window.zoiberg.setModel(selectedModel);

      setUploadedFile({
        path: selectedFile.path,
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
      });

      setView("analysis");
    } catch (e) {
      console.error("Erreur sélection modèle:", e);
      setError("Impossible de sélectionner le modèle.");
    } finally {
      setLoading(false);
    }
  };

  return {
    error,
    loading,
    selectedFile,
    selectedModel,
    setSelectedModel,
    handleFileSelect,
    startAnalysis,
  };
};