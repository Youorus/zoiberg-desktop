import type { AnalysisResult, AnalyzeImageInput } from "../types/analysis.types";
import { externalModelResponseSchema } from "../schemas/analysis.schema";

/**
 * MODULE: Analysis
 * FILE: analysis.service.ts
 *
 * Rôle du fichier :
 * -----------------
 * Ce fichier contient la logique métier de l’analyse IA.
 *
 * Il ne s’occupe pas de React.
 * Il ne s’occupe pas de l’affichage.
 * Il ne s’occupe pas directement d’IPC.
 *
 * Sa responsabilité :
 * -------------------
 * Recevoir une image valide, appeler le modèle IA ou un mock,
 * puis retourner un AnalysisResult propre.
 *
 * Pourquoi un service séparé ?
 * ----------------------------
 * Pour éviter de mettre trop de logique dans analysis.ipc.ts.
 *
 * analysis.ipc.ts = reçoit la demande Electron
 * analysis.service.ts = fait le vrai travail métier
 *
 * Plus tard, c’est ici qu’on connectera :
 * - une API HTTP FastAPI
 * - un script Python local
 * - un modèle embarqué
 * - un microservice IA
 */

/**
 * Fonction principale du module analyse.
 *
 * Elle est appelée par analysis.ipc.ts.
 *
 * Pour le moment, elle retourne un mock.
 * Plus tard, elle pourra appeler le vrai modèle IA.
 */
export async function analyzeLungImage(
  image: AnalyzeImageInput
): Promise<AnalysisResult> {
  const useMock = process.env.VITE_ENABLE_MOCK_AI !== "false";

  if (useMock) {
    return analyzeWithMockModel(image);
  }

  return analyzeWithRemoteModel(image);
}

/**
 * Analyse mockée pour le MVP.
 *
 * Objectif :
 * ----------
 * Permettre à l’équipe UI de travailler sans attendre
 * que le vrai modèle IA soit branché.
 *
 * Convention temporaire :
 * -----------------------
 * Si le nom du fichier contient "sick", on retourne malade.
 * Sinon, on retourne sain.
 */
async function analyzeWithMockModel(
  image: AnalyzeImageInput
): Promise<AnalysisResult> {
  await wait(1200);

  const isSick = image.name.toLowerCase().includes("sick");

  return {
    id: crypto.randomUUID(),
    status: isSick ? "sick" : "healthy",
    confidence: isSick ? 0.91 : 0.87,
    explanation: isSick
      ? "Le modèle détecte des motifs visuels compatibles avec une anomalie pulmonaire. Une validation clinique est nécessaire."
      : "Le modèle ne détecte pas de signe évident d’anomalie pulmonaire sur l’image fournie. Une validation clinique reste nécessaire.",
    modelVersion: "zoiberg-mock-v0.1",
    createdAt: new Date().toISOString()
  };
}

/**
 * Connexion future au vrai modèle IA.
 *
 * Exemple possible :
 * ------------------
 * POST http://localhost:8000/analyze
 *
 * Le backend pourrait être :
 * - FastAPI
 * - Flask
 * - Node.js
 * - un serveur local lancé séparément
 *
 * Important :
 * -----------
 * Le service doit toujours retourner un AnalysisResult propre,
 * même si la réponse du modèle externe a un format différent.
 */
async function analyzeWithRemoteModel(
  image: AnalyzeImageInput
): Promise<AnalysisResult> {
  const apiUrl = process.env.VITE_MODEL_API_URL;

  if (!apiUrl) {
    throw new Error("VITE_MODEL_API_URL n’est pas configuré.");
  }

  const response = await fetch(`${apiUrl}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      imageBase64: image.dataUrl,
      mimeType: image.mimeType,
      fileName: image.name
    })
  });

  if (!response.ok) {
    throw new Error("Erreur pendant l’analyse IA.");
  }

  const rawData = await response.json();

  /**
   * On valide la réponse externe avec Zod.
   * Cela évite d’afficher des données incohérentes dans l’app.
   */
  const parsed = externalModelResponseSchema.parse(rawData);

  return {
    id: crypto.randomUUID(),
    status: parsed.status,
    confidence: parsed.confidence,
    explanation: parsed.explanation,
    modelVersion: parsed.modelVersion,
    createdAt: new Date().toISOString()
  };
}

/**
 * Petite fonction utilitaire pour simuler un délai réseau.
 */
function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
