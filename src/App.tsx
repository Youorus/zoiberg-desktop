import { useAppStore } from "./shared/store/app.store";
import { ImportUI } from "./features/import/import.ui";
import { AnalysisUI } from "./features/analysis/analysis.ui";
import { ResultUI } from "./features/result/result.ui";
import { HomePage } from "@/features/home/HomePage";

export default function App() {
  const currentView = useAppStore((s) => s.currentView);
  const setView = useAppStore((s) => s.setView);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">

      {/* ROUTING */}
      {currentView === "home" && (
        <HomePage onStart={() => setView("import")} />
      )}

      {currentView === "import" && <ImportUI />}

      {currentView === "analysis" && <AnalysisUI />}

      {currentView === "result" && <ResultUI />}
    </div>
  );
}