import { Skeleton } from "@/components/ui/skeleton";

/**
 * MODULE: Analysis
 * FILE: AnalysisResultSkeleton.tsx
 *
 * Rôle du fichier :
 * -----------------
 * Afficher un placeholder pendant que l’analyse IA est en cours.
 *
 * Pourquoi un skeleton ?
 * ----------------------
 * C’est plus propre qu’un simple texte "Chargement...".
 * L’utilisateur comprend qu’une zone de résultat va apparaître.
 *
 * Utilisé par :
 * -------------
 * AnalysisPage.tsx quand :
 * analyzeImageMutation.isPending === true
 */
export function AnalysisResultSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-6 w-40 rounded-full" />
        <Skeleton className="mt-4 h-10 w-24" />
        <Skeleton className="mt-2 h-4 w-32" />
      </div>

      <div className="space-y-3">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-8/12" />
      </div>

      <div className="space-y-3">
        <Skeleton className="h-5 w-44" />
        <Skeleton className="h-28 w-full rounded-xl" />
      </div>

      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  );
}