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

        {/* HERO */}
        <div className="mb-10 max-w-3xl">
          <div className="mb-4 inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs sm:text-sm text-cyan-200">
            Analyse assistée par intelligence artificielle
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-50 leading-tight">
            Analysez rapidement une radiographie pulmonaire avec Zoidberg 2.0
          </h1>

          <p className="mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-slate-300">
            Importez une image médicale, laissez l’intelligence artificielle
            effectuer une première analyse, puis consultez un résultat clair avec
            un niveau de confiance. Ajoutez vos observations et exportez un
            rapport complet au format PDF.
          </p>

          <p className="mt-4 rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm leading-6 text-amber-100">
            ⚠️ Cette application fournit une aide à l’analyse. Elle ne remplace en
            aucun cas un diagnostic médical professionnel.
          </p>

          <Button
            className="mt-8 h-12 w-full sm:w-auto px-6 text-base"
            onClick={onStart}
          >
            Démarrer une analyse
          </Button>
        </div>

        {/* FEATURES */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <FeatureCard
            icon={<Activity className="h-6 w-6" />}
            title="Import sécurisé"
            description="Chargez une radiographie pulmonaire depuis votre appareil (formats PNG ou JPEG)."
          />

          <FeatureCard
            icon={<Brain className="h-6 w-6" />}
            title="Analyse intelligente"
            description="Le modèle d’IA analyse l’image et estime la présence ou non d’anomalies pulmonaires."
          />

          <FeatureCard
            icon={<FileText className="h-6 w-6" />}
            title="Rapport complet"
            description="Générez un document PDF incluant le résultat, la probabilité et vos commentaires."
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
    <Card className="min-w-0 border-slate-800 bg-slate-900/70 text-slate-50 hover:border-cyan-400/30 transition-all">
      <CardContent className="p-5 sm:p-6">

        <div className="mb-4 text-cyan-300">
          {icon}
        </div>

        <h2 className="text-base sm:text-lg font-semibold">
          {title}
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}