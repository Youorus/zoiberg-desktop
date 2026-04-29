import { useState } from "react";
import {HomePage} from "./features/home/HomePage.tsx";
import { AnalysisPage } from "./features/analysis";


type Screen = "home" | "analysis";

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {screen === "home" && <HomePage onStart={() => setScreen("analysis")} />}
      {screen === "analysis" && (
        <AnalysisPage onBack={() => setScreen("home")} />
      )}
    </div>
  );
}
