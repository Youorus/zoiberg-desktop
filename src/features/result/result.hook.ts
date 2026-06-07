import { useState } from "react";
import { toast } from "sonner";
import { useAppStore } from "../../shared/store/app.store";

export const useResult = () => {
  const result = useAppStore((s) => s.analysisResult);
  const uploadedFile = useAppStore((s) => s.uploadedFile);
  const setView = useAppStore((s) => s.setView);
  const setAnalysisResult = useAppStore((s) => s.setAnalysisResult);
  const selectedModel = useAppStore((s) => s.selectedModel);
  const setSelectedModel = useAppStore((s) => s.setSelectedModel);
  const reset = useAppStore((s) => s.reset);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportReport = async (comment: string) => {
    if (!result) {
      setError("Aucun résultat disponible pour générer le rapport.");
      return;
    }

    if (!window.zoiberg?.generateReport) {
      setError("Export PDF indisponible.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await window.zoiberg.generateReport(result, comment);
      toast.success(`Rapport enregistré`, {
        description: response.savedPath,
        duration: 6000,
      });
    } catch (err) {
      console.error("Erreur export PDF:", err);
      setError("Impossible de générer le rapport PDF. Vérifiez la connexion à l'API.");
    } finally {
      setLoading(false);
    }
  };

  const goBackToImport = () => setView("import");

  const restartAnalysis = async () => {
    if (!uploadedFile) {
      setError("Aucun fichier disponible pour relancer l'analyse.");
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
      setAnalysisResult(null);
      setView("analysis");
    } catch (err) {
      console.error("Erreur relance analyse:", err);
      setError("Impossible de relancer l'analyse avec ce modèle.");
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
