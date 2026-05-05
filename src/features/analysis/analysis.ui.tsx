import { useAnalysis } from "./analysis.hook";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const AnalysisUI = () => {
  const { progress } = useAnalysis(); // tu peux simuler ça dans ton hook

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-6">
      <Card className="w-full max-w-xl shadow-2xl rounded-2xl">

        <CardHeader className="text-center">
          <CardTitle className="text-xl sm:text-2xl font-bold">
            Analyse en cours
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Zoidberg 2.0 analyse votre radiographie pulmonaire…
          </p>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-6 py-8">

          {/* Spinner */}
          <div className="relative flex items-center justify-center">
            <div className="h-20 w-20 rounded-full border-4 border-cyan-400/20 border-t-cyan-400 animate-spin" />
          </div>

          {/* Texte dynamique */}
          <p className="text-sm sm:text-base text-slate-400 text-center max-w-sm">
            Détection des anomalies, extraction des caractéristiques et
            estimation des probabilités en cours…
          </p>

          {/* Barre de progression */}
          <div className="w-full max-w-xs">
            <Progress value={progress} />
            <p className="text-xs text-muted-foreground text-center mt-2">
              Analyse en cours… {progress}%
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};