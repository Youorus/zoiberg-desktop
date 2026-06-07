import { useEffect, useCallback } from "react";
import { useAppStore } from "./shared/store/app.store";
import { ImportUI } from "./features/import/import.ui";
import { AnalysisUI } from "./features/analysis/analysis.ui";
import { ResultUI } from "./features/result/result.ui";
import { HomePage } from "@/features/home/HomePage";
import { Toaster } from "@/components/ui/sonner";
import { AppHeader } from "@/components/AppHeader";

export default function App() {
  const currentView = useAppStore((s) => s.currentView);
  const setView = useAppStore((s) => s.setView);
  const setApiStatus = useAppStore((s) => s.setApiStatus);
  const setApiUrl = useAppStore((s) => s.setApiUrl);

  const runHealthCheck = useCallback(async () => {
    if (!window.zoiberg?.health) {
      setApiStatus("error");
      return;
    }
    setApiStatus("checking");
    try {
      const health = await window.zoiberg.health();
      setApiStatus(health.status === "ok" ? "ok" : "error");
    } catch {
      setApiStatus("error");
    }
  }, [setApiStatus]);

  useEffect(() => {
    const init = async () => {
      if (!window.zoiberg?.getApiUrl) return;
      try {
        const { url } = await window.zoiberg.getApiUrl();
        setApiUrl(url);
      } catch {
        // keep default
      }
      await runHealthCheck();
    };

    const timer = setTimeout(init, 200);
    return () => clearTimeout(timer);
  }, [setApiUrl, runHealthCheck]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AppHeader />

      <main className="flex flex-1 flex-col">
        {currentView === "home" && (
          <HomePage onStart={() => setView("import")} onRecheck={runHealthCheck} />
        )}
        {currentView === "import" && <ImportUI />}
        {currentView === "analysis" && <AnalysisUI />}
        {currentView === "result" && <ResultUI />}
      </main>

      <Toaster position="bottom-right" richColors />
    </div>
  );
}
