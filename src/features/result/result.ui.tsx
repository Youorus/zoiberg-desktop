import { useState } from "react";
import { useResult } from "./result.hook";
import type { ModelType } from "@/lib/api.types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";

const MODEL_DESCRIPTIONS: Record<ModelType, string> = {
  resnet50:
    "ResNet50 est le modèle recommandé. Il est généralement plus robuste pour l’analyse d’images pulmonaires grâce au transfer learning.",
  cnn:
    "CNN custom est un modèle plus simple entraîné spécifiquement sur vos données. Il est utile pour comparaison ou expérimentation.",
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
      <div className="flex min-h-screen items-center justify-center px-4 text-muted-foreground">
        Aucun résultat disponible
      </div>
    );
  }

  const isPneumonia = result.prediction === "PNEUMONIA";

  return (
    <div
      className={`flex min-h-screen items-center justify-center px-4 py-6 ${
        isPneumonia ? "bg-red-50" : "bg-green-50"
      }`}
    >
      <Card className="w-full max-w-3xl rounded-2xl shadow-2xl">
        <CardHeader className="space-y-3 text-center">
          <CardTitle className="text-xl font-bold sm:text-2xl">
            Résultat de l’analyse
          </CardTitle>

          <Badge
            className={`mx-auto w-fit px-4 py-1 text-base text-white ${
              isPneumonia
                ? "bg-red-500 hover:bg-red-500"
                : "bg-green-500 hover:bg-green-500"
            }`}
          >
            {isPneumonia ? "Suspicion de pneumonie" : "Poumon normal"}
          </Badge>

          {uploadedFile && (
            <p className="text-xs text-muted-foreground sm:text-sm">
              Image analysée : {uploadedFile.name}
            </p>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3 sm:text-base">
            <div className="rounded-lg bg-muted p-4">
              <p className="text-muted-foreground">Confiance</p>
              <p className="font-semibold">
                {(result.confidence * 100).toFixed(2)}%
              </p>
            </div>

            <div className="rounded-lg bg-muted p-4">
              <p className="text-muted-foreground">Probabilité</p>
              <p className="font-semibold">
                {(result.probability * 100).toFixed(2)}%
              </p>
            </div>

            <div className="rounded-lg bg-muted p-4">
              <p className="text-muted-foreground">Modèle utilisé</p>
              <p className="font-semibold">{result.model}</p>
            </div>
          </div>

          <div className="space-y-3 rounded-xl border bg-background p-4">
            <p className="text-sm font-medium">
              Relancer l’analyse avec un autre modèle
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setSelectedModel("resnet50")}
                className={`rounded-xl border p-4 text-left transition-all ${
                  selectedModel === "resnet50"
                    ? "border-primary bg-primary/10"
                    : "border-border hover:bg-muted"
                }`}
              >
                <p className="font-semibold">ResNet50</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Modèle recommandé
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedModel("cnn")}
                className={`rounded-xl border p-4 text-left transition-all ${
                  selectedModel === "cnn"
                    ? "border-primary bg-primary/10"
                    : "border-border hover:bg-muted"
                }`}
              >
                <p className="font-semibold">CNN custom</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Modèle expérimental
                </p>
              </button>
            </div>

            <Alert className="text-sm">
              {MODEL_DESCRIPTIONS[selectedModel]}
            </Alert>

            <Button
              variant="secondary"
              className="w-full"
              onClick={restartAnalysis}
              disabled={loading || !uploadedFile}
            >
              {loading
                ? "Relance de l’analyse..."
                : "Relancer avec le modèle sélectionné"}
            </Button>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">
              Ajouter un commentaire médical
            </p>

            <Textarea
              placeholder="Ex : Présence possible d'infiltrats pulmonaires..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[110px]"
            />
          </div>

          <Alert className="border-amber-300 bg-amber-100 text-sm text-amber-900">
            ⚠️ Ce résultat est fourni à titre indicatif et ne remplace pas un
            diagnostic médical.
          </Alert>

          {error && (
            <Alert variant="destructive" className="text-sm">
              {error}
            </Alert>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Button
              variant="outline"
              onClick={goBackToImport}
              disabled={loading}
              className="w-full"
            >
              Revenir à l’import
            </Button>

            <Button
              variant="secondary"
              onClick={startNewAnalysis}
              disabled={loading}
              className="w-full"
            >
              Nouvelle analyse
            </Button>

            <Button
              onClick={() => exportReport(comment)}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Génération..." : "Exporter PDF"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};