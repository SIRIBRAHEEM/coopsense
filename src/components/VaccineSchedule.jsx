import { useEffect, useState } from "react";
import { Syringe, Check } from "lucide-react";
import { VACCINES, vaccineStatus } from "../lib/vaccines";

const STORE_KEY = "coopsense-vaccines-v1";

function loadDone() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function dayLabel(v) {
  if (v.dayFrom === v.dayTo) return `Day ${v.dayFrom}`;
  return `Day ${v.dayFrom} to ${v.dayTo}`;
}

const STATUS_BADGE = {
  due: "badge badge-due",
  overdue: "badge badge-overdue",
  coming: "badge badge-coming",
};

export default function VaccineSchedule() {
  const [hatchDate, setHatchDate] = useState("");
  const [birdType, setBirdType] = useState("layers");
  const [done, setDone] = useState(loadDone);

  useEffect(() => {
    localStorage.setItem(STORE_KEY, JSON.stringify(done));
  }, [done]);

  const ageDays = hatchDate
    ? Math.floor(
        (new Date().setHours(0, 0, 0, 0) -
          new Date(hatchDate).setHours(0, 0, 0, 0)) /
          (1000 * 60 * 60 * 24),
      )
    : null;

  const list = VACCINES.filter(
    (v) => v.for === "both" || v.for === birdType,
  );

  function toggle(name) {
    setDone({ ...done, [name]: !done[name] });
  }

  function dueDate(v) {
    if (!hatchDate) return "";
    const d = new Date(hatchDate);
    d.setDate(d.getDate() + v.dayFrom);
    return d.toISOString().slice(0, 10);
  }

  return (
    <section className="card">
      <div className="card-head">
        <div className="card-icon clay" aria-hidden="true">
          <Syringe size={24} strokeWidth={2.2} />
        </div>
        <div>
          <h2>Vaccination schedule</h2>
          <p className="hint">
            Enter the day your chicks hatched and CoopSense works out when
            each vaccine is due. Tick each one off when it is done.
          </p>
        </div>
      </div>

      <div className="field">
        <span className="field-label">Bird type</span>
        <div className="row">
          <button
            className={birdType === "layers" ? "pill active" : "pill"}
            onClick={() => setBirdType("layers")}
            type="button"
            aria-pressed={birdType === "layers"}
          >
            Layers
          </button>
          <button
            className={birdType === "broilers" ? "pill active" : "pill"}
            onClick={() => setBirdType("broilers")}
            type="button"
            aria-pressed={birdType === "broilers"}
          >
            Broilers
          </button>
        </div>
      </div>

      <div className="field">
        <label htmlFor="hatch-date">Date the chicks hatched</label>
        <input
          id="hatch-date"
          className="input"
          type="date"
          value={hatchDate}
          onChange={(e) => setHatchDate(e.target.value)}
        />
      </div>

      {ageDays !== null && ageDays >= 0 && (
        <p className="hint mt-3">
          Your birds are {ageDays} days old today.
        </p>
      )}
      {ageDays !== null && ageDays < 0 && (
        <p className="hint mt-3">
          That date is in the future. Check it and try again.
        </p>
      )}

      <div className="vaccine-list">
        {list.map((v) => {
          const status =
            ageDays === null || ageDays < 0 ? "coming" : vaccineStatus(v, ageDays);
          const isDone = !!done[v.name];
          return (
            <div
              key={v.name}
              className={`vaccine ${status} ${isDone ? "done" : ""}`}
            >
              <label className="check">
                <input
                  type="checkbox"
                  checked={isDone}
                  onChange={() => toggle(v.name)}
                />
                <span>
                  <span className="v-name">
                    <strong>{v.name}</strong> - {dayLabel(v)}
                  </span>
                  {hatchDate && ageDays !== null && ageDays >= 0 && (
                    <> (due from {dueDate(v)})</>
                  )}
                  <br />
                  <span className="hint">{v.note}</span>
                </span>
              </label>
              {isDone ? (
                <span className="badge badge-done">
                  <Check size={13} aria-hidden="true" />
                  Done
                </span>
              ) : (
                <span className={STATUS_BADGE[status]}>
                  {status === "due"
                    ? "Due now"
                    : status === "overdue"
                      ? "Overdue"
                      : "Coming up"}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <p className="hint mt-4">
        This is a common schedule for small farms in Nigeria. Your vet may
        change the timing for your area or your birds, so follow your vet’s
        advice where it differs.
      </p>
    </section>
  );
}
