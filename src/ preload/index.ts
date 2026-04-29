import { contextBridge } from "electron";
import {createAnalysisPreloadApi} from "@/features/analysis/preload/analysis.preload.ts";

/**
 * Point d’entrée preload principal.
 *
 * Electron charge ce fichier une seule fois au démarrage de la fenêtre.
 *
 * Son rôle :
 * ----------
 * Assembler toutes les APIs preload des modules,
 * puis exposer une seule API globale sécurisée à React :
 *
 * window.zoiberg
 */
const zoibergApi = {
  analysis: createAnalysisPreloadApi(),
};

contextBridge.exposeInMainWorld("zoiberg", zoibergApi);