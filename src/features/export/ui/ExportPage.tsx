import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Download, FileText } from "lucide-react";
import { useExport } from "../hooks/useExport";

/**
 * MODULE: Export
 * FILE: ExportPage.tsx
 *
 * Rôle du fichier :
 * -----------------
 * Page principale de la feature export.
 *
 * Elle permet à l'analyste de :
 * - Voir l'image analysée (mockée pour l'instant)
 * - Consulter le résultat IA (statut, fiabilité, explication)
 * - Ajouter un commentaire
 * - Exporter le tout en PDF
 *
 * Ce fichier peut appeler :
 * -------------------------
 * - useExport() : hook pour lancer l'export
 *
 * Il ne devrait pas appeler directement :
 * ---------------------------------------
 * - export.service.ts
 * - jsPDF
 */

type ExportPageProps = {
  onBack: () => void;
};

export function ExportPage({ onBack }: ExportPageProps) {
  console.log("ExportPage rendered");
  const [comment, setComment] = useState("");
  const exportMutation = useExport();

  // Données mockées fixes (générées une seule fois)
  const mockData = useMemo(() => ({

    image: {
      data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==", // Placeholder
      name: "mock-lung-scan.png",
    },
    analysisResult: {
      status: ["healthy", "sick", "uncertain"][Math.floor(Math.random() * 3)] as "healthy" | "sick" | "uncertain",
      confidence: Math.random() * 0.5 + 0.5,
      explanation: "Résultat mock : Analyse simulée pour le développement.",
      modelVersion: "zoiberg-mock-v1",
      createdAt: new Date().toISOString(),
    },
  }), []); // [] signifie que ça se calcule une seule fois

  const handleExport = () => {
    // Ici, on pourrait passer le commentaire au service, mais pour l'instant on mock
    exportMutation.mutate();
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "healthy": return "Sain";
      case "sick": return "Malade";
      case "uncertain": return "Incertain";
      default: return "Inconnu";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy": return "bg-green-500";
      case "sick": return "bg-red-500";
      case "uncertain": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <main className="min-h-screen w-full overflow-x-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col">
        <div className="mb-8">
          <Button variant="outline" onClick={onBack} className="mb-4">
            ← Retour
          </Button>
          <h1 className="text-2xl font-bold text-slate-50">Export du Rapport d'Analyse</h1>
          <p className="text-slate-300">
            Vérifiez les résultats, ajoutez un commentaire, puis exportez en PDF.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Image analysée */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Image Analysée
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-slate-800 rounded-lg flex items-center justify-center">
                <img
                  src={mockData.image.data}
                  alt="Scan pulmonaire"
                  className="max-w-full max-h-full rounded"
                />
              </div>
              <p className="text-sm text-slate-400 mt-2">{mockData.image.name}</p>
            </CardContent>
          </Card>

          {/* Résultats IA */}
          <Card>
            <CardHeader>
              <CardTitle>Résultats de l'IA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <span>Statut :</span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(mockData.analysisResult.status)} text-white`}>
                  {getStatusLabel(mockData.analysisResult.status)}
                </span>
              </div>
              <div>
                <span>Fiabilité : </span>
                <span className="font-semibold">
                  {(mockData.analysisResult.confidence * 100).toFixed(1)}%
                </span>
              </div>
              <div>
                <span>Explication : </span>
                <p className="text-sm text-slate-300 mt-1">
                  {mockData.analysisResult.explanation}
                </p>
              </div>
              <div className="text-xs text-slate-500">
                Modèle : {mockData.analysisResult.modelVersion} | 
                Date : {new Date(mockData.analysisResult.createdAt).toLocaleString("fr-FR")}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Commentaire */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Commentaire de l'Analyste</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="comment">Ajoutez vos observations (optionnel)</Label>
            <Textarea
              id="comment"
              placeholder="Ex. : Confirme l'anomalie détectée, recommande une biopsie..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-2"
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Bouton Export */}
        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleExport}
            disabled={exportMutation.isPending}
            className="h-12 px-8"
          >
            {exportMutation.isPending ? (
              "Génération du PDF..."
            ) : (
              <>
                <Download className="h-5 w-5 mr-2" />
                Exporter en PDF
              </>
            )}
          </Button>
        </div>

        {exportMutation.isError && (
          <p className="text-red-500 text-center mt-4">
            Erreur lors de l'export : {exportMutation.error?.message}
          </p>
        )}
      </div>
    </main>
  );
}