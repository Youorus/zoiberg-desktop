/**
 * MODULE: Analysis
 * FILE: index.ts
 *
 * Rôle du fichier :
 * -----------------
 * Ce fichier est le point d’entrée public du module analysis.
 *
 * Pourquoi c’est utile ?
 * ----------------------
 * Les autres parties de l’application ne doivent pas connaître
 * toute l’organisation interne du module.
 *
 * Au lieu d’importer :
 * import { AnalysisPage } from "@/modules/analysis/ui/AnalysisPage";
 *
 * On importe :
 * import { AnalysisPage } from "@/modules/analysis";
 *
 * Avantages :
 * -----------
 * - imports plus propres
 * - meilleure encapsulation
 * - si on déplace un fichier interne, on corrige seulement ici
 *
 * Ce qu’on exporte ici :
 * ----------------------
 * - les composants publics utilisés ailleurs
 * - les hooks publics si nécessaire
 * - les types publics
 * - la fonction registerAnalysisIpc pour le main process
 *
 * Ce qu’on n’exporte pas forcément :
 * ----------------------------------
 * - les petits composants internes non utilisés ailleurs
 * - les fonctions privées du service
 */

// UI publique
export { AnalysisPage } from "./ui/AnalysisPage";

// Hook public si une autre page doit lancer une analyse
export { useAnalyzeImage } from "./hooks/useAnalyzeImage";

// IPC public, utilisé au démarrage de l’app Electron
export { registerAnalysisIpc } from "./ipc/analysis.ipc";

// Types publics
export type {
  AnalysisResult,
  LungScanStatus,
  AnalyzeImageInput,
  AnalysisErrorCode
} from "./types/analysis.types";