// Simple forecast for the egg tracker.
//
// Takes the last few daily egg counts and fits a straight line through
// them, then reads off the next 7 days. It is a rough guide, not a
// promise: weather, feed and disease can all push laying up or down.

export function forecastNext7(entries) {
  // entries: [{ date, eggs }] in date order, oldest first.
  if (entries.length < 3) return null;

  const recent = entries.slice(-14);
  const n = recent.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;
  recent.forEach((e, i) => {
    sumX += i;
    sumY += e.eggs;
    sumXY += i * e.eggs;
    sumX2 += i * i;
  });

  const denom = n * sumX2 - sumX * sumX;
  if (denom === 0) return null;

  const slope = (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;

  const out = [];
  for (let d = 1; d <= 7; d++) {
    const val = intercept + slope * (n - 1 + d);
    out.push(Math.max(0, Math.round(val)));
  }
  return out;
}

export function averageLast7(entries) {
  const recent = entries.slice(-7);
  if (recent.length === 0) return 0;
  const total = recent.reduce((s, e) => s + e.eggs, 0);
  return total / recent.length;
}
