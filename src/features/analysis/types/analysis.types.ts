/**
 * MODULE: Analysis
 * FILE: analysis.types.ts
 *
 * Rôle du fichier :
 * -----------------
 * Ce fichier contient uniquement les types TypeScript liés à l’analyse IA.
 *
 * Pourquoi c’est utile ?
 * ----------------------
 * On veut que toute l’application parle le même langage.
 * Par exemple, le résultat retourné par le modèle IA doit avoir toujours
 * la même structure côté service, côté IPC, côté preload et côté React.
 *
 * Ce fichier est importé par :
 * ----------------------------
 * - analysis.service.ts : pour retourner un AnalysisResult propre
 * - analysis.ipc.ts : pour typer les retours IPC
 * - useAnalyzeImage.ts : pour typer le résultat côté React
 * - AnalysisResultCard.tsx : pour afficher correctement le résultat
 */

export type LungScanStatus = "healthy" | "sick" | "uncertain";

/**
 * Résultat final retourné par l’analyse IA.
 *
 * Exemple :
 * {
 *   id: "uuid",
 *   status: "sick",
 *   confidence: 0.91,
 *   explanation: "Le modèle détecte une anomalie...",
 *   modelVersion: "zoiberg-v1",
 *   createdAt: "2026-04-29T10:00:00.000Z"
 * }
 */
export type AnalysisResult = {
  id: string;
  status: LungScanStatus;
  confidence: number;
  explanation: string;
  modelVersion: string;
  createdAt: string;
};

/**
 * Payload envoyé au module d’analyse.
 *
 * Cette image vient normalement du module files.
 * On la redéfinit ici temporairement si le module files n’est pas encore prêt.
 *
 * Plus tard, on pourra importer SelectedImage depuis :
 * import type { SelectedImage } from "@/modules/files";
 */
export type AnalyzeImageInput = {
  path: string;
  name: string;
  dataUrl: string;
  mimeType: string;
};

/**
 * Erreur métier possible pendant l’analyse.
 *
 * Utile si on veut standardiser les erreurs plus tard.
 */
export type AnalysisErrorCode =
  | "INVALID_IMAGE"
  | "MODEL_UNAVAILABLE"
  | "ANALYSIS_FAILED";