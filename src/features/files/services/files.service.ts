import { promises as fs } from "node:fs";
import path from "node:path";
import type { SelectedImage } from "../types/files.types";

const ALLOWED_EXTENSIONS = new Set([".png", ".jpg", ".jpeg"]);

export async function loadSelectedImage(
  imagePath: string
): Promise<SelectedImage> {
  const extension = path.extname(imagePath).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(extension)) {
    throw new Error("Format non supporte. Utilisez PNG, JPG ou JPEG.");
  }

  const fileBuffer = await fs.readFile(imagePath);
  const mimeType = extensionToMimeType(extension);
  const dataUrl = `data:${mimeType};base64,${fileBuffer.toString("base64")}`;

  return {
    path: imagePath,
    name: path.basename(imagePath),
    dataUrl,
    mimeType
  };
}

function extensionToMimeType(extension: string): string {
  if (extension === ".png") return "image/png";
  return "image/jpeg";
}
