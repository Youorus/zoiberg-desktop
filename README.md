# Zoiberg Desktop

Zoiberg Desktop est une application desktop développée avec **Electron**, **React**, **TypeScript**, **Vite**, **Tailwind CSS** et **shadcn/ui**.

L’objectif de l’application est de permettre à un analyste, médecin ou chirurgien d’importer une image de scanner pulmonaire, de lancer une analyse assistée par IA, de consulter un résultat explicatif, d’ajouter un commentaire humain, puis d’exporter un rapport PDF.

> ⚠️ Cette application est un prototype/MVP. Le résultat IA est une aide à l’interprétation et ne remplace pas l’avis d’un professionnel de santé qualifié.

---

## Nom du dépôt

```txt
zoiberg-desktop
```

## Description courte du dépôt

```txt
Application desktop Electron + React pour l’analyse assistée par IA d’images pulmonaires et l’export de rapports PDF.
```

## Topics GitHub recommandés

```txt
electron, react, typescript, vite, tailwindcss, shadcn-ui, ai, medical-imaging, desktop-app
```

---

## Objectif du projet

Le projet vise à construire une application desktop simple, moderne et modulaire autour du flux suivant :

1. Afficher une page d’accueil présentant Zoiberg.
2. Importer une image pulmonaire.
3. Envoyer l’image au modèle IA.
4. Afficher le résultat de l’analyse.
5. Permettre à l’analyste d’ajouter un commentaire.
6. Exporter l’image, le résultat IA et le commentaire dans un PDF.

---

## Stack technique

Le projet utilise :

- **Electron** : application desktop cross-platform.
- **React** : interface utilisateur.
- **TypeScript** : typage robuste.
- **Vite** : développement rapide.
- **Tailwind CSS** : styling rapide et moderne.
- **shadcn/ui** : composants UI réutilisables.
- **TanStack Query** : gestion des états async côté React.
- **Sonner** : notifications toast.
- **Zod** : validation runtime des données.
- **Electron IPC** : communication sécurisée entre React et Electron main process.

---

## Architecture générale

Le projet suit une architecture modulaire par fonctionnalité.

```txt
src/
├── app/
│   ├── App.tsx
│   ├── navigation.tsx
│   └── providers.tsx
│
├── modules/
│   ├── home/
│   ├── files/
│   ├── analysis/
│   └── report/
│
├── components/
│   └── ui/
│
├── preload/
│   ├── index.ts
│   └── api.types.ts
│
├── shared/
│   ├── ipc/
│   └── utils/
│
├── types/
│   └── global.d.ts
│
├── index.ts
├── main.tsx
├── index.css
└── vite-env.d.ts
```

---

## Explication des dossiers principaux

### `src/app/`

Contient le cœur React de l’application.

```txt
app/
├── App.tsx
├── navigation.tsx
└── providers.tsx
```

- `App.tsx` : composant racine React.
- `navigation.tsx` : navigation simple entre les écrans.
- `providers.tsx` : providers globaux comme TanStack Query.

---

### `src/modules/`

Contient les fonctionnalités métier de l’application.

Chaque module peut contenir sa propre UI, ses hooks, ses services, ses types, ses schemas, ses handlers IPC et éventuellement son API preload.

Exemple :

```txt
modules/analysis/
├── ui/
├── hooks/
├── ipc/
├── preload/
├── services/
├── schemas/
├── types/
└── index.ts
```

---

### `src/modules/home/`

Module de la page d’accueil.

Il présente rapidement Zoiberg et permet de démarrer une nouvelle analyse.

---

### `src/modules/files/`

Module responsable de la sélection et de la lecture des fichiers.

Il gère notamment :

- l’ouverture de la fenêtre système de sélection de fichier ;
- la validation du format ;
- la lecture de l’image ;
- la conversion en `dataUrl` pour l’affichage côté React.

---

### `src/modules/analysis/`

Module principal d’analyse IA.

Il gère :

- l’affichage de l’écran d’analyse ;
- le lancement de l’analyse ;
- l’état de chargement ;
- le résultat retourné par le modèle ;
- l’explication IA ;
- les commentaires de l’analyste.

Structure recommandée :

