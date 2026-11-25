import { useEffect, useState } from "react";
import { forecastNext7, averageLast7 } from "../lib/forecast";

const STORE_KEY = "coopsense-eggs-v1";

function loadEntries() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function EggTracker() {
  const [entries, setEntries] = useState(loadEntries);
  const [flock, setFlock] = useState(100);
  const [date, setDate] = useState(todayStr());
  const [eggs, setEggs] = useState("");

  useEffect(() => {
    localStorage.setItem(STORE_KEY, JSON.stringify(entries));
  }, [entries]);

  function addEntry() {
    const count = Number(eggs);
    if (!date || isNaN(count) || count < 0) return;
    const next = entries.filter((e) => e.date !== date);
    next.push({ date, eggs: count });
    next.sort((a, b) => a.date.localeCompare(b.date));
    setEntries(next);
    setEggs("");
  }

  function removeEntry(d) {
    setEntries(entries.filter((e) => e.date !== d));
  }

  const recent = entries.slice(-14);
  const maxEggs = Math.max(1, ...recent.map((e) => e.eggs));
  const avg7 = averageLast7(entries);
  const forecast = forecastNext7(entries);
  const layingRate = flock > 0 ? (avg7 / flock) * 100 : 0;

  // Dates for the forecast, starting tomorrow.
  const forecastDates = [];
  if (forecast) {
    for (let i = 1; i <= 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      forecastDates.push(d.toISOString().slice(0, 10));
    }
  }

  return (
    <div className="card">
      <h2>Egg tracker</h2>
      <p className="hint">
        Log how many eggs you collect each day. CoopSense shows your recent
        laying and a rough forecast for the next 7 days, based on your own
        records. Your records stay in this browser.
      </p>

      <div className="field">
        <label>Number of laying birds in the flock</label>
        <input
          type="number"
          min="1"
          value={flock}
          onChange={(e) => setFlock(e.target.value)}
        />
      </div>

      <div className="row">
        <div className="field">
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="field">
          <label>Eggs collected</label>
          <input
            type="number"
            min="0"
            value={eggs}
            onChange={(e) => setEggs(e.target.value)}
            placeholder="e.g. 82"
          />
        </div>
        <button className="btn" type="button" onClick={addEntry}>
          Add
        </button>
      </div>

      {entries.length > 0 && (
        <>
          <div className="results">
            <div className="result">
              <span>Average, last 7 days</span>
              <strong>{avg7.toFixed(1)} eggs/day</strong>
            </div>
            <div className="result">
              <span>Laying rate</span>
              <strong>{layingRate.toFixed(0)}%</strong>
            </div>
            <div className="result">
              <span>Days logged</span>
              <strong>{entries.length}</strong>
            </div>
          </div>

          <h3>Last 14 days</h3>
          <div className="chart">
            {recent.map((e) => (
              <div key={e.date} className="bar-wrap">
                <div
                  className="bar"
                  style={{ height: `${Math.max(4, (e.eggs / maxEggs) * 100)}px` }}
                  title={`${e.date}: ${e.eggs} eggs`}
                />
                <span className="bar-label">{e.date.slice(5)}</span>
                <span className="bar-value">{e.eggs}</span>
              </div>
            ))}
          </div>

          <table className="log">
            <thead>
              <tr>
                <th>Date</th>
                <th>Eggs</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {[...entries].reverse().map((e) => (
                <tr key={e.date}>
                  <td>{e.date}</td>
                  <td>{e.eggs}</td>
                  <td>
                    <button
                      className="link-btn"
                      type="button"
                      onClick={() => removeEntry(e.date)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {forecast ? (
            <div className="result-box">
              <h3>Forecast for the next 7 days</h3>
              <p>
                Based on the trend in your records. A fall in laying can mean
                stress, sickness or a feed problem, so check the flock if the
                numbers drop.
              </p>
              <ul>
                {forecast.map((f, i) => (
                  <li key={forecastDates[i]}>
                    {forecastDates[i]}: about {f} eggs
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="hint">
              Log at least 3 days of eggs to see a forecast.
            </p>
          )}
        </>
      )}

      {entries.length === 0 && (
        <p className="hint">
          No records yet. Add today’s egg count to get started.
        </p>
      )}
    </div>
  );
}
