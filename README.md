# CoopSense

A smart helper for small poultry farmers. It helps you work out feed
costs, check sick birds, track egg laying and keep vaccines on time.

I built it for small farms in Nigeria, where feed is the biggest cost,
one sick bird can spread disease through a whole flock, and a missed
vaccine can wipe out weeks of work. My family runs a poultry farm, so
this is a problem I know from home.

## What it does

**Feed cost calculator.** Enter your flock size, the price of a 25kg
bag of feed and how much each bird eats per day. It works out the feed
you need per day, what it costs per day and per month, and what each
egg costs you to produce. There are presets for layers, broilers and
chicks.

**Health check.** Tick the signs you see in your flock, for example
sudden deaths, twisted neck or bloody droppings. It lists the
conditions that match best, in plain words like "looks likely" or
"possible", with what to do right away. It is a first guide only, not
a vet diagnosis, and it says so on the screen. If birds are dying, it
tells you to call a vet quickly.

**Egg tracker.** Log how many eggs you collect each day. It shows your
7-day average, your laying rate and a bar chart of the last 14 days.
It also gives a rough forecast for the next 7 days, worked out from
the trend in your own records. Your records are saved in the browser.

**Vaccination schedule.** Enter the day your chicks hatched and pick
layers or broilers. It lists each vaccine with its due date, and marks
each one due, overdue or coming up. You tick each one off when it is
done. The schedule covers Marek's, Gumboro, Newcastle, fowl pox, fowl
typhoid and deworming.

## How the AI works

There is no chatbot and no paid API here. The "AI" in CoopSense is
three small, honest pieces of logic that run in the browser:

1. **Decision-tree triage.** Each condition (Newcastle, coccidiosis,
   Gumboro and five others) has a list of signs, weighted by how much
   each sign points to it. The checker scores the signs you tick
   against each condition and ranks the matches.
2. **Trend forecasting.** The egg forecast fits a straight line
   through your recent daily counts and reads off the next 7 days.
   It is a rough guide, not a promise.
3. **Rule-based scheduling.** Vaccine dates come from the chicks'
   age and a standard schedule used by small farms in Nigeria.

Everything runs locally. There is no server and no account. The only
data stored is your egg records and vaccine ticks, in your browser.

## How to run it

You need Node.js installed.

```bash
npm install
npm run dev
```

Then open the address it prints, usually http://localhost:5173.

To build the production version:

```bash
npm run build
npm run preview
```

## Tech used

React and Vite with Tailwind CSS. The interface is a small design
system built with Tailwind in the shadcn style: cards, buttons,
inputs, badges, alerts and stat tiles defined once in
`src/index.css` and reused on every screen, with Lucide icons. The
look is a farm-market theme (warm cream, deep leaf green and
terracotta) with Bitter headings and Nunito Sans body text, both
self-hosted so the app works offline. All the logic is in
`src/lib` (feed maths, the symptom checker, the forecast and the
vaccine schedule) and the four screens are in `src/components`.

## Notes

- All money is in naira. A standard bag of feed is 25kg.
- The health check is a guide, not a diagnosis. Always talk to a vet
  when birds are dying.
- The vaccine schedule is a common one for small farms in Nigeria.
  Your vet may change the timing for your area, so follow your vet
  where it differs.
- Avian influenza is a reportable disease. If the checker points to
  it, contact a vet and the local veterinary office at once.

## SLAY HACKS 2026

Built for SLAY HACKS 2026 (https://slayy-hacks.devpost.com/), an AI
hackathon for students and first-time builders. Submission deadline:
7 December 2026.
