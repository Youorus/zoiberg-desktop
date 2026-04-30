import type { AnalysisPreloadApi } from "../features/analysis/preload/analysis.preload";
import type { FilesPreloadApi } from "../features/files/preload/files.preload";
import type { ReportPreloadApi } from "../features/report/preload/report.preload";


/**
 * Type global de l’API exposée dans window.zoiberg.
 *
 * Ce type sert au fichier global.d.ts pour dire à TypeScript :
 * "window.zoiberg existe, et voici ses fonctions."
 */
export type ZoibergApi = {
  analysis: AnalysisPreloadApi;
  files: FilesPreloadApi;
  report: ReportPreloadApi;
};
