/**
 * MODULE: Export
 * FILE: export.types.ts
 *
 * Rôle du fichier :
 * -----------------
 * Ce fichier contient uniquement les types TypeScript liés à l'export PDF.
 *
 * Pourquoi c’est utile ?
 * ----------------------
 * On veut que toute l’application parle le même langage pour l'export.
 * Par exemple, les données passées au service PDF doivent avoir une structure cohérente.
 *
 * Ce fichier est importé par :
 * ----------------------------
 * - export.service.ts : pour traiter les données
 * - useExport.ts : pour typer les données côté React
 * - ExportPage.tsx : pour afficher et gérer les données
 */

import type { AnalysisResult } from "../../analysis/types/analysis.types";

/**
 * Données nécessaires pour générer un rapport PDF d'export.
 *
 * Inclut :
 * - L'image analysée (en base64 pour l'intégration dans le PDF)
 * - Le résultat de l'IA
 * - Le commentaire de l'analyste
 */
export type ExportData = {
  image: {
    data: string; // Base64 de l'image
    name: string; // Nom du fichier
  };
  analysisResult: AnalysisResult;
  comment: string; // Commentaire ajouté par l'analyste
};

/**
 * Payload pour lancer l'export.
 * Pour l'instant, on utilise des données mockées.
 */
export type ExportInput = {
  // Vide pour l'instant, car on mock les données
};