import { useState } from "react";
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
    <div className="card">
      <h2>Health check</h2>
      <p className="hint">
        Tick the signs you see in your flock. CoopSense will list the
        conditions that match best, with what to do right away.
      </p>

      <div className="warn">
        This is not a vet diagnosis. It is a first guide only. If birds are
        dying, or the flock gets worse, call a vet quickly.
      </div>

      <div className="symptoms">
        {SYMPTOMS.map((s) => (
          <label key={s.id} className="check">
            <input
              type="checkbox"
              checked={ticked.includes(s.id)}
              onChange={() => toggle(s.id)}
            />
            {s.label}
          </label>
        ))}
      </div>

      <button
        className="btn"
        type="button"
        disabled={ticked.length === 0}
        onClick={() => setChecked(true)}
      >
        Check my flock
      </button>
      {ticked.length > 0 && (
        <button
          className="btn quiet"
          type="button"
          onClick={() => {
            setTicked([]);
            setChecked(false);
          }}
        >
          Clear
        </button>
      )}

      {checked && results.length === 0 && (
        <p className="hint">
          Nothing matched the signs you ticked. Keep watching the birds, and
          if new signs show up, check again.
        </p>
      )}

      {results.map((r) => (
        <div key={r.name} className="result-box">
          <h3>
            {r.name} — {confidenceWord(r.match)} ({Math.round(r.match * 100)}
            % match)
          </h3>
          {r.reportable && (
            <p className="warn">
              This disease must be reported. Contact a vet and the local
              veterinary office at once.
            </p>
          )}
          <p>What to do now:</p>
          <ul>
            {r.steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
