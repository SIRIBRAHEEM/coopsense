import { useState } from "react";
import { HeartPulse, TriangleAlert, SearchCheck, Eraser } from "lucide-react";
import { SYMPTOMS, checkSymptoms, confidenceWord } from "../lib/diseases";

export default function HealthCheck() {
  const [ticked, setTicked] = useState([]);
  const [checked, setChecked] = useState(false);

  function toggle(id) {
    setChecked(false);
    if (ticked.includes(id)) {
      setTicked(ticked.filter((t) => t !== id));
    } else {
      setTicked([...ticked, id]);
    }
  }

  const results = checked ? checkSymptoms(ticked) : [];

  return (
    <section className="card">
      <div className="card-head">
        <div className="card-icon clay" aria-hidden="true">
          <HeartPulse size={24} strokeWidth={2.2} />
        </div>
        <div>
          <h2>Health check</h2>
          <p className="hint">
            Tick the signs you see in your flock. CoopSense will list the
            conditions that match best, with what to do right away.
          </p>
        </div>
      </div>

      <div className="alert" role="note">
        <TriangleAlert size={19} aria-hidden="true" />
        <span>
          This is not a vet diagnosis. It is a first guide only. If birds
          are dying, or the flock gets worse, call a vet quickly.
        </span>
      </div>

      <div className="symptoms">
        {SYMPTOMS.map((s) => (
          <label
            key={s.id}
            className={ticked.includes(s.id) ? "check checked" : "check"}
          >
            <input
              type="checkbox"
              checked={ticked.includes(s.id)}
              onChange={() => toggle(s.id)}
            />
            {s.label}
          </label>
        ))}
      </div>

      <div className="row mt-4">
        <button
          className="btn"
          type="button"
          disabled={ticked.length === 0}
          onClick={() => setChecked(true)}
        >
          <SearchCheck size={19} aria-hidden="true" />
          Check my flock
        </button>
        {ticked.length > 0 && (
          <button
            className="btn btn-quiet"
            type="button"
            onClick={() => {
              setTicked([]);
              setChecked(false);
            }}
          >
            <Eraser size={18} aria-hidden="true" />
            Clear
          </button>
        )}
      </div>

      {checked && results.length === 0 && (
        <p className="hint mt-4">
          Nothing matched the signs you ticked. Keep watching the birds, and
          if new signs show up, check again.
        </p>
      )}

      {results.map((r) => (
        <div key={r.name} className="result-box">
          <h3>
            {r.name}: {confidenceWord(r.match)} ({Math.round(r.match * 100)}
            % match)
          </h3>
          {r.reportable && (
            <p className="alert alert-danger" role="alert">
              <TriangleAlert size={19} aria-hidden="true" />
              <span>
                This disease must be reported. Contact a vet and the local
                veterinary office at once.
              </span>
            </p>
          )}
          <p className="font-bold mt-2">What to do now:</p>
          <ul>
            {r.steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
