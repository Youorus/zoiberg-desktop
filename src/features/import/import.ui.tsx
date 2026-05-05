import { useEffect, useState } from "react";
import { useImport, ModelType } from "./import.hook";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Brain, ImagePlus } from "lucide-react";

const MODEL_DESCRIPTIONS: Record<ModelType, string> = {
  resnet50:
    "ResNet50 est le modèle recommandé. Il utilise le transfer learning et offre généralement une meilleure robustesse pour l’analyse d’images médicales.",
  cnn:
    "CNN custom est un modèle plus simple entraîné spécifiquement sur vos données. Il est utile pour comparaison, mais peut être moins performant que ResNet50.",
};

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

  const submitFile = (file?: File) => {
    if (!file) return;
    handleFileSelect(file as File & { path: string });
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  const modelButtonClass = (model: ModelType) =>
    `rounded-xl border-2 p-4 text-left transition-all ${
      selectedModel === model
        ? "border-cyan-500 bg-cyan-500/15 shadow-md"
        : "border-slate-300 bg-white hover:border-cyan-400 hover:bg-cyan-50"
    }`;

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-6">
      <Card className="w-full max-w-4xl rounded-2xl shadow-2xl">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-xl font-bold sm:text-2xl md:text-3xl">
            Zoidberg 2.0
          </CardTitle>

          <p className="text-sm text-muted-foreground sm:text-base">
            Importez une radiographie pulmonaire, choisissez un modèle, puis lancez l’analyse.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
              className={`
                flex min-h-[260px] cursor-pointer flex-col items-center justify-center gap-3
                rounded-xl border-2 border-dashed p-6 text-center transition-all
                ${
                  dragActive
                    ? "border-cyan-500 bg-cyan-50"
                    : "border-slate-300 bg-slate-50 hover:border-cyan-400"
                }
              `}
            >
              <ImagePlus className="h-10 w-10 text-cyan-600" />

              <p className="text-base font-medium sm:text-lg">
                Glissez-déposez votre radiographie ici
              </p>

              <p className="text-xs text-muted-foreground sm:text-sm">
                Formats acceptés : PNG, JPG — taille maximale : 5MB
              </p>

              <Input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                className="mt-3 w-full sm:max-w-xs"
                onChange={(e) => submitFile(e.target.files?.[0])}
              />

              {selectedFile && (
                <Badge variant="secondary" className="mt-2 max-w-full truncate">
                  {selectedFile.name}
                </Badge>
              )}
            </div>

            <div className="flex min-h-[260px] items-center justify-center rounded-xl border bg-muted/40 p-4">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Prévisualisation de la radiographie"
                  className="max-h-[320px] w-full rounded-lg object-contain"
                />
              ) : (
                <div className="text-center text-sm text-muted-foreground">
                  Aucune image sélectionnée.
                  <br />
                  La prévisualisation apparaîtra ici.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3 rounded-xl border bg-background p-4">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-cyan-600" />
              <p className="text-sm font-semibold">
                Choisir le modèle d’analyse
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setSelectedModel("resnet50")}
                className={modelButtonClass("resnet50")}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold">ResNet50</p>
                  {selectedModel === "resnet50" && (
                    <Badge className="bg-cyan-600 text-white">Sélectionné</Badge>
                  )}
                </div>

                <p className="mt-1 text-xs text-muted-foreground">
                  Modèle recommandé
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedModel("cnn")}
                className={modelButtonClass("cnn")}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold">CNN custom</p>
                  {selectedModel === "cnn" && (
                    <Badge className="bg-cyan-600 text-white">Sélectionné</Badge>
                  )}
                </div>

                <p className="mt-1 text-xs text-muted-foreground">
                  Modèle expérimental
                </p>
              </button>
            </div>

            <Alert className="text-sm">
              {MODEL_DESCRIPTIONS[selectedModel]}
            </Alert>
          </div>

          {error && (
            <Alert variant="destructive" className="text-sm">
              {error}
            </Alert>
          )}

          <Button
            size="lg"
            className="w-full text-base"
            onClick={startAnalysis}
            disabled={loading || !selectedFile}
          >
            {loading ? "Préparation de l’analyse..." : "Lancer l’analyse"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};