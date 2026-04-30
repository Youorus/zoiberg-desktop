import { BrowserWindow, dialog } from "electron";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { ExportReportInput, ExportReportResult } from "../types/report.types";

export async function exportReportPdf(
  payload: ExportReportInput
): Promise<ExportReportResult> {
  const defaultName = `zoiberg-report-${Date.now()}.pdf`;
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: "Exporter le rapport PDF",
    defaultPath: path.join(process.cwd(), defaultName),
    filters: [{ name: "PDF", extensions: ["pdf"] }]
  });

  if (canceled || !filePath) {
    throw new Error("Export annule.");
  }

  const win = new BrowserWindow({
    show: false,
    webPreferences: { sandbox: true }
  });

  const html = buildReportHtml(payload);
  await win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
  const pdfData = await win.webContents.printToPDF({
    printBackground: true,
    preferCSSPageSize: true
  });
  win.destroy();

  await fs.writeFile(filePath, pdfData);
  return { path: filePath };
}

function buildReportHtml(payload: ExportReportInput): string {
  const { image, result, comment } = payload;
  const confidence = Math.round(result.confidence * 100);

  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <style>
    @page { size: A4; margin: 20mm; }
    body { font-family: Arial, sans-serif; color: #0f172a; }
    h1 { font-size: 22px; margin-bottom: 8px; }
    .muted { color: #475569; font-size: 12px; }
    .section { margin-top: 18px; }
    .card { border: 1px solid #cbd5e1; border-radius: 10px; padding: 12px; }
    img { max-width: 100%; border: 1px solid #cbd5e1; border-radius: 10px; }
    .warn { margin-top: 16px; font-size: 12px; color: #92400e; background: #fffbeb; border: 1px solid #fcd34d; padding: 10px; border-radius: 8px; }
  </style>
</head>
<body>
  <h1>Rapport Zoiberg - Analyse Pulmonaire</h1>
  <div class="muted">Genere le ${new Date().toLocaleString("fr-FR")}</div>

  <div class="section card">
    <strong>Fichier:</strong> ${escapeHtml(image.name)}<br/>
    <strong>Type:</strong> ${escapeHtml(image.mimeType)}
  </div>

  <div class="section">
    <img src="${image.dataUrl}" alt="Image pulmonaire" />
  </div>

  <div class="section card">
    <strong>Statut IA:</strong> ${escapeHtml(result.status)}<br/>
    <strong>Confiance:</strong> ${confidence}%<br/>
    <strong>Modele:</strong> ${escapeHtml(result.modelVersion)}<br/>
    <strong>Horodatage:</strong> ${escapeHtml(result.createdAt)}<br/>
    <p><strong>Explication:</strong> ${escapeHtml(result.explanation)}</p>
  </div>

  <div class="section card">
    <strong>Commentaire analyste</strong>
    <p>${escapeHtml(comment || "Aucun commentaire fourni.")}</p>
  </div>

  <div class="warn">
    Ce resultat est une aide a l'interpretation et ne remplace pas l'avis d'un professionnel de sante qualifie.
  </div>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
