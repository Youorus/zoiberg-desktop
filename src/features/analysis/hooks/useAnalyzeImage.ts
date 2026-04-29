import { useMutation } from "@tanstack/react-query";
import type { AnalysisResult, AnalyzeImageInput } from "../types/analysis.types";

/**
 * MODULE: Analysis
 * FILE: useAnalyzeImage.ts
 *
 * Rôle du fichier :
 * -----------------
 * Ce fichier contient le hook React utilisé pour lancer une analyse IA.
 *
 * Pourquoi un hook ?
 * ------------------
 * Pour éviter que AnalysisPage.tsx contienne directement toute la logique :
 * - loading
 * - error
 * - data
 * - retry
 * - reset
 *
 * TanStack Query nous donne déjà :
 * -------------------------------
 * - mutation.data
 * - mutation.error
 * - mutation.isPending
 * - mutation.isSuccess
 * - mutation.reset()
 * - mutation.mutate()
 *
 * Pourquoi useMutation et pas useQuery ?
 * --------------------------------------
 * useQuery sert plutôt à charger automatiquement des données.
 * Exemple : charger une liste d’utilisateurs.
 *
 * Ici, l’analyse démarre seulement quand l’utilisateur clique sur :
 * "Lancer l’analyse IA".
 *
 * Donc c’est une mutation.
 *
 * Connexion :
 * -----------
 * Ce hook appelle :
 * window.zoiberg.analysis.analyzeImage(image)
 *
 * Cette fonction est exposée par :
 * src/preload/index.ts
 *
 * Puis elle passe par :
 * ipcRenderer.invoke("analysis:analyze-image", image)
 *
 * Et elle arrive dans :
 * modules/analysis/ipc/analysis.ipc.ts
 */
export function useAnalyzeImage() {
  return useMutation<AnalysisResult, Error, AnalyzeImageInput>({
    mutationFn: async (image: AnalyzeImageInput) => {
      return window.zoiberg.analysis.analyzeImage(image);
    }
  });
}