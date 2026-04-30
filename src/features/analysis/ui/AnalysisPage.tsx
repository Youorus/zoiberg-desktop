import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useExportReport } from "../../report/hooks/useExportReport";
import type { AnalyzeImageInput } from "../types/analysis.types";
import { useAnalyzeImage } from "../hooks/useAnalyzeImage";
import { AnalysisResultCard } from "./AnalysisResultCard";
import { AnalysisResultSkeleton } from "./AnalysisResultSkeleton";
import { CommentBox } from "./CommentBox";

type AnalysisPageProps = {
  onBack: () => void;
};

export function AnalysisPage({ onBack }: AnalysisPageProps) {
  const [image, setImage] = useState<AnalyzeImageInput | null>(null);
  const [comment, setComment] = useState("");

  const analyzeImageMutation = useAnalyzeImage();
  const exportReportMutation = useExportReport();
  const result = analyzeImageMutation.data ?? null;

  async function handleSelectImage() {
    const selected = await window.zoiberg.files.selectImage();
    if (!selected) return;

    setImage(selected);
    setComment("");
    analyzeImageMutation.reset();
  }

  function handleAnalyze() {
    if (!image) return;
    analyzeImageMutation.mutate(image);
  }

  async function handleExport() {
    if (!image || !result) return;

    try {
      const exported = await exportReportMutation.mutateAsync({
        image,
        result,
        comment
      });
      toast.success(`Rapport exporte: ${exported.path}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur d'export PDF.";
      toast.error(message);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-8 py-8">
      <header className="mb-8">
        <button
          className="mb-3 text-sm text-slate-400 hover:text-slate-200"
          onClick={onBack}
        >
          Retour
        </button>

        <h1 className="text-3xl font-bold">Nouvelle analyse</h1>

        <p className="mt-2 text-slate-400">
          Importez une image, lancez l'analyse IA, puis consultez le resultat.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-slate-800 bg-slate-900/70 text-slate-50">
          <CardHeader>
            <CardTitle>Image pulmonaire</CardTitle>
          </CardHeader>

          <CardContent>
            {!image ? (
              <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 p-8 text-center">
                <p className="mb-4 text-slate-300">
                  Selectionnez une image de scanner pulmonaire.
                </p>

                <Button onClick={handleSelectImage}>Importer une image</Button>
              </div>
            ) : (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{image.name}</p>
                    <p className="text-sm text-slate-400">{image.mimeType}</p>
                  </div>

                  <Button
                    variant="secondary"
                    onClick={handleSelectImage}
                    disabled={analyzeImageMutation.isPending}
                  >
                    Changer
                  </Button>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-800 bg-black">
                  <img
                    src={image.dataUrl}
                    alt="Scanner pulmonaire"
                    className="max-h-[460px] w-full object-contain"
                  />
                </div>

                {analyzeImageMutation.error && (
                  <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                    {analyzeImageMutation.error.message}
                  </p>
                )}

                <Button
                  className="mt-6 w-full"
                  disabled={analyzeImageMutation.isPending}
                  onClick={handleAnalyze}
                >
                  {analyzeImageMutation.isPending
                    ? "Analyse en cours..."
                    : "Lancer l'analyse IA"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/70 text-slate-50">
          <CardHeader>
            <CardTitle>Resultat</CardTitle>
          </CardHeader>

          <CardContent>
            {analyzeImageMutation.isPending && <AnalysisResultSkeleton />}

            {!analyzeImageMutation.isPending && !result && (
              <p className="text-slate-400">
                Le resultat apparaitra ici apres analyse.
              </p>
            )}

            {!analyzeImageMutation.isPending && result && (
              <div className="space-y-6">
                <AnalysisResultCard result={result} />
                <CommentBox value={comment} onChange={setComment} />

                <Button
                  className="w-full"
                  onClick={handleExport}
                  disabled={exportReportMutation.isPending}
                >
                  {exportReportMutation.isPending
                    ? "Export en cours..."
                    : "Exporter le rapport PDF"}
                </Button>

                <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-100">
                  Ce resultat est une aide a l'interpretation et ne remplace pas
                  l'avis d'un professionnel de sante qualifie.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
