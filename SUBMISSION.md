# CoopSense - Devpost submission texts for SLAY HACKS

Copy each block into the matching Devpost field.

## Project name

CoopSense

## Tagline

A smart helper for small poultry farmers: feed costs, sick-bird checks, egg tracking and vaccine reminders, all in the browser.

## Team

Ibrahim Yahaya (solo), student at the Federal University of Technology Minna, Nigeria.

## Problem Statement

Small poultry farmers in Nigeria lose money in three quiet ways. Feed is the biggest cost on the farm, but many farmers do not know what a day of feed really costs them, or what each egg costs to produce. One sick bird can spread disease through a whole flock before the farmer knows what it is. And a missed vaccine date can wipe out weeks of work. Most farm tools need an account, a subscription or a steady internet connection, which a small farmer with a shared phone often does not have.

## Solution Overview

CoopSense is a web app with four tools for small poultry farmers:

1. **Feed cost calculator.** Enter flock size, the price of a 25kg bag of feed and how much each bird eats per day. It works out feed needed per day, cost per day and per month, cost per bird, bags per month and feed cost per egg. Presets for layers, broilers and chicks.
2. **Health check.** Tick the signs seen in the flock, such as sudden deaths, twisted neck or bloody droppings. It lists the conditions that match best in plain words, with what to do right away. It is a first guide only, not a vet diagnosis, and it says so on the screen.
3. **Egg tracker.** Log eggs collected each day. It shows the 7-day average, laying rate, a bar chart of the last 14 days and a rough 7-day forecast from the trend in the farmer's own records.
4. **Vaccination schedule.** Enter the hatch date and bird type. It lists each vaccine with its due date and marks it due, overdue or coming up, and the farmer ticks each one off when done.

Everything runs in the browser. No account, no server, no API key. Records are saved on the device.

## Key Features

- Feed cost calculator with layer, broiler and chick presets, all money in naira
- Symptom checker covering 8 conditions, ranked by weighted sign matching, with plain-word confidence and next steps
- Reportable disease warning for avian influenza
- Egg log with 7-day average, laying rate, 14-day chart and trend forecast
- Vaccination schedule for layers and broilers with due, overdue and done states
- Works offline after load, big touch targets for farmers on phones
- Records saved in the browser, nothing sent anywhere

## Technologies Used

- React and Vite for the app
- Tailwind CSS with a small design system built in the shadcn style (cards, buttons, inputs, badges, alerts, stat tiles), Lucide icons
- Farm-market design: warm cream background, deep leaf green and terracotta accents, chunky rounded cards; Bitter headings with Nunito Sans body text, self-hosted fonts so it works offline
- Decision-tree symptom scoring, linear trend forecasting and rule-based vaccine scheduling, all written from scratch in plain JavaScript in `src/lib`
- localStorage for egg records and vaccine ticks

## Target Users

- Small poultry farmers in Nigeria keeping layers or broilers
- New farmers who need feed cost and vaccine guidance in plain language
- Students and family farms tracking eggs and costs on a phone

## Challenges

The health check had to be honest. A wrong answer could cost a farmer a whole flock, so the checker shows plain words like "looks likely" or "possible" instead of a confident diagnosis, ranks every match, and tells the farmer to call a vet when birds are dying. The forecast is also kept rough and clearly labelled as a guide, because weather, feed and disease can push laying up or down. Everything had to run offline on a modest phone, which ruled out paid APIs and pushed the design toward small, fast logic in the browser.

## What I learned

Useful tools for farmers are mostly about clear numbers and clear next steps. Feed cost per egg, a laying rate, a vaccine due date: small facts, shown plainly, change decisions. I also learned that honest limits build trust. Saying "this is a guide, not a vet" on the screen matters as much as the matching itself.

## Future improvements

- Hausa language option for wider reach
- Feed price reminders when a bag is running low
- More conditions and local vet contacts in the health check
- Export egg records and share a simple weekly summary

## Demo

- Live demo: https://siribraheem.github.io/coopsense/
- Demo video: https://youtu.be/fmph06SmerQ
- Source code: https://github.com/SIRIBRAHEEM/coopsense
- Screenshots: in the docs folder of the repo (feed calculator, health check, egg tracker, vaccines, mobile views)

## Setup steps

```bash
npm install
npm run dev
```

Open the local address Vite prints. Use the four tabs at the top: Feed cost, Health check, Egg tracker and Vaccines.

## Credits and acknowledgements

- React, Vite, Tailwind CSS and Lucide (open source)
- Bitter and Nunito Sans fonts from Google Fonts (OFL licence), self-hosted in the repo
- Built for SLAY HACKS 2026
