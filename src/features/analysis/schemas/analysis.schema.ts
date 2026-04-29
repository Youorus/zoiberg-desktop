import { z } from "zod";

/**
 * MODULE: Analysis
 * FILE: analysis.schema.ts
 *
 * Rôle du fichier :
 * -----------------
 * Ce fichier contient les schemas de validation runtime avec Zod.
 *
 * Pourquoi on a besoin de schemas ?
 * ---------------------------------
 * TypeScript ne valide rien une fois l’application lancée.
 * Par exemple, si React envoie une mauvaise donnée à Electron via IPC,
 * TypeScript ne peut plus nous protéger à l’exécution.
 *
 * Zod permet de vérifier réellement :
 * - que path existe
 * - que name existe
 * - que dataUrl existe
 * - que mimeType existe
 *
 * Utilisé par :
 * -------------
 * - analysis.ipc.ts avant d’appeler le service IA.
 */

/**
 * Schema de validation de l’image envoyée à l’analyse.
 *
 * On vérifie que les champs principaux sont présents.
 * Plus tard, on pourra renforcer :
 * - accepter uniquement image/png ou image/jpeg
 * - vérifier la taille maximale
 * - vérifier un format DICOM éventuel
 */
export const analyzeImageInputSchema = z.object({
  path: z.string().min(1, "Le chemin de l’image est requis."),
  name: z.string().min(1, "Le nom du fichier est requis."),
  dataUrl: z.string().min(1, "Le contenu de l’image est requis."),
  mimeType: z.string().min(1, "Le type MIME est requis.")
});

/**
 * Type TypeScript généré automatiquement depuis le schema Zod.
 *
 * Avantage :
 * ----------
 * On évite de maintenir séparément un type et un schema qui peuvent diverger.
 */
export type AnalyzeImageInputSchema = z.infer<typeof analyzeImageInputSchema>;

/**
 * Schema possible pour valider une réponse IA externe.
 *
 * À utiliser plus tard quand on connectera le vrai modèle.
 */
export const externalModelResponseSchema = z.object({
  status: z.enum(["healthy", "sick", "uncertain"]),
  confidence: z.number().min(0).max(1),
  explanation: z.string().min(1),
  modelVersion: z.string().min(1)
});

export type ExternalModelResponse = z.infer<typeof externalModelResponseSchema>;