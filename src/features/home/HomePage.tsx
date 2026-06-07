import { useState, useEffect } from "react";
import { useAppStore } from "@/shared/store/app.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Activity,
  Brain,
  FileText,
  ShieldCheck,
  ArrowRight,
  Loader2,
  WifiOff,
  Settings2,
  Check,
  X,
} from "lucide-react";

type HomePageProps = {
  onStart: () => void;
  onRecheck: () => Promise<void>;
};

export function HomePage({ onStart, onRecheck }: HomePageProps) {
  const apiStatus = useAppStore((s) => s.apiStatus);
  const storedUrl = useAppStore((s) => s.apiUrl);
  const setApiUrl = useAppStore((s) => s.setApiUrl);

  const [editingUrl, setEditingUrl] = useState(false);
  const [urlInput, setUrlInput] = useState(storedUrl);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setUrlInput(storedUrl);
  }, [storedUrl]);

  const canStart = apiStatus === "ok";
  const isChecking = apiStatus === "idle" || apiStatus === "checking";

  const handleSaveUrl = async () => {
    if (!window.zoiberg?.setApiUrl) return;
    setSaving(true);
    try {
      const cleaned = urlInput.trim().replace(/\/$/, "");
      const { url } = await window.zoiberg.setApiUrl(cleaned);
      setApiUrl(url);
      setEditingUrl(false);
      await onRecheck();
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setUrlInput(storedUrl);
    setEditingUrl(false);
  };

  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex flex-col items-start gap-10 lg:flex-row lg:items-center lg:gap-16">

          {/* Left: text */}
          <div className="flex-1">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
              <ShieldCheck className="h-3.5 w-3.5" />
              Système d'aide à la décision médicale — IA certifiée
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Détection de la pneumonie par
              <span className="text-primary"> radiographie pulmonaire</span>
            </h1>

            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Zoidberg 2.0 analyse les clichés radiologiques thoraciques et fournit en quelques secondes
              un score de probabilité de pneumonie, accompagné d'un rapport PDF exportable.
            </p>

            {/* API status + URL config */}
            <div className={`mt-6 rounded-lg border px-4 py-3 ${
              apiStatus === "ok"
                ? "border-emerald-200 bg-emerald-50"
                : apiStatus === "error"
                ? "border-red-200 bg-red-50"
                : "border-border bg-muted/50"
            }`}>
              {/* Status row */}
              <div className="flex items-center justify-between gap-3">
                <div className={`flex items-center gap-2 text-sm font-medium ${
                  apiStatus === "ok" ? "text-emerald-800"
                  : apiStatus === "error" ? "text-red-800"
                  : "text-muted-foreground"
                }`}>
                  {isChecking && <Loader2 className="h-4 w-4 animate-spin shrink-0" />}
                  {apiStatus === "ok" && <Activity className="h-4 w-4 shrink-0 text-emerald-600" />}
                  {apiStatus === "error" && <WifiOff className="h-4 w-4 shrink-0 text-red-500" />}
                  <span>
                    {isChecking && "Vérification de la connexion…"}
                    {apiStatus === "ok" && "Serveur d'IA opérationnel"}
                    {apiStatus === "error" && "Serveur d'IA inaccessible"}
                  </span>
                </div>

                {!editingUrl && (
                  <button
                    onClick={() => setEditingUrl(true)}
                    className="flex items-center gap-1 rounded px-2 py-1 text-xs text-muted-foreground hover:bg-black/5 hover:text-foreground transition-colors"
                  >
                    <Settings2 className="h-3.5 w-3.5" />
                    Configurer
                  </button>
                )}
              </div>

              {/* URL config — collapsed */}
              {!editingUrl && (
                <p className="mt-1.5 text-xs text-muted-foreground">
                  URL API : <span className="font-mono">{storedUrl}</span>
                </p>
              )}

              {/* URL config — editing */}
              {editingUrl && (
                <div className="mt-3 space-y-2">
                  <label className="text-xs font-medium text-foreground">
                    URL du serveur API (FastAPI)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveUrl();
                        if (e.key === "Escape") handleCancelEdit();
                      }}
                      placeholder="https://votre-api.onrender.com"
                      autoFocus
                      className="flex-1 rounded-md border border-border bg-white px-3 py-1.5 font-mono text-xs text-foreground shadow-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                    <Button
                      size="sm"
                      onClick={handleSaveUrl}
                      disabled={saving || !urlInput.trim()}
                      className="h-7 gap-1 px-3 text-xs"
                    >
                      {saving ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Check className="h-3 w-3" />
                      )}
                      Tester
                    </Button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-white text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Appuyez sur Entrée pour valider, Échap pour annuler.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                size="lg"
                onClick={onStart}
                disabled={!canStart}
                className="gap-2 px-8 text-base shadow-md"
              >
                {isChecking ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Connexion…
                  </>
                ) : (
                  <>
                    Démarrer une analyse
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground">
                Formats acceptés : JPG, PNG — Max 5 Mo
              </p>
            </div>
          </div>

          {/* Right: visual */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-center">
            <div className="relative">
              <div className="flex h-64 w-64 items-center justify-center rounded-3xl bg-primary/8 shadow-inner ring-1 ring-primary/10">
                <Activity className="h-28 w-28 text-primary/30" />
              </div>
              <div className="absolute -right-4 -top-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg ring-1 ring-border">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <div className="absolute -bottom-4 -left-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg ring-1 ring-border">
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <h2 className="mb-6 text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Fonctionnalités
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FeatureCard
              icon={<Activity className="h-5 w-5 text-primary" />}
              title="Import radiologique"
              description="Chargez une radiographie thoracique (PNG, JPG) depuis votre poste. Prévisualisation instantanée avant analyse."
            />
            <FeatureCard
              icon={<Brain className="h-5 w-5 text-primary" />}
              title="Analyse multi-modèles"
              description="Choisissez entre ResNet50 (transfer learning recommandé) et CNN custom. Résultats en quelques secondes."
            />
            <FeatureCard
              icon={<FileText className="h-5 w-5 text-primary" />}
              title="Rapport PDF automatique"
              description="Ajoutez vos observations cliniques et générez un rapport PDF complet, sauvegardé dans vos Documents."
            />
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="border-t border-amber-200 bg-amber-50/60">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          <p className="text-center text-xs leading-5 text-amber-800">
            ⚠️ <strong>Avertissement médical :</strong> Zoidberg 2.0 est un outil d'aide à la décision.
            Les résultats ne constituent pas un diagnostic médical et ne remplacent pas l'avis d'un professionnel de santé qualifié.
          </p>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/8">
          {icon}
        </div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="mt-1.5 text-xs leading-5 text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
