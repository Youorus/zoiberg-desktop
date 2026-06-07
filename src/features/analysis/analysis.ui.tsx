import { useAnalysis } from "./analysis.hook";
import { useAppStore } from "../../shared/store/app.store";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, AlertCircle, Brain } from "lucide-react";

export const AnalysisUI = () => {
  const { progress, error } = useAnalysis();
  const setView = useAppStore((s) => s.setView);
  const uploadedFile = useAppStore((s) => s.uploadedFile);
  const selectedModel = useAppStore((s) => s.selectedModel);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-4 py-12">

      {/* Card */}
      <div className="w-full rounded-2xl border border-border bg-white p-8 shadow-md text-center">

        {/* Animated brain icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/8 ring-4 ring-primary/10">
          <Brain className="h-10 w-10 text-primary animate-pulse" />
        </div>

        <h1 className="text-xl font-bold text-foreground">Analyse en cours…</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Le modèle <strong>{selectedModel === "resnet50" ? "ResNet50" : "CNN Custom"}</strong> analyse votre radiographie pulmonaire.
        </p>

        {uploadedFile && (
          <p className="mt-1 text-xs text-muted-foreground/70 truncate">
            {uploadedFile.name}
          </p>
        )}

        {/* Progress bar */}
        {!error && (
          <div className="mt-8 space-y-3">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Extraction des caractéristiques</span>
              <span>{Math.min(100, Math.round(progress))}%</span>
            </div>
          </div>
        )}

        {/* Steps info */}
        {!error && (
          <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs text-muted-foreground">
            {[
              { label: "Prétraitement", done: progress > 20 },
              { label: "Inférence IA", done: progress > 60 },
              { label: "Calcul confiance", done: progress > 90 },
            ].map((step) => (
              <div key={step.label} className={`rounded-lg border px-2 py-2 transition-colors ${
                step.done ? "border-primary/30 bg-primary/5 text-primary" : "border-border bg-muted/20"
              }`}>
                {step.label}
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="mt-6 space-y-4">
            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-left text-sm text-red-800">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setView("import")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Revenir à l'import
            </Button>
          </div>
        )}
      </div>

      <p className="mt-5 text-center text-xs text-muted-foreground">
        L'analyse peut prendre 5 à 15 secondes selon la taille de l'image.
      </p>
    </div>
  );
};
