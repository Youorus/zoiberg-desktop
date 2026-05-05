import { useState } from "react";
import { useAppStore } from "../../shared/store/app.store";
import type { ModelType } from "@/lib/api.types";

export const useResult = () => {
  const result = useAppStore((s) => s.analysisResult);
  const uploadedFile = useAppStore((s) => s.uploadedFile);
  const setView = useAppStore((s) => s.setView);
  const setAnalysisResult = useAppStore((s) => s.setAnalysisResult);
  const reset = useAppStore((s) => s.reset);

  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelType>(
    result?.model ?? "resnet50"
  );
  const [error, setError] = useState<string | null>(null);

  const exportReport = async (comment: string) => {
    if (!window.zoiberg?.generateReport) {
      setError("Export PDF indisponible.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const buffer = await window.zoiberg.generateReport(comment);

      const blob = new Blob([buffer], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `rapport-zoidberg-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erreur export PDF:", err);
      setError("Impossible de générer le rapport PDF.");
    } finally {
      setLoading(false);
    }
  };

  const goBackToImport = () => {
    setView("import");
  };

  const restartAnalysis = async () => {
    if (!uploadedFile) {
      setError("Aucun fichier disponible pour relancer l’analyse.");
      return;
    }

    if (!window.zoiberg?.setModel) {
      setError("Changement de modèle indisponible.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await window.zoiberg.setModel(selectedModel);

      // On vide l'ancien résultat pour éviter d’afficher l’ancien état.
      setAnalysisResult(null);

      // La vue Analysis va relancer useAnalysis avec le fichier déjà stocké.
      setView("analysis");
    } catch (err) {
      console.error("Erreur relance analyse:", err);
      setError("Impossible de relancer l’analyse avec ce modèle.");
    } finally {
      setLoading(false);
    }
  };

  const startNewAnalysis = () => {
    reset();
    setView("import");
  };

  return {
    result,
    uploadedFile,
    loading,
    error,
    selectedModel,
    setSelectedModel,
    exportReport,
    goBackToImport,
    restartAnalysis,
    startNewAnalysis,
  };
};