```txt
analysis/
├── ui/
│   ├── AnalysisPage.tsx
│   ├── AnalysisResultCard.tsx
│   ├── AnalysisResultSkeleton.tsx
│   └── CommentBox.tsx
├── hooks/
│   └── useAnalyzeImage.ts
├── ipc/
│   └── analysis.ipc.ts
├── preload/
│   └── analysis.preload.ts
├── services/
│   └── analysis.service.ts
├── schemas/
│   └── analysis.schema.ts
├── types/
│   └── analysis.types.ts
└── index.ts
```

---

### `src/modules/report/`

Module responsable de l’export PDF.

Il devra gérer :

- la récupération de l’image analysée ;
- la récupération du résultat IA ;
- la récupération du commentaire analyste ;
- la génération du rapport ;
- la sauvegarde du PDF.

Structure recommandée :

```txt
report/
├── ui/
│   └── ReportActions.tsx
├── hooks/
│   └── useExportReport.ts
├── ipc/
│   └── report.ipc.ts
├── preload/
│   └── report.preload.ts
├── services/
│   └── report.service.ts
├── schemas/
│   └── report.schema.ts
├── types/
│   └── report.types.ts
└── index.ts
```

---

### `src/components/ui/`

Contient les composants générés par shadcn/ui.

Exemples :

```txt
button.tsx
card.tsx
textarea.tsx
badge.tsx
skeleton.tsx
sonner.tsx
```

Ces composants sont génériques et ne doivent pas contenir de logique métier Zoiberg.

---

### `src/preload/`

Contient le point d’entrée preload Electron.

Le preload expose une API sécurisée à React via :

```ts
window.zoiberg
```

Exemple d’utilisation côté React :

```ts
window.zoiberg.files.selectImage();
window.zoiberg.analysis.analyzeImage(image);
window.zoiberg.report.exportPdf(payload);
```

Le preload est important car React ne doit pas accéder directement à Node.js ou au système de fichiers.

---

### `src/shared/`

Contient le code partagé réellement transversal.

Exemples :

- constantes IPC ;
- fonctions utilitaires ;
- helpers ;
- types communs non liés à une seule feature.

---

## Flux technique simplifié

### Import d’image

```txt
React
↓
window.zoiberg.files.selectImage()
↓
preload
↓
ipcRenderer.invoke("files:select-image")
↓
files.ipc.ts
↓
files.service.ts
↓
retour image à React
```

### Analyse IA

```txt
AnalysisPage.tsx
↓
useAnalyzeImage.ts
↓
window.zoiberg.analysis.analyzeImage(image)
↓
preload
↓
ipcRenderer.invoke("analysis:analyze-image")
↓
analysis.ipc.ts
↓
analysis.service.ts
↓
retour AnalysisResult
↓
AnalysisResultCard.tsx
```

### Export PDF

```txt
React
↓
window.zoiberg.report.exportPdf(payload)
↓
preload
↓
report.ipc.ts
↓
report.service.ts
↓
PDF sauvegardé
```

---

## Installation du projet

Cloner le repo :

```bash
git clone <URL_DU_REPO>
cd zoiberg-desktop
```

Installer les dépendances :

```bash
npm install
```

Lancer le projet en développement :

```bash
npm run dev
```

---

## Scripts utiles

### Lancer l’application en développement

```bash
npm run dev
```

### Builder l’application

```bash
npm run build
```

### Prévisualiser le build

```bash
npm run preview
```

> Selon la configuration finale du projet, certains scripts peuvent être ajustés dans `package.json`.

---

## Variables d’environnement

Créer un fichier `.env` à la racine du projet.

Exemple :

```env
VITE_APP_NAME=Zoiberg Desktop
VITE_ENABLE_MOCK_AI=true
VITE_MODEL_API_URL=http://localhost:8000
```

Explication :

```txt
VITE_APP_NAME
Nom de l’application.

VITE_ENABLE_MOCK_AI
true : utilise un faux modèle IA pour le MVP.
false : tente d’appeler le vrai modèle IA.

VITE_MODEL_API_URL
URL du backend ou modèle IA si connecté via API.
```

Ne jamais commit les fichiers contenant des secrets.

---

## Git ignore recommandé

Le fichier `.gitignore` doit contenir au minimum :

```gitignore
node_modules
dist
dist-electron
release
out

.env
.env.local
.env.*.local

.DS_Store
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

.vscode/*
!.vscode/extensions.json
!.vscode/settings.json
```

---

## Initialisation Git

Depuis la racine du projet :

```bash
git init
git add .
git commit -m "chore: initial project setup"
```

Créer ensuite un dépôt GitHub nommé :

```txt
zoiberg-desktop
```

