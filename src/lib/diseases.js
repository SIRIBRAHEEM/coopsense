// Symptom checker data and scoring.
//
// This is a simple decision tree: each condition lists the signs that
// point to it, with a weight of 2 for a key sign and 1 for a common sign.
// We score each condition by the share of its weighted signs that the
// farmer ticked. It is a triage helper, not a diagnosis.

export const SYMPTOMS = [
  { id: "sudden_deaths", label: "Sudden deaths" },
  { id: "twisted_neck", label: "Twisted neck" },
  { id: "drooping_wings", label: "Drooping wings" },
  { id: "green_diarrhoea", label: "Greenish diarrhoea" },
  { id: "bloody_droppings", label: "Bloody droppings" },
  { id: "watery_droppings", label: "White watery droppings" },
  { id: "coughing", label: "Coughing or sneezing" },
  { id: "swollen_head", label: "Swollen head or face" },
  { id: "sores", label: "Sores or warts on comb and face" },
  { id: "egg_drop", label: "Drop in egg laying" },
  { id: "no_appetite", label: "Loss of appetite" },
  { id: "pale_comb", label: "Pale comb" },
  { id: "weight_loss", label: "Weight loss, birds look thin" },
  { id: "vent_pecking", label: "Birds pecking at the vent area" },
  { id: "slow_growth", label: "Slow growth" },
];

export const CONDITIONS = [
  {
    name: "Newcastle disease",
    signs: {
      sudden_deaths: 2,
      twisted_neck: 2,
      green_diarrhoea: 1,
      coughing: 1,
      egg_drop: 1,
      no_appetite: 1,
      drooping_wings: 1,
    },
    steps: [
      "Separate the sick birds from the healthy ones at once.",
      "Do not move birds, feed or equipment between pens.",
      "Call a vet the same day. Newcastle spreads fast and kills fast.",
      "Vaccinate the healthy birds if the vet advises it.",
    ],
  },
  {
    name: "Coccidiosis",
    signs: {
      bloody_droppings: 2,
      drooping_wings: 1,
      no_appetite: 1,
      pale_comb: 1,
      weight_loss: 1,
    },
    steps: [
      "Keep the litter dry. Wet litter makes coccidiosis worse.",
      "Give clean drinking water and keep feeders off the ground.",
      "Ask a vet or agrovet shop for an anticoccidial drug.",
      "Clean the pen well after treatment.",
    ],
  },
  {
    name: "Gumboro (Infectious Bursal Disease)",
    signs: {
      sudden_deaths: 1,
      drooping_wings: 1,
      watery_droppings: 2,
      vent_pecking: 2,
      no_appetite: 1,
    },
    steps: [
      "Separate sick birds and keep the pen clean and dry.",
      "Give clean water with vitamins if you have them.",
      "Call a vet. Gumboro hits young birds hardest.",
      "Check your vaccination record. The next batch needs its Gumboro vaccine on time.",
    ],
  },
  {
    name: "Fowl cholera",
    signs: {
      sudden_deaths: 2,
      green_diarrhoea: 1,
      swollen_head: 1,
      no_appetite: 1,
    },
    steps: [
      "Remove dead birds at once and bury or burn them far from the pen.",
      "Separate sick birds from healthy ones.",
      "Call a vet for antibiotics. Do not guess the dose.",
    ],
  },
  {
    name: "Fowl pox",
    signs: {
      sores: 2,
      swollen_head: 1,
      egg_drop: 1,
      no_appetite: 1,
    },
    steps: [
      "Keep the sores clean and dry. Do not peel them off.",
      "Control mosquitoes around the pen. They spread fowl pox.",
      "Sick birds usually recover, but call a vet if they stop eating or cannot see.",
    ],
  },
  {
    name: "Chronic respiratory disease",
    signs: {
      coughing: 2,
      swollen_head: 1,
      egg_drop: 1,
      no_appetite: 1,
      slow_growth: 1,
    },
    steps: [
      "Improve ventilation. Bad air makes breathing problems worse.",
      "Keep the litter dry and reduce dust.",
      "Call a vet. Antibiotics may be needed.",
    ],
  },
  {
    name: "Avian influenza (bird flu)",
    signs: {
      sudden_deaths: 2,
      swollen_head: 1,
      egg_drop: 1,
      coughing: 1,
      green_diarrhoea: 1,
    },
    steps: [
      "Do not touch dead birds with bare hands.",
      "Keep everyone away from the pen and call a vet and the local veterinary office at once.",
      "Do not sell or move any birds. Bird flu is a reportable disease.",
    ],
    reportable: true,
  },
  {
    name: "Worms",
    signs: {
      weight_loss: 2,
      pale_comb: 1,
      egg_drop: 1,
      no_appetite: 1,
    },
    steps: [
      "Deworm the flock with a drug from a vet or agrovet shop.",
      "Repeat deworming every 8 weeks.",
      "Keep the pen clean so birds do not pick up worms again.",
    ],
  },
];

// Score the ticked symptoms against every condition.
// Returns the conditions that match at least one sign, best first.
export function checkSymptoms(tickedIds) {
  const ticked = new Set(tickedIds);
  const results = CONDITIONS.map((c) => {
    let total = 0;
    let matched = 0;
    for (const [symptom, weight] of Object.entries(c.signs)) {
      total += weight;
      if (ticked.has(symptom)) matched += weight;
    }
    return { ...c, match: total > 0 ? matched / total : 0, matched };
  })
    .filter((r) => r.matched > 0)
    .sort((a, b) => b.match - a.match);

  return results;
}

// Plain words for a match score, so farmers are not misled by a number.
export function confidenceWord(match) {
  if (match >= 0.6) return "looks likely";
  if (match >= 0.35) return "possible";
  return "less likely";
}
