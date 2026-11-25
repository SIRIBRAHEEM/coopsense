import { useState } from "react";
import { Wheat, Info } from "lucide-react";
import { feedCost, naira } from "../lib/feed";

const PRESETS = {
  layer: { label: "Layers", grams: 120 },
  broiler: { label: "Broilers", grams: 150 },
  chick: { label: "Chicks (0-8 weeks)", grams: 45 },
};

export default function FeedCalculator() {
  const [birds, setBirds] = useState(100);
  const [bagPrice, setBagPrice] = useState(18000);
  const [grams, setGrams] = useState(120);
  const [birdType, setBirdType] = useState("layer");
  const [eggs, setEggs] = useState(80);

  const result = feedCost({
    birds: Number(birds) || 0,
    bagPrice: Number(bagPrice) || 0,
    gramsPerBird: Number(grams) || 0,
    eggsPerDay: Number(eggs) || 0,
  });

  function pickType(type) {
    setBirdType(type);
    setGrams(PRESETS[type].grams);
  }

  return (
    <section className="card">
      <div className="card-head">
        <div className="card-icon green" aria-hidden="true">
          <Wheat size={24} strokeWidth={2.2} />
        </div>
        <div>
          <h2>Feed cost calculator</h2>
          <p className="hint">
            Work out what feed costs you each day and each month, and what
            each egg costs you to produce.
          </p>
        </div>
      </div>

      <div className="field">
        <span className="field-label">Bird type</span>
        <div className="row">
          {Object.entries(PRESETS).map(([key, p]) => (
            <button
              key={key}
              className={birdType === key ? "pill active" : "pill"}
              onClick={() => pickType(key)}
              type="button"
              aria-pressed={birdType === key}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-x-5">
        <div className="field">
          <label htmlFor="birds">Number of birds</label>
          <input
            id="birds"
            className="input"
            type="number"
            min="1"
            value={birds}
            onChange={(e) => setBirds(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="bagPrice">Price of one 25kg bag of feed (₦)</label>
          <input
            id="bagPrice"
            className="input"
            type="number"
            min="0"
            value={bagPrice}
            onChange={(e) => setBagPrice(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="grams">Feed eaten per bird per day (grams)</label>
          <input
            id="grams"
            className="input"
            type="number"
            min="1"
            value={grams}
            onChange={(e) => setGrams(e.target.value)}
          />
          <span className="hint">
            Layers eat about 120g a day, broilers about 150g, chicks about
            45g.
          </span>
        </div>

        <div className="field">
          <label htmlFor="eggs">
            Eggs collected per day (leave 0 if you have broilers)
          </label>
          <input
            id="eggs"
            className="input"
            type="number"
            min="0"
            value={eggs}
            onChange={(e) => setEggs(e.target.value)}
          />
        </div>
      </div>

      <div className="stats">
        <div className="stat">
          <span>Feed needed per day</span>
          <strong>{result.feedKgPerDay.toFixed(1)} kg</strong>
        </div>
        <div className="stat">
          <span>Feed cost per day</span>
          <strong>{naira(result.dailyCost)}</strong>
        </div>
        <div className="stat">
          <span>Feed cost per month (30 days)</span>
          <strong>{naira(result.monthlyCost)}</strong>
        </div>
        <div className="stat">
          <span>Cost per bird per day</span>
          <strong>{naira(result.costPerBirdPerDay)}</strong>
        </div>
        <div className="stat">
          <span>Bags of feed per month</span>
          <strong>{result.bagsPerMonth.toFixed(1)} bags</strong>
        </div>
        {result.costPerEgg !== null && (
          <div className="stat clay">
            <span>Feed cost per egg</span>
            <strong>{naira(result.costPerEgg)}</strong>
          </div>
        )}
      </div>

      <p className="hint mt-4 flex gap-2">
        <Info size={17} className="flex-none mt-0.5" aria-hidden="true" />
        <span>
          Tip: if the cost per egg is close to what you sell an egg for, the
          margin is thin. Check feed prices and laying rate before buying
          more birds.
        </span>
      </p>
    </section>
  );
}
