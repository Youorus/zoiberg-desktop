import jsPDF from "jspdf";
import type { ExportData } from "../types/export.types";

/**
 * MODULE: Export
 * FILE: export.service.ts
 *
 * Rôle du fichier :
 * -----------------
 * Ce fichier contient la logique métier pour générer un rapport PDF.
 *
 * Responsabilités :
 * -----------------
 * - Recevoir des données d'export (image, résultat IA, commentaire)
 * - Générer un PDF avec jsPDF
 * - Inclure : image, statut IA, confiance, explication, commentaire
 * - Sauvegarder le PDF (via Electron si nécessaire)
 *
 * Pour l'instant, utilise des données mockées.
 */

/**
 * Génère des données d'export mockées pour le développement.
 * Plus tard, ces données viendront de la feature analysis.
 */
function generateMockExportData(): ExportData {
  const statuses = ["healthy", "sick", "uncertain"] as const;
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

  return {
    image: {
      data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==", // Placeholder base64
      name: "mock-lung-scan.png",
    },
    analysisResult: {
      id: `mock-${Date.now()}`,
      status: randomStatus,
      confidence: Math.random() * 0.5 + 0.5, // 0.5 à 1.0
      explanation: `Résultat mock : ${randomStatus === "healthy" ? "Aucune anomalie détectée." : randomStatus === "sick" ? "Anomalie potentielle détectée." : "Résultat incertain, nécessite vérification."}`,
      modelVersion: "zoiberg-mock-v1",
      createdAt: new Date().toISOString(),
    },
    comment: "", // Sera ajouté par l'utilisateur
  };
}

/**
 * Génère et sauvegarde un rapport PDF.
 *
 * @param data Données d'export (image, résultat, commentaire)
 * @returns Promise<void> - Résout quand le PDF est généré
 */
export async function generateExportPDF(data: ExportData): Promise<void> {
  const pdf = new jsPDF();

  // Titre
  pdf.setFontSize(20);
  pdf.text("Rapport d'Analyse Pulmonaire - Zoiberg", 20, 30);

  // Date
  pdf.setFontSize(12);
  pdf.text(`Date : ${new Date().toLocaleDateString("fr-FR")}`, 20, 50);

  // Résultat IA
  pdf.setFontSize(16);
  pdf.text("Résultat de l'IA :", 20, 70);
  pdf.setFontSize(12);
  pdf.text(`Statut : ${data.analysisResult.status === "healthy" ? "Sain" : data.analysisResult.status === "sick" ? "Malade" : "Incertain"}`, 20, 85);
  pdf.text(`Fiabilité : ${(data.analysisResult.confidence * 100).toFixed(1)}%`, 20, 95);
  pdf.text(`Explication : ${data.analysisResult.explanation}`, 20, 105, { maxWidth: 170 });

  // Commentaire
  if (data.comment) {
    pdf.setFontSize(16);
    pdf.text("Commentaire de l'analyste :", 20, 125);
    pdf.setFontSize(12);
    pdf.text(data.comment, 20, 140, { maxWidth: 170 });
  }

  // Image (si base64 valide)
  if (data.image.data.startsWith("data:image")) {
    try {
      pdf.addImage(data.image.data, "PNG", 20, 160, 50, 50);
    } catch (error) {
      console.warn("Impossible d'ajouter l'image au PDF :", error);
    }
  }

  // Sauvegarder le PDF
  pdf.save(`rapport-analyse-${data.analysisResult.id}.pdf`);
}

/**
 * Fonction principale pour l'export.
 * Génère des données mockées et crée le PDF.
 */
export async function exportAnalysisReport(): Promise<void> {
  const mockData = generateMockExportData();
  await generateExportPDF(mockData);
}