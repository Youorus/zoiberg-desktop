import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnalyzeImageInput } from "../types/analysis.types";
import { useAnalyzeImage } from "../hooks/useAnalyzeImage";
import { AnalysisResultSkeleton } from "./AnalysisResultSkeleton";

/**
 * MODULE: Analysis
 * FILE: AnalysisPage.tsx
 *
 * Rôle du fichier :
 * -----------------
 * Page principale de la feature analyse.
 *
 * Elle orchestre le parcours utilisateur :
 * ---------------------------------------
 * 1. L’utilisateur sélectionne une image
 * 2. L’image est affichée
 * 3. L’utilisateur clique sur "Lancer l’analyse IA"
 * 4. Le hook useAnalyzeImage appelle window.zoiberg.analysis.analyzeImage()
 * 5. Pendant l’analyse, on affiche AnalysisResultSkeleton
 * 6. Quand le résultat arrive, on affiche AnalysisResultCard
 * 7. L’analyste peut ajouter un commentaire
 *
 * Ce fichier peut appeler :
 * -------------------------
 * - window.zoiberg.files.selectImage()
 *   pour sélectionner une image
 *
 * Mais il ne devrait pas appeler directement :
 * --------------------------------------------
 * - ipcRenderer
 * - ipcMain
 * - analysis.service.ts
 *
 * Pourquoi ?
 * ----------
 * Parce que React ne doit pas connaître les détails internes Electron.
 * React parle uniquement avec l’API exposée par preload :
 * window.zoiberg.*
 */

type AnalysisPageProps = {
  onBack: () => void;
};

export function AnalysisPage({ onBack }: AnalysisPageProps) {
  const [image, setImage] = useState<AnalyzeImageInput | null>(null);

  /**
   * État local destiné au commentaire de l’analyste.
   *
   * Pour le moment, CommentBox est commenté dans le JSX plus bas.
   * Donc cette variable n’est pas encore utilisée visuellement.
   *
   * Quand tu réactiveras CommentBox, ce state permettra de stocker
   * le texte saisi par l’utilisateur.
   */

  const analyzeImageMutation = useAnalyzeImage();

  const result = analyzeImageMutation.data ?? null;

  async function handleSelectImage() {
    /**
     * Ici, React demande au preload d’appeler Electron.
     *
     * React ne va pas lire le disque directement.
     * Il appelle seulement :
     * window.zoiberg.files.selectImage()
     */
    const selected = await window.zoiberg.files.selectImage();

    if (!selected) return;

    setImage(selected);
    analyzeImageMutation.reset();
  }

  function handleAnalyze() {
    if (!image) return;

    /**
     * mutate déclenche le hook useAnalyzeImage.
     *
     * Le hook appelle ensuite :
     * window.zoiberg.analysis.analyzeImage(image)
     */
    analyzeImageMutation.mutate(image);
  }

  return (
    <main className="mx-auto max-w-6xl px-8 py-8">
      <header className="mb-8">
        <button
          className="mb-3 text-sm text-slate-400 hover:text-slate-200"
          onClick={onBack}
        >
          ← Retour
        </button>

        <h1 className="text-3xl font-bold">Nouvelle analyse</h1>

        <p className="mt-2 text-slate-400">
          Importez une image, lancez l’analyse IA, puis consultez le résultat.
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
                  Sélectionnez une image de scanner pulmonaire.
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
                    : "Lancer l’analyse IA"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/70 text-slate-50">
          <CardHeader>
            <CardTitle>Résultat</CardTitle>
          </CardHeader>

          <CardContent>
            {analyzeImageMutation.isPending && <AnalysisResultSkeleton />}

            {!analyzeImageMutation.isPending && !result && (
              <p className="text-slate-400">
                Le résultat apparaîtra ici après analyse.
              </p>
            )}

            {!analyzeImageMutation.isPending && result && (
              <div className="space-y-6">
                {/*
                  Ces deux composants sont volontairement commentés pour le moment.

                  Quand ils seront créés/importés, tu pourras les réactiver.

                  1. AnalysisResultCard
                     Sert à afficher le résultat de l’analyse IA :
                     - statut : sain, malade ou incertain
                     - score de confiance
                     - explication retournée par le modèle
                     - version du modèle

                     Import à ajouter en haut du fichier :
                     import { AnalysisResultCard } from "./AnalysisResultCard";

                     Utilisation :
                     <AnalysisResultCard result={result} />

                  2. CommentBox
                     Sert à afficher une zone de texte permettant à l’analyste
                     ou au chirurgien d’ajouter ses propres observations.

                     Import à ajouter en haut du fichier :
                     import { CommentBox } from "./CommentBox";

                     Utilisation :
                     <CommentBox value={comment} onChange={setComment} />

                  Une fois ces composants réactivés, le state suivant sera utilisé :
                  const [comment, setComment] = useState("");
                */}

                {/*
                  <AnalysisResultCard result={result} />

                  <CommentBox value={comment} onChange={setComment} />
                */}

                <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-100">
                  Ce résultat est une aide à l’interprétation et ne remplace pas
                  l’avis d’un professionnel de santé qualifié.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}