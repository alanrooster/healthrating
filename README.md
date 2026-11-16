<p align="center">
  <a href="https://healthrating.org">
    <img src="https://healthrating.org/og-image.png" width="760" alt="healthrating.org: life expectancy, biological age and disease risk in one health score">
  </a>
</p>

<h1 align="center"><code>healthrating.org</code></h1>

<p align="center">
  <strong>Score your health today. See what to change first.</strong>
</p>

<p align="center">
  14 in-depth assessments and 100+ life factors, each scored against published research,<br>
  distilled into one health score, a life expectancy, a biological age and disease risk screens.<br>
  Free, private, no sign-up.
</p>

<p align="center">
  <a href="https://healthrating.org"><img src="https://img.shields.io/badge/live-healthrating.org-2C9681?style=flat-square&amp;labelColor=131C20" alt="Live at healthrating.org"></a>
  <img src="https://img.shields.io/badge/assessments-14-2C9681?style=flat-square&amp;labelColor=131C20" alt="14 assessments">
  <img src="https://img.shields.io/badge/life_factors-100%2B-2C9681?style=flat-square&amp;labelColor=131C20" alt="100+ life factors">
  <img src="https://img.shields.io/badge/studies_cited-60%2B-2C9681?style=flat-square&amp;labelColor=131C20" alt="60+ studies cited">
  <img src="https://img.shields.io/badge/data_sent_to_servers-0-2C9681?style=flat-square&amp;labelColor=131C20" alt="0 data sent to servers">
  <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/"><img src="https://img.shields.io/badge/license-CC_BY--NC--SA_4.0-DF7149?style=flat-square&amp;labelColor=131C20" alt="License: CC BY-NC-SA 4.0"></a>
</p>

<p align="center">
  <a href="https://healthrating.org"><strong>Start your assessment →</strong></a>
  &nbsp;·&nbsp;
  <a href="https://healthrating.org/methodology">Read the methodology</a>
</p>

---

## More than diet and exercise

Health calculators usually ask about food, exercise, sleep and smoking. Those matter, and they're all here. The research on how long people live points at a lot more:

- Social isolation goes with 29% higher mortality (Holt-Lunstad et al. 2015).
- Every 10 µg/m³ of fine-particle air pollution moves life expectancy by about a year (AQLI 2025).
- Working 55 or more hours a week raises stroke risk by 35% (WHO/ILO 2021).

HealthRating scores all of it: your body, environment, habits, mind, history and circumstances. You answer questions, and it shows where you stand and which change would help most.

## What you get

<table>
  <tr>
    <td width="33%" valign="top">
      <h3>Life expectancy</h3>
      Starts from the United Nations life table for your country, age and sex, then adds or subtracts years for each factor you assess, using published effect sizes.
    </td>
    <td width="33%" valign="top">
      <h3>Biological age</h3>
      Shows whether your habits put you ahead of or behind your calendar age, and which areas move the number.
    </td>
    <td width="33%" valign="top">
      <h3>Disease risk screens</h3>
      A cardiovascular health score on the American Heart Association's Life's Essential 8, plus type 2 diabetes, dementia and cancer risk profiles.
    </td>
  </tr>
</table>

On top of these you get an overall score from 0 to 100 with a letter grade, and an action plan that ranks the areas where you have the most room to improve.

## How it works

1. **Answer simple questions.** 14 short assessments, no lab tests or devices needed.
2. **Watch your dashboard build.** Every completed module sharpens your score, life expectancy, biological age and risk screens in real time. Only completed modules count, so one assessment is enough to start.
3. **Act on what matters most.** The action plan picks your three highest-impact areas, weighted by their share of the overall score.

## 14 assessments, one score

