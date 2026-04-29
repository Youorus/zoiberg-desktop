import {AnalysisPreloadApi} from "@/features/analysis/preload/analysis.preload.ts";


/**
 * Type global de l’API exposée dans window.zoiberg.
 *
 * Ce type sert au fichier global.d.ts pour dire à TypeScript :
 * "window.zoiberg existe, et voici ses fonctions."
 */
export type ZoibergApi = {
  analysis: AnalysisPreloadApi;
};