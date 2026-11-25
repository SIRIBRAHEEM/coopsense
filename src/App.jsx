import { useState } from "react";
import { Bird, Wheat, HeartPulse, Egg, Syringe, WifiOff, MapPin } from "lucide-react";
import FeedCalculator from "./components/FeedCalculator";
import HealthCheck from "./components/HealthCheck";
import EggTracker from "./components/EggTracker";
import VaccineSchedule from "./components/VaccineSchedule";

const TABS = [
  { id: "feed", label: "Feed cost", Icon: Wheat },
  { id: "health", label: "Health check", Icon: HeartPulse },
  { id: "eggs", label: "Egg tracker", Icon: Egg },
  { id: "vaccines", label: "Vaccines", Icon: Syringe },
];

export default function App() {
  const [tab, setTab] = useState("feed");

  return (
    <div className="shell">
      <header className="hero">
        <div className="hero-inner">
          <div className="brand-mark" aria-hidden="true">
            <Bird size={30} strokeWidth={2.2} />
          </div>
          <div>
            <h1>CoopSense</h1>
            <p>
              A smart helper for small poultry farmers. Work out feed costs,
              check sick birds, track eggs and keep vaccines on time.
            </p>
          </div>
        </div>
        <div className="hero-chips">
          <span className="hero-chip">
            <WifiOff size={14} /> Works offline
          </span>
          <span className="hero-chip">
            <MapPin size={14} /> Made for small farms in Nigeria
          </span>
        </div>
      </header>

      <nav className="tabbar" aria-label="CoopSense tools">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={tab === id ? "tab active" : "tab"}
            onClick={() => setTab(id)}
            type="button"
            aria-pressed={tab === id}
          >
            <Icon size={22} strokeWidth={2.2} />
            <span>{label}</span>
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
