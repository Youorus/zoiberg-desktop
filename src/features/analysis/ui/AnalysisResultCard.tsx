import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { AnalysisResult, LungScanStatus } from "../types/analysis.types";

type AnalysisResultCardProps = {
  result: AnalysisResult;
};

const statusLabels: Record<LungScanStatus, string> = {
  healthy: "Sain",
  sick: "Suspect",
  uncertain: "Incertain"
};

const statusVariants: Record<LungScanStatus, "default" | "secondary" | "destructive" | "outline" | "ghost" | "link"> =
  {
    healthy: "default",
    sick: "destructive",
    uncertain: "secondary"
  };

export function AnalysisResultCard({ result }: AnalysisResultCardProps) {
  const confidencePercent = Math.round(result.confidence * 100);

  return (
    <Card className="border-slate-800 bg-slate-950/40">
      <CardContent className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Resultat IA</h3>
          <Badge variant={statusVariants[result.status]}>
            {statusLabels[result.status]}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-slate-300">
            <span>Confiance</span>
            <span>{confidencePercent}%</span>
          </div>
          <Progress value={confidencePercent} />
        </div>

        <p className="text-sm leading-6 text-slate-300">{result.explanation}</p>

        <p className="text-xs text-slate-400">
          Modele: {result.modelVersion} - {new Date(result.createdAt).toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
}
