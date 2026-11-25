// Feed cost maths for the calculator.
// All money is in naira. A standard bag of feed is 25kg.

export function feedCost({ birds, bagPrice, gramsPerBird, eggsPerDay }) {
  const feedKgPerDay = (birds * gramsPerBird) / 1000;
  const bagsPerDay = feedKgPerDay / 25;
  const dailyCost = bagsPerDay * bagPrice;
  const monthlyCost = dailyCost * 30;
  const costPerBirdPerDay = birds > 0 ? dailyCost / birds : 0;
  const costPerEgg =
    eggsPerDay && eggsPerDay > 0 ? dailyCost / eggsPerDay : null;

  return {
    feedKgPerDay,
    bagsPerDay,
    bagsPerMonth: bagsPerDay * 30,
    dailyCost,
    monthlyCost,
    costPerBirdPerDay,
    costPerEgg,
  };
}

// Round naira to whole numbers for display.
export function naira(n) {
  return "₦" + Math.round(n).toLocaleString("en-NG");
}
