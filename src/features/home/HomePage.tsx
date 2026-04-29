import { Activity, Brain, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type HomePageProps = {
  onStart: () => void;
};

export function HomePage({ onStart }: HomePageProps) {
  return (
    <main className="min-h-screen w-full overflow-x-hidden px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center">
        <div className="mb-8 max-w-3xl sm:mb-10">
          <div className="mb-4 inline-flex max-w-full items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-xs text-cyan-200 sm:px-4 sm:text-sm">
            IA médicale d’aide à l’analyse pulmonaire
          </div>

          <h1 className="max-w-4xl text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl lg:text-5xl">
            Zoiberg analyse les images pulmonaires avec une interface simple et
            fiable.
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:mt-6 sm:text-lg sm:leading-8">
            Importez une image de scanner pulmonaire, lancez l’analyse IA,
            consultez le résultat, ajoutez vos commentaires, puis exportez un
            rapport PDF complet.
          </p>

          <p className="mt-4 max-w-3xl rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm leading-6 text-amber-100">
            Zoiberg fournit une aide à l’interprétation. Le résultat ne remplace
            pas un diagnostic médical.
          </p>

          <Button
            className="mt-8 h-12 w-full px-6 text-base sm:w-auto"
            onClick={onStart}
          >
            Commencer une analyse
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<Activity className="h-6 w-6" />}
            title="Import rapide"
            description="Sélectionnez une image pulmonaire au format PNG ou JPEG."
          />

          <FeatureCard
            icon={<Brain className="h-6 w-6" />}
            title="Analyse IA"
            description="Le modèle estime si l’image présente un poumon sain ou suspect."
          />

          <FeatureCard
            icon={<FileText className="h-6 w-6" />}
            title="Rapport PDF"
            description="Exportez le résultat IA, l’image et les commentaires de l’analyste."
          />
        </div>
      </section>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="min-w-0 border-slate-800 bg-slate-900/70 text-slate-50">
      <CardContent className="p-5 sm:p-6">
        <div className="mb-4 text-cyan-300">{icon}</div>

        <h2 className="text-base font-semibold sm:text-lg">{title}</h2>

        <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
      </CardContent>
    </Card>
  );
}