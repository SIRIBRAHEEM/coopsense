// Vaccination schedule used by many small farms in Nigeria.
// Ages are in days from hatching. "both" means layers and broilers.
// Broilers are usually sold by 6 to 8 weeks, so the later vaccines
// are for layers only. Always confirm timing with your vet.

export const VACCINES = [
  {
    name: "Marek's disease",
    dayFrom: 1,
    dayTo: 1,
    for: "both",
    note: "Given at the hatchery on day 1. Ask your hatchery if it was done.",
  },
  {
    name: "Gumboro (IBD) - 1st dose",
    dayFrom: 10,
    dayTo: 14,
    for: "both",
    note: "First dose in drinking water.",
  },
  {
    name: "Newcastle (La Sota) - 1st dose",
    dayFrom: 14,
    dayTo: 21,
    for: "both",
    note: "In drinking water or as eye drops.",
  },
  {
    name: "Gumboro (IBD) - 2nd dose",
    dayFrom: 21,
    dayTo: 28,
    for: "both",
    note: "Second dose in drinking water.",
  },
  {
    name: "Fowl pox",
    dayFrom: 42,
    dayTo: 56,
    for: "layers",
    note: "Wing web stab. Layers only, broilers are sold before this age.",
  },
  {
    name: "Fowl typhoid",
    dayFrom: 56,
    dayTo: 70,
    for: "layers",
    note: "In drinking water. Layers only.",
  },
  {
    name: "Newcastle booster",
    dayFrom: 56,
    dayTo: 70,
    for: "layers",
    note: "Booster for layers. Repeat every 8 to 12 weeks after this.",
  },
  {
    name: "Deworming",
    dayFrom: 56,
    dayTo: 56,
    for: "both",
    note: "First deworming at 8 weeks, then repeat every 8 weeks.",
  },
];

// Work out the status of each vaccine from the chicks' age in days.
export function vaccineStatus(vaccine, ageDays) {
  if (ageDays > vaccine.dayTo) return "overdue";
  if (ageDays >= vaccine.dayFrom) return "due";
  return "coming";
}
