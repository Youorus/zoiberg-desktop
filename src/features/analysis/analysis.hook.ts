import { useEffect, useState } from "react";
import { useAppStore } from "../../shared/store/app.store";

export const useAnalysis = () => {
  const { uploadedFile, setAnalysisResult, setView } = useAppStore();
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uploadedFile) return;

    if (!window.zoiberg?.predict) {
      setError("API Electron non disponible. Vérifiez la connexion.");
      return;
    }

    let isMounted = true;
    let interval: ReturnType<typeof setInterval>;

    const runAnalysis = async () => {
      try {
        setError(null);
        setProgress(5);

        interval = setInterval(() => {
          setProgress((prev) => (prev >= 90 ? prev : prev + Math.random() * 8));
        }, 300);

        const result = await window.zoiberg.predict(uploadedFile.path);

        if (!isMounted) return;
        clearInterval(interval);
        setProgress(100);
        setAnalysisResult(result);

        setTimeout(() => {
          if (isMounted) setView("result");
        }, 500);
      } catch (e) {
        if (!isMounted) return;
        clearInterval(interval);
        const msg = e instanceof Error ? e.message : String(e);
        if (msg.includes("timeout")) {
          setError("L'analyse a expiré (timeout). Le serveur est peut-être surchargé.");
        } else if (msg.includes("Network") || msg.includes("ECONNREFUSED")) {
          setError("Connexion au serveur d'IA impossible. Vérifiez que l'API est démarrée.");
        } else {
          setError("Une erreur est survenue pendant l'analyse. Vérifiez l'image et réessayez.");
        }
      }
    };

    runAnalysis();

    return () => {
      isMounted = false;
      if (interval) clearInterval(interval);
    };
  }, [uploadedFile, setAnalysisResult, setView]);

  return { progress, error };
};
