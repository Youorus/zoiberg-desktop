import { useState } from "react";
import { useAppStore } from "../../shared/store/app.store";
import type { ModelType } from "@/lib/api.types";

export type { ModelType };

export const useImport = () => {
  const setView = useAppStore((s) => s.setView);
  const setUploadedFile = useAppStore((s) => s.setUploadedFile);
  const selectedModel = useAppStore((s) => s.selectedModel);
  const setSelectedModel = useAppStore((s) => s.setSelectedModel);

  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<(File & { path: string }) | null>(null);
  const [loading, setLoading] = useState(false);

  const validateFile = (file: File & { path: string }): string | null => {
    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!file) return "Aucun fichier sélectionné.";
    if (!validTypes.includes(file.type)) return "Format non supporté (PNG ou JPG uniquement).";
    if (file.size > 5 * 1024 * 1024) return "Fichier trop volumineux (max 5 Mo).";
    if (!file.path) return "Impossible de lire le chemin du fichier.";
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
      setError("Veuillez sélectionner une image avant de lancer l'analyse.");
      return;
    }

    if (!window.zoiberg?.setModel) {
      setError("L'API Electron n'est pas disponible.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
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
      setError("Impossible de sélectionner le modèle. Vérifiez la connexion à l'API.");
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