Puis connecter le repo local à GitHub :

```bash
git branch -M main
git remote add origin https://github.com/TON_USERNAME/zoiberg-desktop.git
git push -u origin main
```

Remplacer `TON_USERNAME` par le username GitHub du propriétaire du dépôt.

---

## Ajouter les collaborateurs

Pour ajouter des collaborateurs sur GitHub :

```txt
Repository
→ Settings
→ Collaborators
→ Add people
→ Entrer le username GitHub du collaborateur
→ Add
```

Chaque collaborateur doit accepter l’invitation avant de pouvoir pousser du code.

À demander à chaque collaborateur :

```txt
Donne-moi ton username GitHub pour que je t’ajoute au repo zoiberg-desktop.
```

---

## Conventions de branches

Pour travailler proprement à plusieurs, utiliser des branches courtes et explicites.

Exemples :

```txt
feature/home-page
feature/analysis-ui
feature/file-upload
feature/pdf-export
feature/model-api-connection
fix/preload-types
fix/tailwind-config
```

Éviter de travailler directement sur `main`.

---

## Workflow Git recommandé

Avant de commencer une tâche :

```bash
git checkout main
git pull origin main
git checkout -b feature/nom-de-la-feature
```

Après modification :

```bash
git status
git add .
git commit -m "feat: add analysis page"
git push origin feature/nom-de-la-feature
```

Ensuite, créer une Pull Request sur GitHub vers `main`.

---

## Convention de commits

Utiliser des messages simples et explicites.

Exemples :

```txt
feat: add analysis page
feat: add file selection ipc
feat: add pdf export service
fix: resolve preload typing issue
fix: update tailwind config
refactor: reorganize analysis module
docs: update readme
```

Préfixes recommandés :

```txt
feat      nouvelle fonctionnalité
fix       correction de bug
refactor  amélioration interne sans changer le comportement
docs      documentation
style     changement visuel ou formatage
chore     maintenance/configuration
```

---

## Répartition possible des tâches

### Développeur 1 — UI et navigation

Responsabilités :

- page d’accueil ;
- navigation ;
- layout global ;
- composants visuels principaux ;
- intégration shadcn/ui ;
- responsive design.

Branches possibles :

```txt
feature/home-page
feature/app-navigation
feature/responsive-layout
```

---

### Développeur 2 — Analyse IA

Responsabilités :

- module `analysis` ;
- hook `useAnalyzeImage` ;
- affichage du résultat ;
- skeleton loading ;
- validation avec Zod ;
- connexion future au modèle IA.

Branches possibles :

```txt
feature/analysis-module
feature/analysis-result-card
feature/model-api-connection
```

---

### Développeur 3 — Fichiers et PDF

Responsabilités :

- module `files` ;
- sélection d’image ;
- lecture du fichier ;
- module `report` ;
- génération/export PDF.

Branches possibles :

```txt
feature/file-upload
feature/pdf-export
feature/report-module
```

---

## Règles importantes pour l’équipe

### 1. Ne pas utiliser Node.js directement dans React

À éviter côté React :

```ts
import fs from "fs";
import { ipcRenderer } from "electron";
```

React doit passer par :

```ts
window.zoiberg.*
```

---

### 2. Garder les services séparés de l’UI

La logique métier va dans :

```txt
services/
```

L’interface va dans :

```txt
ui/
```

Les hooks React vont dans :

```txt
hooks/
```

---

### 3. Valider les données avec Zod

Quand une donnée traverse IPC, elle doit être validée côté main process.

Exemple :

```ts
const image = analyzeImageInputSchema.parse(input);
```

---

### 4. Centraliser les exports dans `index.ts`

Chaque module doit exposer ses éléments publics depuis son `index.ts`.

Exemple :

```ts
export { AnalysisPage } from "./ui/AnalysisPage";
export { registerAnalysisIpc } from "./ipc/analysis.ipc";
export type { AnalysisResult } from "./types/analysis.types";
```

Puis ailleurs :

```ts
import { AnalysisPage } from "@/modules/analysis";
```

---

## Responsive design

L’application doit rester agréable sur plusieurs tailles de fenêtre.

### Recommandation Electron

Dans le fichier principal Electron, on peut limiter la taille minimale et maximale de la fenêtre :

