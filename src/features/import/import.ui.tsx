import { useEffect, useRef, useState } from "react";
import { useImport } from "./import.hook";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  ImagePlus,
  Upload,
  CheckCircle2,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import type { ModelType } from "@/lib/api.types";

const MODELS: {
  id: ModelType;
  name: string;
  tag: string;
  description: string;
  recommended?: boolean;
}[] = [
  {
    id: "resnet50",
    name: "ResNet50",
    tag: "Recommandé",
    description:
      "Transfer learning sur ImageNet. Meilleure robustesse pour les images médicales. Précision clinique supérieure.",
    recommended: true,
  },
  {
    id: "cnn",
    name: "CNN Custom",
    tag: "Expérimental",
    description:
      "Architecture CNN entraînée spécifiquement sur vos données. Utile pour comparaison ou expérimentation.",
  },
];

export const ImportUI = () => {
  const {
    error,
    loading,
    selectedFile,
    selectedModel,
    setSelectedModel,
    handleFileSelect,
    startAnalysis,
  } = useImport();

  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  const submitFile = (file?: File) => {
    if (!file) return;
    handleFileSelect(file as File & { path: string });
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">

      {/* Page title */}
      <div className="mb-7">
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">
          Étape 1 — Sélection de l'image et du modèle
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choisissez le modèle d'IA, importez votre radiographie, puis lancez l'analyse.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">

        {/* Left column: model + upload */}
        <div className="flex flex-col gap-5 lg:col-span-3">

          {/* Model selector */}
          <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Modèle d'analyse IA</h2>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {MODELS.map((model) => (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => setSelectedModel(model.id)}
                  className={`rounded-lg border-2 p-4 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    selectedModel === model.id
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border bg-background hover:border-primary/40 hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{model.name}</p>
                      <p className="mt-1 text-xs leading-4 text-muted-foreground">
                        {model.description}
                      </p>
                    </div>
                    <div className="shrink-0">
                      {selectedModel === model.id ? (
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-border mt-0.5" />
                      )}
                    </div>
                  </div>
                  <div className="mt-2">
                    <Badge
                      variant={model.recommended ? "default" : "secondary"}
                      className="text-[10px] px-2 py-0"
                    >
                      {model.tag}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* File drop zone */}
          <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Upload className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Radiographie pulmonaire</h2>
            </div>

            <div
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                submitFile(e.dataTransfer.files[0]);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onClick={() => fileInputRef.current?.click()}
              className={`flex min-h-[160px] cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-6 text-center transition-all ${
                dragActive
                  ? "border-primary bg-primary/5"
                  : selectedFile
                  ? "border-emerald-400 bg-emerald-50/50"
                  : "border-border bg-muted/20 hover:border-primary/40 hover:bg-muted/40"
              }`}
            >
              {selectedFile ? (
                <>
                  <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(0)} Ko — Cliquez pour changer
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <ImagePlus className="h-8 w-8 text-muted-foreground/60" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Glissez-déposez votre radiographie ici
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ou cliquez pour parcourir — PNG, JPG — max 5 Mo
                    </p>
                  </div>
                </>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              className="hidden"
              onChange={(e) => submitFile(e.target.files?.[0])}
            />
          </div>
        </div>

        {/* Right column: preview */}
        <div className="lg:col-span-2">
          <div className="sticky top-20 rounded-xl border border-border bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-foreground">Prévisualisation</h2>

            <div className="flex min-h-[300px] items-center justify-center overflow-hidden rounded-lg bg-slate-100">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Radiographie sélectionnée"
                  className="max-h-[400px] w-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-center text-muted-foreground/50">
                  <ImagePlus className="h-10 w-10" />
                  <p className="text-xs">Aucune image sélectionnée</p>
                </div>
              )}
            </div>

            {selectedFile && (
              <div className="mt-3 rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                <p><strong>Fichier :</strong> {selectedFile.name}</p>
                <p><strong>Modèle sélectionné :</strong> {selectedModel === "resnet50" ? "ResNet50" : "CNN Custom"}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <Alert variant="destructive" className="mt-5 flex items-center gap-2 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </Alert>
      )}

      {/* Launch button */}
      <div className="mt-6 flex justify-end">
        <Button
          size="lg"
          onClick={startAnalysis}
          disabled={loading || !selectedFile}
          className="gap-2 px-8 shadow-md"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Préparation…
            </>
          ) : (
            <>
              Lancer l'analyse
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