| Assessment | What it looks at | Built on | Weight |
|---|---|---|---:|
| **Mental Health** | Distress, depression and anxiety screens, wellbeing, purpose | Kessler K10, PHQ-2, GAD-2, WHO-5 items | 12% |
| **Body Composition** | BMI, body-fat estimate, waist-to-height ratio | NICE NG246, Deurenberg formula, U.S. Navy method | 11% |
| **Diet** | 18 questions on diet quality, carcinogens and gut health | WHO dietary targets, IARC classifications | 11% |
| **Lifestyle** | Sleep, social connection, habits, sitting, sun, commute, sauna | PSQI principles, Holt-Lunstad meta-analyses | 10% |
| **Exercise** | Activity volume, strength training, steps, functional fitness | WHO GPAQ, WHO 2020 activity guidelines | 10% |
| **Work** | Schedule, burnout, demands, resources, relationships, security | COPSOQ III, Copenhagen Burnout Inventory, WHO/ILO | 7% |
| **Life Context** | Relationships, education, income, community, childhood adversity | Chetty et al. 2016, Balaj et al. 2024, ACE score | 6% |
| **Preventive Care** | Screenings, vaccines and check-ups | USPSTF, CDC, ADA, European Code Against Cancer | 6% |
| **Air Quality** | Annual PM2.5 in your city, noise at home | WHO Air Quality Guidelines 2021, WHO noise guidelines 2018 | 5% |
| **Family History** | Nine heritable conditions | Feeds the diabetes, dementia and cancer profiles | 5% |
| **Personality & Outlook** | Optimism, conscientiousness, sense of control, forgiveness, humor | LOT-R, Jokela et al. 2013 | 5% |
| **Water Quality** | Source, filtration, microplastics, PFAS, hydration | WHO/UNICEF JMP, EU Drinking Water Directive, EFSA | 4% |
| **Senses & Oral Health** | Hearing, vision, teeth and gums | Lancet Commission on dementia 2024 | 4% |
| **Home Environment** | Cookware, plastics, indoor air, PFAS, radon | IARC Monographs, WHO indoor air guidelines, US EPA | 4% |

## Private by design

Your answers are stored in your browser and nowhere else. There is no account, no backend, no analytics and no cookies. The app loads its own static files and nothing from third parties.

## Shows its work

Every formula and every source is on the [methodology page](https://healthrating.org/methodology). Where a number is a judgment call instead of a published figure, the page says so. The main limits:

- **The module weights are a judgment.** No published standard says how much each area of life counts toward health.
- **Biological age is derived from the life expectancy estimate.** It uses no blood biomarkers, so it is not a PhenoAge or epigenetic clock result.
- **Risk screens use only your answers.** Without blood pressure, cholesterol or glucose they cover part of each published instrument and can under-count.
- **Peer comparison bands are an assumption.** No population sample has taken the questionnaire yet.

## Run it locally

```bash
git clone https://github.com/YOUR-USERNAME/healthrating.git
cd healthrating
npm install
npm run dev
```

Then open `http://localhost:3000`.

Built with Next.js, React, Tailwind CSS, shadcn/ui and Lucide icons. All state lives in the browser's local storage.

## Contributing

Help is welcome, and the easiest places to start are:

- **City and country data.** PM2.5 values for cities and water baselines for countries are entered by hand, so some are a little off or out of date. Corrections with a source are quick to merge.
- **Sources.** If a newer or stronger study contradicts a scoring rule, open an issue with the citation.
- **Scoring bugs.** If a result disagrees with what the methodology page says, that's a bug.
- **Translations.** The app is English-only today.

One rule: every scoring change needs a source, and anything that is a judgment call gets labeled as one on the methodology page.

## Not medical advice

HealthRating gives educational estimates based on population-level research. It is not a diagnosis and it does not replace a consultation with a healthcare professional.

## License

[healthrating.org](https://healthrating.org) by [Alan Gallicchio](https://alangallicchio.com) is licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). You are free to use, study, adapt and share it for non-commercial purposes, as long as you credit the source and share your changes under the same license.
