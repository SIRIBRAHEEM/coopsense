import { useState } from "react";
import FeedCalculator from "./components/FeedCalculator";
import HealthCheck from "./components/HealthCheck";
import EggTracker from "./components/EggTracker";
import VaccineSchedule from "./components/VaccineSchedule";
import "./App.css";

const TABS = [
  { id: "feed", label: "Feed cost" },
  { id: "health", label: "Health check" },
  { id: "eggs", label: "Egg tracker" },
  { id: "vaccines", label: "Vaccines" },
];

export default function App() {
  const [tab, setTab] = useState("feed");

  return (
    <div className="app">
      <header>
        <h1>CoopSense</h1>
        <p>
          A smart helper for small poultry farmers. Work out feed costs,
          check sick birds, track eggs and keep vaccines on time.
        </p>
      </header>

      <nav className="tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={tab === t.id ? "tab active" : "tab"}
            onClick={() => setTab(t.id)}
            type="button"
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main>
        {tab === "feed" && <FeedCalculator />}
        {tab === "health" && <HealthCheck />}
        {tab === "eggs" && <EggTracker />}
        {tab === "vaccines" && <VaccineSchedule />}
      </main>

      <footer>
        <p>
          Built for small farms in Nigeria. Prices in naira. The health check
          is a guide, not a vet diagnosis. Always talk to a vet when birds
          are dying.
        </p>
      </footer>
    </div>
  );
}
