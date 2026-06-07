import { useState } from "react";
import { useResult } from "./result.hook";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  FileDown,
  FilePlus2,
  RefreshCcw,
  Brain,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  AlertCircle,
  Info,
} from "lucide-react";
import type { ModelType } from "@/lib/api.types";

const MODEL_LABELS: Record<ModelType, string> = {
  resnet50: "ResNet50",
  cnn: "CNN Custom",
};

export const ResultUI = () => {
  const {
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
  } = useResult();

  const [comment, setComment] = useState("");

  if (!result) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 text-muted-foreground text-sm">
        Aucun résultat disponible.
      </div>
    );
  }

  const isPneumonia = result.prediction === "PNEUMONIA";
  const confidencePct = (result.confidence * 100).toFixed(1);
  const probabilityPct = (result.probability * 100).toFixed(1);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">

      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">
          Étape 3 — Résultat de l'analyse
        </h1>
        {uploadedFile && (
          <p className="mt-1 text-sm text-muted-foreground">
            Fichier analysé : <strong>{uploadedFile.name}</strong>
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Left: main result + metrics */}
        <div className="flex flex-col gap-5 lg:col-span-2">

          {/* Diagnosis banner */}
          <div className={`rounded-xl border-2 p-6 ${
            isPneumonia
              ? "border-red-300 bg-red-50"
              : "border-emerald-300 bg-emerald-50"
          }`}>
            <div className="flex items-center gap-4">
              <div className={`flex h-14 w-14 items-center justify-center rounded-full ${
                isPneumonia ? "bg-red-100" : "bg-emerald-100"
              }`}>
                {isPneumonia ? (
                  <AlertTriangle className="h-7 w-7 text-red-600" />
                ) : (
                  <CheckCircle2 className="h-7 w-7 text-emerald-600" />
                )}
              </div>
              <div>
                <p className={`text-xs font-semibold uppercase tracking-widest ${
                  isPneumonia ? "text-red-500" : "text-emerald-600"
                }`}>
                  Diagnostic IA
                </p>
                <h2 className={`text-2xl font-bold ${
                  isPneumonia ? "text-red-700" : "text-emerald-700"
                }`}>
                  {isPneumonia ? "Suspicion de pneumonie" : "Poumon normal"}
                </h2>
                <p className={`mt-0.5 text-sm ${
                  isPneumonia ? "text-red-600" : "text-emerald-600"
                }`}>
                  {isPneumonia
                    ? "Des anomalies radiologiques compatibles avec une pneumonie ont été détectées."
                    : "Aucune anomalie radiologique significative détectée sur ce cliché."}
                </p>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <MetricCard
              label="Indice de confiance"
              value={`${confidencePct}%`}
              progress={parseFloat(confidencePct)}
              color={isPneumonia ? "red" : "emerald"}
            />
            <MetricCard
              label="Probabilité calculée"
              value={`${probabilityPct}%`}
              progress={parseFloat(probabilityPct)}
              color="blue"
            />
            <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
              <p className="text-xs text-muted-foreground mb-1">Seuil de décision</p>
              <p className="text-xl font-bold text-foreground">
                {(result.threshold * 100).toFixed(0)}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Modèle : <strong>{MODEL_LABELS[result.model]}</strong>
              </p>
            </div>
          </div>

          {/* Comment area */}
          <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
            <label className="mb-2 block text-sm font-semibold text-foreground">
              Observations cliniques du médecin
            </label>
            <Textarea
              placeholder="Ex : Opacité alvéolaire en base droite, syndrome de condensation, contexte fébrile 39°C…"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="resize-none text-sm"
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              Ce commentaire sera inclus dans le rapport PDF exporté.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              {error}
            </div>
          )}
        </div>

        {/* Right: actions + model switcher */}
        <div className="flex flex-col gap-5">

          {/* Export PDF */}
          <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
            <h3 className="mb-1 text-sm font-semibold text-foreground">Exporter le rapport</h3>
            <p className="mb-4 text-xs text-muted-foreground">
              Génère un PDF complet incluant le résultat, les métriques et vos observations.
              Il sera auto-enregistré dans votre dossier Documents.
            </p>
            <Button
              className="w-full gap-2"
              onClick={() => exportReport(comment)}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Génération…
                </>
              ) : (
                <>
                  <FileDown className="h-4 w-4" />
                  Télécharger le PDF
                </>
              )}
            </Button>
          </div>

          {/* Model switcher */}
          <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Relancer avec un autre modèle</h3>
            </div>

            <div className="flex flex-col gap-2">
              {(["resnet50", "cnn"] as ModelType[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setSelectedModel(m)}
                  disabled={loading}
                  className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-all ${
                    selectedModel === m
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-foreground hover:border-primary/40"
                  }`}
                >
                  <span className="font-medium">{MODEL_LABELS[m]}</span>
                  {selectedModel === m && (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  )}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              className="mt-3 w-full gap-2"
              onClick={restartAnalysis}
              disabled={loading}
            >
              <RefreshCcw className="h-3.5 w-3.5" />
              Relancer l'analyse
            </Button>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-2">
            <Button
              variant="ghost"
              onClick={goBackToImport}
              disabled={loading}
              className="w-full gap-2 justify-start text-muted-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Revenir à l'import
            </Button>
            <Button
              variant="ghost"
              onClick={startNewAnalysis}
              disabled={loading}
              className="w-full gap-2 justify-start text-muted-foreground"
            >
              <FilePlus2 className="h-4 w-4" />
              Nouvelle analyse
            </Button>
          </div>
        </div>
      </div>

      {/* Medical disclaimer */}
      <div className="mt-6 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
        <Info className="h-4 w-4 shrink-0 mt-0.5" />
        <span>
          <strong>Avertissement :</strong> Ce résultat est fourni à titre indicatif par un système d'aide à la décision.
          Il ne constitue pas un diagnostic médical et ne remplace pas l'évaluation d'un médecin qualifié.
        </span>
      </div>
    </div>
  );
};

function MetricCard({
  label,
  value,
  progress,
  color,
}: {
  label: string;
  value: string;
  progress: number;
  color: "red" | "emerald" | "blue";
}) {
  const barColors = {
    red: "bg-red-500",
    emerald: "bg-emerald-500",
    blue: "bg-primary",
  };

  return (
    <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColors[color]}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
