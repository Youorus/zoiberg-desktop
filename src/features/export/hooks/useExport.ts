import { useMutation } from "@tanstack/react-query";
import { exportAnalysisReport } from "../services/export.service";

/**
 * MODULE: Export
 * FILE: useExport.ts
 *
 * Rôle du fichier :
 * -----------------
 * Hook React pour gérer l'export du rapport PDF.
 *
 * Pourquoi un hook ?
 * ------------------
 * Pour encapsuler la logique d'export (chargement, erreurs, succès)
 * et éviter de la répéter dans ExportPage.tsx.
 *
 * Utilise TanStack Query pour :
 * - mutation.isPending : afficher un loader pendant l'export
 * - mutation.error : gérer les erreurs
 * - mutation.mutate() : lancer l'export
 *
 * Connexion :
 * -----------
 * Ce hook appelle exportAnalysisReport() du service.
 * Plus tard, il pourrait recevoir des données réelles depuis analysis.
 */

/**
 * Hook pour exporter un rapport d'analyse en PDF.
 *
 * Utilise des données mockées pour l'instant.
 */
export function useExport() {
  return useMutation({
    mutationFn: exportAnalysisReport,
    onSuccess: () => {
      console.log("Rapport PDF exporté avec succès !");
    },
    onError: (error) => {
      console.error("Erreur lors de l'export :", error);
    },
  });
}