```ts
const mainWindow = new BrowserWindow({
  width: 1280,
  height: 820,

  minWidth: 720,
  minHeight: 560,

  maxWidth: 1440,
  maxHeight: 960,

  title: "Zoiberg",
  backgroundColor: "#020617",
  show: false,
  webPreferences: {
    preload: join(__dirname, "../preload/index.js"),
    sandbox: false,
    contextIsolation: true,
    nodeIntegration: false
  }
});
```

Cela permet de conserver une bonne expérience utilisateur sans étirer excessivement l’interface.

### Recommandation React/Tailwind

Éviter les largeurs fixes :

```tsx
<div className="w-[900px]">
```

Préférer :

```tsx
<div className="w-full max-w-6xl">
```

Éviter les grilles toujours en deux colonnes :

```tsx
<div className="grid grid-cols-2">
```

Préférer :

```tsx
<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
```

---

## Ajouter un composant shadcn/ui

Pour ajouter plusieurs composants utiles au projet :

```bash
npx shadcn@latest add button card input textarea badge progress separator alert dialog tabs label sonner skeleton
```

Pour ajouter un composant spécifique :

```bash
npx shadcn@latest add dialog
```

Éviter `--all` sauf besoin réel, afin de ne pas surcharger le repo avec des composants inutilisés.

---

## Notifications avec Sonner

Le composant `Toaster` doit être branché dans l’application.

Exemple dans `src/main.tsx` :

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false
    },
    mutations: {
      retry: 0
    }
  }
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster richColors closeButton position="top-right" />
    </QueryClientProvider>
  </React.StrictMode>
);
```

Utilisation dans un composant :

```tsx
import { toast } from "sonner";

toast.success("Analyse terminée.");
toast.error("Une erreur est survenue.");
```

---

## TanStack Query

TanStack Query est utilisé pour gérer les actions asynchrones.

Exemple :

```ts
const analyzeImageMutation = useAnalyzeImage();

analyzeImageMutation.mutate(image);
```

États utiles :

```txt
isPending
data
error
reset()
```

---

## IPC Electron

IPC signifie **Inter-Process Communication**.

Dans Electron, l’application est séparée en plusieurs environnements :

```txt
Renderer process  React, interface utilisateur
Main process      Electron, accès système
Preload           pont sécurisé entre React et Electron
```

React ne doit pas appeler directement Electron ou Node.js.

Le flux recommandé est :

```txt
React
↓
window.zoiberg.*
↓
preload
↓
ipcRenderer.invoke(...)
↓
ipcMain.handle(...)
↓
service métier
```

---

## Statuts médicaux

Les statuts possibles sont :

```txt
healthy    poumon probablement sain
sick       anomalie détectée
uncertain  résultat incertain
```

Le résultat IA doit rester explicatif et prudent.

---

## Sécurité et avertissement médical

Zoiberg Desktop ne doit jamais présenter le résultat IA comme un diagnostic définitif.

Toute page de résultat ou rapport PDF doit contenir un avertissement du type :

```txt
Ce résultat est une aide à l’interprétation et ne remplace pas l’avis d’un professionnel de santé qualifié.
```

---

## État actuel du projet

Le projet contient actuellement les bases suivantes :

- setup Electron + React + TypeScript ;
- Tailwind CSS ;
- shadcn/ui ;
- architecture modulaire ;
- préparation IPC/preload ;
- préparation du module analyse ;
- préparation TanStack Query ;
- préparation Sonner ;
- préparation export PDF.

---

## Prochaines étapes

1. Finaliser `modules/files`.
2. Finaliser `modules/analysis`.
3. Brancher le mock IA.
4. Ajouter l’affichage complet du résultat.
5. Ajouter le commentaire analyste.
6. Finaliser `modules/report`.
7. Générer le PDF.
8. Connecter le vrai modèle IA.
9. Tester le flux complet de bout en bout.

---

## Checklist avant Pull Request

Avant d’ouvrir une Pull Request, vérifier :

```txt
[ ] Le projet démarre avec npm run dev
[ ] Aucun fichier inutile n’est commit
[ ] Les imports sont propres
[ ] La feature est dans le bon module
[ ] Le code React ne dépend pas directement de Node.js
[ ] Les données IPC sont validées si nécessaire
[ ] L’interface reste responsive
[ ] Le commit message est clair
```

---

## Collaborateurs

Chaque collaborateur doit :

1. cloner le repo ;
2. installer les dépendances ;
3. créer une branche de feature ;
4. pousser sa branche ;
5. ouvrir une Pull Request.

Ne pas pousser directement sur `main`, sauf accord de l’équipe.