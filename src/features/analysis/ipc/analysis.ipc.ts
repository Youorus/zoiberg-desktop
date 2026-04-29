import { ipcMain } from "electron";
import { analyzeImageInputSchema } from "../schemas/analysis.schema";
import { analyzeLungImage } from "../services/analysis.service";

/**
 * MODULE: Analysis
 * FILE: analysis.ipc.ts
 *
 * Rôle du fichier :
 * -----------------
 * Ce fichier connecte Electron au module d’analyse.
 *
 * IPC signifie :
 * --------------
 * Inter-Process Communication.
 *
 * Pourquoi IPC existe ?
 * ---------------------
 * Dans Electron, React et Electron main ne tournent pas au même endroit.
 *
 * React tourne dans le renderer process.
 * Electron main tourne dans le main process.
 *
 * Pour que React demande quelque chose au main process,
 * on utilise IPC.
 *
 * Exemple :
 * ---------
 * React :
 * window.zoiberg.analysis.analyzeImage(image)
 *
 * Preload :
 * ipcRenderer.invoke("analysis:analyze-image", image)
 *
 * Main process :
 * ipcMain.handle("analysis:analyze-image", async (...) => {})
 *
 * Responsabilités de ce fichier :
 * -------------------------------
 * - déclarer le channel IPC "analysis:analyze-image"
 * - recevoir les données envoyées par React
 * - valider ces données avec Zod
 * - appeler analysis.service.ts
 * - retourner le résultat à React
 *
 * Ce fichier ne doit pas :
 * ------------------------
 * - contenir de logique UI
 * - contenir beaucoup de logique métier
 * - faire directement toute l’analyse IA
 *
 * Il doit rester fin.
 */

/**
 * Cette fonction est appelée une seule fois au démarrage de l’application,
 * dans register-ipc.ts ou directement dans src/index.ts.
 */
export function registerAnalysisIpc(): void {
  ipcMain.handle("analysis:analyze-image", async (_event, input) => {
    /**
     * Étape 1 :
     * On valide les données reçues depuis React.
     *
     * Même si React est typé, on ne fait jamais confiance aveuglément
     * à une donnée qui traverse IPC.
     */
    const image = analyzeImageInputSchema.parse(input);

    /**
     * Étape 2 :
     * On appelle le service métier.
     *
     * Le service se charge de :
     * - mocker l’analyse
     * - ou appeler le vrai modèle IA
     * - formater le résultat
     */
    const result = await analyzeLungImage(image);

    /**
     * Étape 3 :
     * Le résultat est automatiquement renvoyé à React.
     *
     * Côté React, la Promise de :
     * window.zoiberg.analysis.analyzeImage(image)
     * recevra ce result.
     */
    return result;
  });
}