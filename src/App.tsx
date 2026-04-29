import { useState } from "react";
import {HomePage} from "./features/home/HomePage.tsx";


type Screen = "home" | "analysis";

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {screen === "home" && <HomePage onStart={() => setScreen("analysis")} />}
    </div>
  );
}