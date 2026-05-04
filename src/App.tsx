import { useState } from "react";
import {HomePage} from "./features/home/HomePage.tsx";
import { ExportPage } from "./features/export";


type Screen = "home" | "analysis" | "export";

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {screen === "home" && <HomePage onStart={() => setScreen("analysis")} onExport={() => setScreen("export")} />}
      {screen === "analysis" && <div>Analysis Page (à implémenter)</div>}
      {screen === "export" && <ExportPage onBack={() => setScreen("home")} />}
    </div>
  );
}