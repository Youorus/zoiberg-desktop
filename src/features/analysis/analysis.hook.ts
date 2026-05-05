import { useEffect, useState } from "react";
import { useAppStore } from "../../shared/store/app.store";

export const useAnalysis = () => {
  const { uploadedFile, setAnalysisResult, setView } = useAppStore();
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("🔥 useAnalysis déclenché");
    console.log("📁 uploadedFile:", uploadedFile);
    console.log("🧠 window.zoiberg:", window.zoiberg);

    if (!uploadedFile) {
      console.warn("⚠️ Aucun fichier uploadé, arrêt de l’analyse");
      return;
    }

    if (!window.zoiberg?.predict) {
      console.error("❌ window.zoiberg.predict est introuvable");
      setError("API Electron indisponible.");
      return;
    }

    let isMounted = true;
    let interval: ReturnType<typeof setInterval>;

    const runAnalysis = async () => {
      try {
        setError(null);
        setProgress(0);

        console.log("⏳ Démarrage simulation de progression");

        interval = setInterval(() => {
          setProgress((prev) => {
            const next = prev >= 90 ? prev : prev + 5;
            console.log("📊 Progression:", next);
            return next;
          });
        }, 200);

        console.log("📤 Appel IPC predict avec fichier:", uploadedFile.path);

        const result = await window.zoiberg.predict(uploadedFile.path);

        console.log("📥 Résultat reçu depuis API:", result);

        if (!isMounted) return;

        clearInterval(interval);

        setProgress(100);
        setAnalysisResult(result);

        console.log("✅ Analyse terminée, redirection vers result");

        setTimeout(() => {
          if (isMounted) setView("result");
        }, 400);
      } catch (e) {
        console.error("❌ Erreur analyse:", e);

        if (!isMounted) return;

        clearInterval(interval);

        setError("Une erreur est survenue pendant l’analyse.");
      }
    };

    runAnalysis();

    return () => {
      console.log("🧹 Nettoyage useAnalysis");
      isMounted = false;
      if (interval) clearInterval(interval);
    };
  }, [uploadedFile, setAnalysisResult, setView]);

  return { progress, error };
};