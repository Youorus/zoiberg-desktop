import type { AnalysisResult } from "../../analysis/types/analysis.types";
import type { SelectedImage } from "../../files/types/files.types";

export type ExportReportInput = {
  image: SelectedImage;
  result: AnalysisResult;
  comment: string;
};

export type ExportReportResult = {
  path: string;
};
