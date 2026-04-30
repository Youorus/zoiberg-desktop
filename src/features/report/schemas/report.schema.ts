import { z } from "zod";
import {
  analyzeImageInputSchema,
  externalModelResponseSchema
} from "../../analysis/schemas/analysis.schema";

export const exportReportInputSchema = z.object({
  image: analyzeImageInputSchema,
  result: externalModelResponseSchema.extend({
    id: z.string().min(1),
    createdAt: z.string().min(1)
  }),
  comment: z.string()
});
