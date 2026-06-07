import { useAppStore } from "@/shared/store/app.store";
import type { AppView, ApiStatus } from "@/shared/store/app.store";
import { Activity, Wifi, WifiOff, Loader2 } from "lucide-react";

const STEPS: { view: AppView; label: string; step: number }[] = [
  { view: "import", label: "Import", step: 1 },
  { view: "analysis", label: "Analyse", step: 2 },
  { view: "result", label: "Résultat", step: 3 },
];

function ApiStatusBadge({ status }: { status: ApiStatus }) {
  if (status === "idle" || status === "checking") {
    return (
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Loader2 className="h-3 w-3 animate-spin" />
        Connexion API…
      </span>
    );
  }
  if (status === "ok") {
    return (
      <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
        <Wifi className="h-3.5 w-3.5" />
        API connectée
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 text-xs text-red-500 font-medium">
      <WifiOff className="h-3.5 w-3.5" />
      API hors ligne
    </span>
  );
}

export function AppHeader() {
  const currentView = useAppStore((s) => s.currentView);
  const apiStatus = useAppStore((s) => s.apiStatus);
  const isAnalysisFlow = currentView !== "home";

  const currentStep = STEPS.findIndex((s) => s.view === currentView) + 1;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/90 backdrop-blur-sm shadow-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Activity className="h-4.5 w-4.5 text-primary-foreground" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold text-foreground tracking-tight">Zoidberg 2.0</p>
            <p className="text-[10px] text-muted-foreground">Aide au diagnostic IA</p>
          </div>
        </div>

        {/* Step indicator — only during analysis flow */}
        {isAnalysisFlow && (
          <nav className="hidden sm:flex items-center gap-1">
            {STEPS.map((step, i) => {
              const isActive = step.view === currentView;
              const isDone = currentStep > step.step;
              return (
                <div key={step.view} className="flex items-center gap-1">
                  {i > 0 && (
                    <div className={`h-px w-6 ${isDone ? "bg-primary" : "bg-border"}`} />
                  )}
                  <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : isDone
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground"
                  }`}>
                    <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${
                      isActive ? "bg-white/20" : isDone ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}>
                      {step.step}
                    </span>
                    {step.label}
                  </div>
                </div>
              );
            })}
          </nav>
        )}

        {/* API status */}
        <ApiStatusBadge status={apiStatus} />
      </div>
    </header>
  );
}
