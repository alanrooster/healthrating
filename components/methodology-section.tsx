import type { ReactNode } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

// A real heading: CardTitle renders a div, which gives screen readers and search engines no outline
function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-lg font-semibold leading-tight tracking-tight text-balance text-foreground">{children}</h2>
}

export function MethodologySection() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">
          Methodology & Sources
        </h1>
        <p className="text-sm text-muted-foreground">
          How each assessment is scored and the scientific sources behind the
          calculations.
        </p>
      </div>

      <Card>
        <CardHeader>
          <SectionTitle>
            Body Composition (11% of overall score)
          </SectionTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Combines standard BMI with a small age allowance (0.12 BMI units
            per decade after 20), a sex-specific body-fat estimate and
            ethnicity-specific cut-offs. Body fat is estimated with the
            Deurenberg formula and, when measurements are provided, averaged
            with a circumference method: the U.S. Navy equation for men (waist
            and neck) and Relative Fat Mass for women (waist only; the Navy
            female equation needs hip circumference).
          </p>
          <p>
            NICE NG246 (2025) lowers the BMI cut-offs to 23 (overweight) and
            27.5 (obesity) for people of South Asian, Chinese, other Asian,
            Middle Eastern, Black African or African-Caribbean background, who
            carry higher cardiometabolic risk at the same BMI. The app always
            uses the strictest cut-off: obesity starts at 27.5 for all of these
            groups, and overweight at 23, or 22.5 for South Asian backgrounds,
            the group with the highest risk at a given BMI (Caleyachetty et al.
            2021). Underweight starts below 18.5 for everyone. Pacific Islander
            backgrounds carry more lean mass at the same BMI (Swinburn et al.
            1999), but no current guideline raises their cut-offs, so the
            standard WHO cut-offs apply. The results always show the WHO
            international classification of your standard BMI for reference.
          </p>
          <p>
            A waist-to-height ratio of 0.5 or more flags increased risk, and 0.6
            or more high risk, at any BMI (NICE). Following the 2025 Lancet
            Commission on clinical obesity, an obesity-range BMI is flagged for
            confirmation with waist measures rather than treated as a diagnosis.
          </p>
          <p className="text-xs">
            Sources: NICE NG246 (2025), Caleyachetty et al. Lancet Diabetes
            &amp; Endocrinology (2021), Rubino et al. Lancet Commission (2025),
            WHO Expert Consultation (2004), Swinburn et al. (1999), Deurenberg
            et al. (1991, 2002), Woolcott &amp; Bergman Scientific Reports
            (2018), U.S. Navy Body Composition Assessment.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle>
            Air Quality (5% of overall score)
          </SectionTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Annual average PM2.5 makes up 70% of the score and noise at home
            30%. PM2.5 is compared with the WHO Air Quality Guidelines (2021):
            100 points at or below the guideline of 5 µg/m³, falling to 70 at
            10, 50 at 15, 30 at 25 and 15 at 35. Noise follows the WHO
            Environmental Noise Guidelines (2018), which advise keeping road
            traffic noise below 53 dB.
          </p>
          <p>
            City values are approximate annual means, entered by hand from the
            WHO Ambient Air Quality Database and the IQAir World Air Quality
            Report (2023-2024 editions), so a city can be a few µg/m³ off or
            out of date. The life expectancy estimate compares your city with
            your country&apos;s average (WHO, SDG indicator 11.6.2).
          </p>
          <p className="text-xs">
            Sources: WHO Global Air Quality Guidelines (2021), WHO Environmental
            Noise Guidelines for the European Region (2018), WHO Ambient Air
            Quality Database, IQAir World Air Quality Report 2024, WHO Global
            Health Observatory (SDG indicator 11.6.2).
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle>
            Water Quality (4% of overall score)
          </SectionTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Combines country-level water infrastructure data with personal
            consumption habits and exposure to microplastics and PFAS.
          </p>
          <p>
            <strong>Scoring components:</strong>
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-1">
            <li>
              <strong>Country Baseline (20%):</strong> An approximate country
              score, entered by hand with two guides: the share of people with
              safely managed drinking water (WHO/UNICEF Joint Monitoring
              Programme) and the drinking-water indicator of the Environmental
              Performance Index. It is not computed from either dataset and
              can sit 20 points or more away from the JMP share.
            </li>
            <li>
              <strong>Water Source (20%):</strong> Municipal tap, private well,
              spring, rainwater, or bottled water. Adjusted by country baseline.
            </li>
            <li>
              <strong>Home Filtration (15%):</strong> Type of filtration
              (none, pitcher, faucet, under-sink, reverse osmosis, whole-house,
              distillation) and maintenance status.
            </li>
            <li>
              <strong>Plastic/Microplastic Exposure (20%):</strong> Frequency of
              bottled water consumption, bottle type (plastic vs glass vs metal),
              quantity per week, and storage conditions. A litre of bottled
              water carries about 240,000 plastic particles, 90% of them
              nanoplastics: 10 to 100 times more than earlier counts, which
              missed the smallest particles (Qian et al. 2024). Boiling water
              raised BPA release from polycarbonate bottles up to 55-fold (Le
              et al. 2008).
            </li>
            <li>
              <strong>PFAS (10%):</strong> Your supplier&apos;s latest PFAS
              result, or living near a likely source such as an airport,
              military base or fluorochemical plant. Since 12 January 2026, EU
              tap water must stay below 0.1 µg/L for the sum of 20 PFAS; the US
              EPA limit is 4 ng/L each for PFOA and PFOS. IARC classifies PFOA
              as carcinogenic to humans (Group 1). Maintained filters reduce
              the penalty in line with independent tests: reverse osmosis and
              two-stage under-sink filters removed 94% or more, pitcher and
              faucet filters about 73% (Herkert et al. 2020).
            </li>
            <li>
              <strong>Infrastructure (10%):</strong> Building age (lead pipe risk),
              known plumbing issues, recent renovation, observed water quality issues.
            </li>
            <li>
              <strong>Hydration (5%):</strong> Daily water intake against the
              EFSA adequate intakes of 2.0 litres of total water a day for
              women and 2.5 for men, about 80% of it from drinks (EFSA 2010).
            </li>
          </ul>
          <p className="text-xs">
            Sources: WHO/UNICEF JMP (2023), Environmental Performance Index (2024),
            WHO Microplastics in Drinking-water (2019), Mason et al. (2018),
            Qian et al. PNAS (2024), Le et al. Toxicology Letters (2008), EFSA
            Dietary Reference Values for Water (2010),
            EU Drinking Water Directive 2020/2184 (PFAS limits from 2026), US EPA
            PFAS rule (2024), IARC Monographs Vol. 135 (2023), Herkert et al.
            ES&amp;T Letters (2020).
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle>
            Diet Assessment (11% of overall score)
          </SectionTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            18 questions covering key dietary indicators from WHO guidelines and
            IARC (International Agency for Research on Cancer) carcinogen
            classifications. Integrates nutritional quality, cancer risk, gut
            microbiome support, and hydration.
          </p>
          <p>
            <strong>IARC Carcinogen Classifications (food-related):</strong>
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-1">
            <li>
              <strong>Group 1 (Carcinogenic):</strong> Processed meat (bacon,
              ham, sausages, hot dogs - 18% increased colorectal cancer risk
              per 50g/day), alcoholic beverages (linked to 7 cancer types),
              Chinese-style salted fish (nasopharyngeal cancer).
            </li>
            <li>
              <strong>Group 2A (Probably carcinogenic):</strong> Red meat
              (beef, pork, lamb), very hot beverages above 65°C (esophageal
              cancer) and acrylamide, which forms when starchy food is fried,
              baked or toasted at high temperature (chips, fries, burnt toast).
            </li>
            <li>
              <strong>Group 2B (Possibly carcinogenic):</strong> Pickled
              vegetables (Asian-style), aspartame (artificial sweetener).
            </li>
          </ul>
          <p>
            IARC groups rate how strong the evidence is that something can
            cause cancer, not how large the risk is: processed meat shares
            Group 1 with tobacco smoke, but smoking raises cancer risk far
            more. The score therefore follows how often you have each item.
          </p>
          <p>
            <strong>WHO Dietary Targets:</strong> 400g+ fruits/vegetables daily,
            less than 10% energy from free sugars, less than 5g salt/day,
            limited saturated fats and ultra-processed foods. Since January
            2025 WHO also recommends potassium-enriched, lower-sodium salt
            substitutes in place of regular table salt (not in pregnancy,
            kidney disease or with potassium-sparing medicines, which are left
            out of the score). In the SSaSS trial of 20,995 people they cut
            strokes by 14% and deaths by 12% (Neal et al. 2021).
          </p>
          <p>
            <strong>Gut Microbiome &amp; Hydration:</strong> Fermented foods
            (yogurt, kefir, kimchi, miso) increase gut microbiome diversity and
            reduce 19 inflammatory markers (Wastyk et al. 2021, Cell — Stanford
            fermented-food trial). Adequate hydration is associated with slower
            biological aging and lower chronic disease risk (Dmitrieva et al.
            2023, eBioMedicine/NIH — serum sodium as hydration marker).
          </p>
          <p className="text-xs">
            Sources: IARC Monographs Vol. 114 (Red Meat, Processed Meat, 2015),
            IARC Monographs Vol. 100E (Alcohol, 2012), IARC Monographs Vol. 116
            (Hot Beverages, 2018), WHO Healthy Diet Fact Sheet (2024), WHO HDMI
            Guidance (2024), WHO guideline on lower-sodium salt substitutes
            (2025), Neal et al. NEJM (2021), Wastyk et al. Cell (2021),
            Dmitrieva et al. eBioMedicine (2023).
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle>
            Exercise Assessment (10% of overall score)
          </SectionTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Combined activity (70%) and functional fitness (30%) score, with a
            sedentary behavior penalty on the activity part.
          </p>
          <p>
            <strong>Activity sub-score</strong> combines three parts:
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-1">
            <li>
              <strong>Aerobic volume (60%):</strong> MET-minutes/week from work,
              transport and recreation, measured with the WHO Global Physical
              Activity Questionnaire (GPAQ). Walking or cycling for transport
              counts at 3.3 MET (the IPAQ walking value), stricter than the 4.0
              MET in the GPAQ analysis guide. The results screen shows the WHO
              GPAQ total alongside. The curve is strict: 30 points at 600
              MET-minutes a week (the WHO minimum), 60 at 1,200, 85 at 3,000
              and 100 at 6,000, although mortality stops falling at about 3 to
              5 times the minimum (Arem et al. 2015).
            </li>
            <li>
              <strong>Muscle strengthening (25%):</strong> Days per week, with
              full credit from 2 days, the WHO minimum. Momma et al. (BJSM 2022)
              linked muscle-strengthening activity to 10-17% lower all-cause
              mortality, largest at 30-60 minutes a week, and about 40% lower
              when combined with aerobic activity.
            </li>
            <li>
              <strong>Daily steps (15%, optional):</strong> Ding et al. (Lancet
              Public Health 2025): compared with 2,000 steps a day, about 7,000
              is linked to 47% lower all-cause mortality and 38% lower dementia
              risk, with the steepest gains up to 5,000-7,000. Without step
              data, the other two parts are reweighted.
            </li>
          </ul>
          <p>
            <strong>Functional Fitness sub-score</strong> uses self-reported
            proxies for clinically validated mortality predictors:
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-1">
            <li>
              <strong>Stair-climbing capacity (30%):</strong> Proxy for
              cardiorespiratory fitness (VO2 max). In Mandsager et al. (JAMA
              Network Open 2018) low fitness carried a mortality risk at least
              as large as smoking, and the least fit group had 5 times the
              mortality of the elite group.
            </li>
            <li>
              <strong>Walking pace (30%):</strong> In Studenski et al. (JAMA
              2011) survival predicted from age, sex and gait speed alone was
              as accurate as predictions that also used chronic conditions,
              smoking, blood pressure, BMI and hospitalisation.
            </li>
            <li>
              <strong>Grip strength (25%):</strong> Leong et al. (Lancet 2015,
              PURE study, n=140k): each 5kg lower grip strength = +16%
              all-cause mortality. Stronger predictor than systolic blood pressure.
            </li>
            <li>
              <strong>Resting heart rate (15%):</strong> Each extra 10 bpm goes
              with 9% higher all-cause mortality, and above 80 bpm it is 45%
              higher than at the lowest rates (Zhang et al., CMAJ 2016, 1.2
              million adults).
            </li>
          </ul>
          <p>
            WHO recommends at least 150-300 minutes of moderate-intensity or
            75-150 minutes of vigorous-intensity physical activity per week
            (equivalent to 600-1200 MET-minutes/week), plus muscle-strengthening
            activity on 2 or more days a week.
          </p>
          <p className="text-xs">
            Sources: WHO Guidelines on Physical Activity and Sedentary Behaviour
            (2020), GPAQ Analysis Guide, Momma et al. British Journal of Sports
            Medicine (2022), Ding et al. Lancet Public Health (2025), Arem et
            al. JAMA Internal Medicine (2015), Mandsager et al. JAMA Network
            Open (2018), Studenski et al. JAMA (2011), Leong et al. Lancet
            (2015, PURE Study), Zhang et al. CMAJ (2016).
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle>
            Work Assessment (7% of overall score)
          </SectionTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Comprehensive psychosocial work environment assessment based on
            internationally validated instruments. Starts with employment status
            screening to adapt questions appropriately.
          </p>
          <p>
            <strong>For employed individuals, covers 6 domains:</strong>
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-1">
            <li>
              <strong>Work Schedule (12%):</strong> Hours, shift type, commute.
              Radiation at work (aircrew, industries handling naturally
              radioactive material, underground radon, dosimeter-monitored jobs)
              takes off 2-6 points: the EU requires dose assessment for aircrew
              above 1 mSv a year and for these industries (Directive
              2013/59/Euratom), and solid cancer risk rises 52% per Gy even at
              low doses (INWORKS, Richardson et al. 2023).
              WHO/ILO Joint Estimates (2021) show 55+ hours/week increases stroke
              risk by 35% and ischaemic heart disease by 17%. IARC Monograph 124
              classifies night shift work as Group 2A (probably carcinogenic).
            </li>
            <li>
              <strong>Burnout (22%):</strong> Exhaustion, overwhelm, cynicism.
              Based on Copenhagen Burnout Inventory (Kristensen 2005) and Maslach
              Burnout Inventory (Maslach & Jackson 1981) three-factor model.
            </li>
            <li>
              <strong>Job Demands (15%):</strong> Quantitative, emotional, and
              cognitive demands from COPSOQ III. High demands without adequate
              resources predict stress-related illness.
            </li>
            <li>
              <strong>Job Resources (18%):</strong> Job control, role clarity,
              meaning of work, development opportunities. Karasek Job
              Demand-Control model (1979): low control with high demands makes
              a high-strain job, which carries 23% more coronary heart disease
              (Kivimäki et al. 2012, pooled European cohorts).
            </li>
            <li>
              <strong>Workplace Relationships (20%):</strong> Social support from
              colleagues and supervisors (Johnson JDC-S 1988), quality of
              leadership, organizational justice, recognition (Siegrist ERI),
              bullying exposure (EU-OSHA), sense of community, work-life conflict.
              COPSOQ III (2019-2025) validated in 18+ countries.
            </li>
            <li>
              <strong>Job Security (13%):</strong> Employment security, insecurity
              over working conditions, effort-reward balance (Siegrist 1996).
              Effort-reward imbalance carries 16% more coronary heart disease,
              41% together with job strain (Dragano et al. 2017).
            </li>
          </ul>
          <p>
            Non-employed statuses (retired, unemployed, student) receive
            adapted assessments covering relevant stressors like social isolation,
            purpose, and financial stress.
          </p>
          <p className="text-xs">
            Sources: COPSOQ III (Burr et al. 2019, Berthelsen 2020, Australian
            validation 2025), WHO/ILO Joint Estimates (2021), IARC Monograph 124
            (2019), Copenhagen Burnout Inventory (Kristensen 2005), Maslach
            Burnout Inventory (1981), Effort-Reward Imbalance model (Siegrist
            1996), Job Demand-Control-Support model (Karasek 1979, Johnson 1988),
            Kivimäki et al. Lancet (2012), Dragano et al. Epidemiology (2017),
            WHO Guidelines on Mental Health at Work (2022), EU-OSHA Psychosocial
            Risks Framework (2022-2025), ILO Psychosocial Hazards (2022).
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle>
            Lifestyle Assessment (10% of overall score)
          </SectionTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Eight sub-domains measuring daily lifestyle factors with established
            longevity effects. Weights: Sleep 22%, Social Connection 16%,
            Habits 16%, Sedentary Time 13%, Leisure & Balance 12%, Sun &amp;
            Radiation 8%, Commute 8%, Sauna 5%.
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-1">
            <li>
              <strong>Sleep:</strong> Pittsburgh Sleep Quality Index (PSQI)
              principles - duration, quality, latency, consistency, daytime
              dysfunction. Target 7-9h for adults (National Sleep Foundation;
              AASM/SRS: at least 7h). Bedroom light at night takes 10% of the
              sleep score: among 88,905 UK Biobank adults wearing light
              sensors, the brightest nights carried 28-56% more coronary
              disease, heart attack, heart failure, atrial fibrillation and
              stroke (Windred et al. 2025) and higher mortality (Windred et al.
              2024).
            </li>
            <li>
              <strong>Social Connection:</strong> Holt-Lunstad meta-analyses
              (2010, 2015) - social isolation increases mortality 29%,
              comparable to smoking 15 cigarettes/day.
            </li>
            <li>
              <strong>Sedentary Time:</strong> Sitting 6 or more hours a day in
              leisure time, against under 3, goes with 19% higher all-cause
              mortality after adjusting for activity (Patel et al. 2018). Over
              8 hours a day with little activity it reaches 59%, and 60-75
              minutes of moderate activity a day removes the excess (Ekelund
              et al. 2016). Breaking up sitting reduces metabolic harm.
            </li>
            <li>
              <strong>Sun &amp; Radiation:</strong> Holick (2007) for vitamin D
              synthesis (10-30 min/day optimal, researched in Boston: Webb, Kline
              &amp; Holick 1988); AAD on sunscreen and sunburn skin cancer risk.
              The minute bands follow the yearly UV dose of your Air Quality
              city against Boston (NASA POWER climatology 2001-2025, 564 cities;
              r = 0.93 with WHO&apos;s 2004 country values) and only move to the
              stricter side: in Sydney (1.6× Boston) the window ends at 19
              minutes, while in Oslo (0.6×) the vitamin D minimum rises and the
              upper end stays at 30. Sunbeds (IARC Group 1) take off 5 points for
              past use and up to 30 for regular use: any use raises melanoma risk
              by 20%, first use before 35 by 87% (Boniol et al. 2012). Flying as
              a passenger takes off 2 points from 100 hours a year and 5 from
              200, when cosmic radiation at 4-5 µSv an hour (Bagshaw 2008)
              reaches 1 mSv, the EU dose limit for the public.
            </li>
            <li>
              <strong>Commute:</strong> Among 21,000 Swedish workers, commuting
              by car or public transport went with more everyday stress,
              exhaustion, poor sleep and low self-rated health than walking or
              cycling, with odds 1.2 to 1.6 times higher for public-transport
              commutes over an hour (Hansson et al. 2011). Longer commuting
              distances go with lower fitness and higher BMI, waist and blood
              pressure (Hoehner et al. 2012).
            </li>
            <li>
              <strong>Sauna:</strong> Laukkanen et al. 2015 (JAMA Internal
              Medicine, Finland, n=2,315) - 4-7 sauna sessions/week
              associated with 40% lower all-cause mortality and 50% lower
              cardiovascular mortality vs 1 session/week.
            </li>
            <li>
              <strong>Leisure & Balance:</strong> Recreational screen time,
              outdoor/nature exposure, hobby engagement.
            </li>
            <li>
              <strong>Habits:</strong> Smoking (45% of the habits score; WHO -
              8M deaths/year), alcohol (40%; WHO - no safe level) and caffeine
              (15%), minus points for drug use. A drink counts as 12 g of pure
              alcohol, and 5 or more in one session as heavy episodic drinking
              (60 g, WHO). Caffeine keeps full marks up to 3 cups of coffee a
              day: 3-4 cups go with the lowest mortality (Poole et al. 2017)
              and up to 400 mg a day is safe for adults (EFSA 2015). Tobacco,
              alcohol and drugs also take points off the overall score (see
              Overall Health Score). Any drug use in your life counts, the strictest reading of the WHO
              ASSIST screening questions (lifetime use, recent use, injecting),
              though a single use long ago has no measured long-term effect, so
              it costs only a few points (Aslibekyan et al. 2008). Cannabis
              takes off 2 points if tried once, up to 25 if used daily: regular
              use was linked to twice the risk of cardiovascular death (Storck
              et al. 2025), rising with days of use (Jeffers et al. 2024). Other
              drugs (cocaine, amphetamines, ecstasy, opioids, ketamine,
              hallucinogens, medicines not prescribed to you) take off 5 points
              if tried once, up to 65 if used weekly: regular use multiplies
              mortality 6 to 10 times (Peacock et al. 2021; Stockings et al.
              2019; Larney et al. 2020). Injecting takes off 15 more, or 35
              within the past year, as it can pass on hepatitis and HIV
              (Degenhardt et al. 2023). Weekly use of these drugs or injecting
              in the past year also takes about 15 years off life expectancy
              (Lewer et al. 2020). People who never used drugs score exactly as
              they would without these questions.
            </li>
          </ul>
          <p className="text-xs">
            Sources: PSQI (Buysse et al. 1989), National Sleep Foundation
            (Hirshkowitz et al. 2015) and AASM/SRS (Watson et al. 2015) sleep
            duration recommendations, Holt-Lunstad et al. PLoS Medicine (2010)
            and Perspectives on Psychological Science (2015), Patel et al.
            American Journal of Epidemiology (2018), Ekelund et al. Lancet
            (2016), Holick NEJM (2007), Hansson et al. BMC Public Health
            (2011), Hoehner et al. American Journal of Preventive Medicine
            (2012), Poole et al. BMJ (2017), EFSA Scientific Opinion on the
            safety of caffeine (2015), Laukkanen et al. JAMA Internal Medicine
            (2015), Windred et
            al. PNAS (2024) and JAMA Network Open (2025), Storck et al. Heart
            (2025), Jeffers et al. JAHA (2024), WHO/CDC substance use evidence.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle>
            Life Context & Relationships (6% of overall score)
          </SectionTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Captures social, economic, and biographical factors with documented
            multi-year longevity effects. Weights: Relationship 22%, Children
            8%, Education 16%, Income, Financial Stress &amp; Literacy 22%,
            Religion/Spirituality 8%, Community 10% (volunteering 6%, pets
            4%), Childhood Adversity (ACEs) 14%.
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-1">
            <li>
              <strong>Marital/Relationship Status & Quality:</strong> At 65,
              married men live 2.2 years longer and married women 1.5 than
              unmarried peers, part of it because healthier people marry (Jia
              &amp; Lubetkin 2020). Quality counts as well: better marital
              quality goes with lower mortality (Robles et al. 2014
              meta-analysis), so the score weighs both status and quality.
            </li>
            <li>
              <strong>Parenthood:</strong> At 60, parents live 2 years longer
              (men) and 1.5 (women) than childless adults (Modig et al. 2017).
              Having no children goes with 19% higher all-cause mortality, and
              the lowest mortality sits at moderate family sizes (Zeng et al.
              2016).
            </li>
            <li>
              <strong>Education:</strong> Balaj et al. 2024 (Lancet Public
              Health) global meta-analysis - each additional year of schooling
              lowers adult all-cause mortality risk by ~1.9%; tertiary
              education ~34% lower risk vs none. In the US, the adult
              life-expectancy gap between people with and without a four-year
              degree reached 8.5 years in 2021 (Case &amp; Deaton 2023).
            </li>
            <li>
              <strong>Income & Financial Literacy:</strong> Chetty et al.
              2016 (JAMA) - top 1% vs bottom 1% income gap = 14.6 years
              (men), 10.1 years (women) in US. Carlsson et al. 2014 - Swedish
              60-year-olds without a cash margin had about twice the all-cause
              mortality. Sweet et al. 2013 - debt
              stress correlates with hypertension and depression.
            </li>
            <li>
              <strong>Religious/Spiritual Practice:</strong> Li, Stampfer,
              Williams &amp; VanderWeele 2016 (JAMA Internal Medicine, Nurses
              Health Study, n=74,534) - attending services more than once a
              week associated with 33% lower all-cause mortality, partly
              explained by social support, fewer depressive symptoms and less
              smoking.
            </li>
            <li>
              <strong>Pet Ownership:</strong> Kramer et al. 2019 meta-analysis
              - dog owners have ~24% lower all-cause mortality, with a larger
              benefit after a heart attack; the AHA (2013) considers pet
              ownership probably protective against cardiovascular disease.
            </li>
            <li>
              <strong>Volunteering:</strong> Kim et al. 2020 (Harvard, AJPM)
              - 100+ hours/year volunteering = 44% lower mortality vs none.
            </li>
            <li>
              <strong>Childhood Adversity (ACEs):</strong> Felitti et al. 1998
              defined the ACE score and linked 4+ ACEs to a 4- to 12-fold
              higher risk of depression, substance misuse and suicide attempts;
              in follow-up, people with 6 or more ACEs died nearly 20 years
              earlier on average (Brown et al. 2009).
            </li>
          </ul>
          <p className="text-xs">
            Sources: Jia &amp; Lubetkin SSM - Population Health (2020), Robles
            et al. Psychological Bulletin (2014), Modig et al. Journal of
            Epidemiology &amp; Community Health (2017), Zeng et al. Scientific
            Reports (2016), Balaj et al. Lancet Public Health (2024), Case
            &amp; Deaton Brookings Papers on Economic Activity (2023), Chetty
            et al. JAMA (2016), Carlsson et al. BMC Public Health (2014), Sweet
            et al. (2013), Li et al. JAMA Internal Medicine (2016), Kramer et
            al. Circulation: CQO (2019), AHA Scientific Statement on Pets
            (2013), Kim et al. American Journal of Preventive Medicine (2020),
            Felitti et al. (1998), Brown et al. (2009).
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle>
            Personality & Outlook (5% of overall score)
          </SectionTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Five psychological traits linked to longevity. Weights: Optimism
            30%, Conscientiousness 25%, Sense of Control 18%, Forgiveness 14%,
            Humor 13%. Purpose &amp; meaning is scored in the Mental Health
            module.
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-1">
            <li>
              <strong>Optimism:</strong> Lee et al. 2019 (PNAS, n=70,000+
              women, follow-up Nurses&apos; Health Study + VA cohort) - top
              quartile optimists live 11-15% longer with 50-70% higher chance
              of reaching age 85. Measured via Life Orientation Test-Revised
              (LOT-R, Scheier &amp; Carver).
            </li>
            <li>
              <strong>Conscientiousness:</strong> In 76,150 adults from 7
              cohorts, the least conscientious third had 37% higher mortality
              (Jokela et al. 2013; reviewed in Friedman &amp; Kern 2014). Big
              Five trait covering organization, reliability, and
              self-discipline.
            </li>
            <li>
              <strong>Sense of Control / Self-Efficacy:</strong> High internal
              locus of control associated with longer survival and better
              health outcomes.
            </li>
            <li>
              <strong>Forgiveness:</strong> Toussaint et al. 2012 - among US
              adults aged 66 and over, forgiving others only on conditions
              predicted higher mortality.
            </li>
            <li>
              <strong>Humor:</strong> Romundstad et al. 2016 (Norway HUNT
              study, n=53,556) - a high cognitive sense of humour went with
              48% lower all-cause mortality in women and with fewer deaths
              from infection in both sexes; no all-cause difference in men.
            </li>
            <li>
              <strong>Purpose &amp; Meaning</strong> (scored in the Mental
              Health module): Hill &amp; Turiano 2014 - sense of purpose
              associated with reduced all-cause mortality across the lifespan.
            </li>
          </ul>
          <p className="text-xs">
            Sources: Lee et al. PNAS (2019), Scheier &amp; Carver LOT-R (1985,
            1994), Jokela et al. American Journal of Epidemiology (2013),
            Friedman &amp; Kern Annual Review of Psychology (2014),
            Toussaint et al. Journal of Behavioral Medicine (2012),
            Romundstad et al. Psychosomatic Medicine (2016), Hill &amp;
            Turiano Psychological Science (2014).
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle>
            Home Environment & Exposures (4% of overall score)
          </SectionTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Evaluates modifiable household exposures across five clusters:
            cookware &amp; food-contact plastics (25%), food safety &amp;
            cleaning (28%), indoor air quality (30%), PFAS in textiles &amp;
            personal care (9%, close to the 10% PFAS has in the Water score)
            and radiation &amp; fields (8%). Individually each exposure is
            small, but they are chronic and additive over a lifetime.
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-1">
            <li>
              <strong>Cookware (PFAS / microplastics):</strong> Luo et al. 2022
              (Science of the Total Environment) found a single scratch in
              nonstick (PTFE/Teflon) coating can release ~9,100 microplastic
              particles, and a badly broken coating up to ~2.3 million particles
              during cooking. Stainless steel, cast iron, glass and ceramic are
              inert alternatives.
            </li>
            <li>
              <strong>Food-contact plastics:</strong> Hussain et al. 2023
              (Environ. Sci. Technol.) showed microwaving polypropylene
              containers can release &gt;2 billion nanoplastics + ~4 million
              microplastics per cm² in 3 minutes. Plastic and canned packaging
              also leach BPA and phthalates: three days of fresh food with
              little packaging cut urinary BPA by 66% and DEHP metabolites by
              53-56% (Rudel et al. 2011).
            </li>
            <li>
              <strong>Mold &amp; mycotoxins:</strong> Aflatoxin B1 from moldy
              grains/nuts is an IARC Group 1 human carcinogen (liver cancer).
              Mycotoxins penetrate beyond visible mold, so soft moldy foods
              should be discarded whole, not trimmed (USDA / IARC).
            </li>
            <li>
              <strong>House dust:</strong> Mitro et al. 2016 (Environ. Sci.
              Technol.) identified dozens of endocrine-disrupting chemicals
              (PBDEs, phthalates, PFAS, lead) concentrated in house dust;
              regular wet-dusting and HEPA vacuuming reduce exposure.
            </li>
            <li>
              <strong>Cleaning products:</strong> In Svanes et al. 2018 (Am. J.
              Respir. Crit. Care Med.) women who cleaned at home lost lung
              function faster over 20 years (FEV1 -22.1 against -18.5 ml a
              year), with sprays and other cleaning agents alike; no effect
              was seen in men. Fragrance-free / low-VOC ("bio") products and
              ventilation limit the exposure.
            </li>
            <li>
              <strong>Indoor air:</strong> Gruenwald et al. 2023 attributed
              ~12.7% of US childhood asthma to gas-stove NO2 (vented hoods cut
              this sharply). WHO 2009 ties indoor damp/mould to ~30-50% higher
              respiratory illness.
            </li>
            <li>
              <strong>PFAS in textiles &amp; personal care:</strong> Water-,
              stain- and oil-repellent finishes are a common PFAS use: all 57
              stain-resistant children&apos;s items tested contained PFAS, with
              school uniforms on a par with outdoor wear (Xia et al. 2022). In
              3D human-skin models up to 59% of short-chain PFAS passed through
              the skin and long-chain PFAS stayed in it (Ragnarsdóttir et al.
              2024); sweat multiplied modelled uptake from treated textiles (Li
              et al. 2025). High fluorine was found in 82% of waterproof
              mascaras, 63% of foundations and 62% of liquid lipsticks
              (Whitehead et al. 2021); Oral-B Glide floss and stain-resistant
              carpets or furniture were each linked to higher blood PFAS
              (Boronow et al. 2019); some fluoroelastomer watch bands held PFHxA
              at over 16,000 ng/g (Wicks et al. 2025); and rooms with PFAS-free
              furniture and carpet had 78% less PFAS in dust (Young et al.
              2021). Across 37 studies, skin contact was usually a small share
              of total PFAS intake next to other routes, mainly food and
              drinking water (Heywood et al. 2026), hence the small 9% weight.
              Clothing counts 40%, make-up, floss and watch bands 30%, and
              furnishings 30%; &quot;Not sure&quot; scores 70, as an unchecked
              water supply does. IARC (WHO) classifies PFOA as carcinogenic to
              humans (Group 1) and PFOS as possibly carcinogenic (Group 2B).
            </li>
            <li>
              <strong>Radiation &amp; fields (8%):</strong> Radon (60% of the
              cluster) is the 2nd leading cause of lung cancer (~21,000 US
              deaths/yr, US EPA) and is only detectable by testing. Building
              materials (25%): tuff, pozzolana, lava, granite and other igneous
              stone are on the EU list of materials of concern for gamma rays,
              with an indoor reference level of 1 mSv a year (Directive
              2013/59/Euratom, Art. 75 and Annex XIII). Stone and bare earthen
              walls also give off thoron (radon-220), which stays close to the
              surface (55.6-second half-life, Tokonami 2020), reaches high levels
              in earthen houses and isn&apos;t measured reliably by ordinary
              radon tests. Plaster or paint holds thoron back but not gamma rays,
              so covered stone scores 70, bare stone 50, covered earth 85, bare
              earth 60 and &quot;Not sure&quot; 85 (most homes are brick,
              concrete or wood). Power lines (15%) count only with children at
              home: their magnetic fields are IARC Group 2B, and children living
              within 50 m of 200 kV+ lines had OR 1.33 (95% CI 0.92-1.93) for
              leukaemia in an international pooled analysis (Amoon et al. 2018),
              with no consistent link in adults; 50-200 m scores 90, the
              stricter reading. Elsewhere: sun, sunbeds and flights in
              Lifestyle; CT, PET and nuclear medicine scans in Preventive Care
              (a body CT is 7.7 mSv, 2.6 years of natural background,
              RadiologyInfo 2025; up to 10 points off, as CT scans done in the
              US in 2023 are projected to cause about 103,000 cancers,
              Smith-Bindman et al. 2025); and radiation at work in Work. Not
              scored: radiofrequency from phones, Wi-Fi, 5G or base stations,
              IARC Group 2B since 2011 (the 2024 WHO-commissioned review found
              no raised risk of glioma, meningioma or acoustic neuroma from
              mobile phones, Karipidis et al., and living near base stations
              wasn&apos;t linked to early childhood cancer, Elliott et al. 2010;
              rats exposed to the whole body at high levels for two years did
              develop more heart tumours, Mevissen et al. 2025), and home
              altitude (more cosmic radiation, but 22% less heart disease and
              12% less stroke mortality per 1,000 m, Faeh et al. 2009).
            </li>
            <li>
              <strong>PFAS rules for textiles:</strong> The EU restricts PFHxA
              in consumer clothing, footwear and cosmetics from 10 October 2026,
              and in carpets, upholstery and other home textiles from 10 October
              2027 (Regulation (EU) 2024/2462). France has banned PFAS in
              consumer clothing, footwear, cosmetics and ski wax since 1 January
              2026 (all textiles from 2030), and Denmark in consumer clothing,
              footwear and waterproofing products since 1 July 2026. California
              has banned PFAS in most new textiles since 2025; outdoor gear
              exempt until 2028 must be labelled &quot;Made with PFAS
              chemicals&quot;. Items bought earlier aren&apos;t covered. Not
              scored: food packaging (EU PFAS limits from 12 August 2026,
              Regulation (EU) 2025/40) and children&apos;s products such as
              stuffed toys (Nowak et al. 2026).
            </li>
          </ul>
          <p className="text-xs">
            Sources: Luo et al. Sci. Total Environ. (2022), Hussain et al.
            Environ. Sci. Technol. (2023), Rudel et al. Environ. Health
            Perspect. (2011), Mitro et al. Environ. Sci. Technol. (2016),
            Svanes et al. AJRCCM (2018), Gruenwald et al. Int. J. Environ. Res.
            Public Health (2023), WHO Guidelines for Indoor Air Quality:
            Dampness and Mould (2009), US EPA Radon Guidance, IARC Monographs
            (incl. Vol. 135, PFOA/PFOS, 2023), Xia et al. Environ. Sci.
            Technol. (2022), Ragnarsdóttir et al. Environ. Int. (2024), Li et
            al. Sci. Total Environ. (2025), Heywood et al. Risk Anal. (2026),
            Whitehead et al. Environ. Sci. Technol. Lett. (2021), Boronow et
            al. J. Expo. Sci. Environ. Epidemiol. (2019), Wicks et al. Environ.
            Sci. Technol. Lett. (2025), Young et al. Environ. Int. (2021),
            Nowak et al. J. Expo. Sci. Environ. Epidemiol. (2026), Regulation
            (EU) 2024/2462, Regulation (EU) 2025/40, French Law 2025-188,
            Danish PFAS ban for clothing, footwear and waterproofing agents
            (2026), California AB 1817.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle>
            Mental Health Screening (12% of overall score)
          </SectionTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Combines three validated instruments, the Kessler K10 (30%
            weight), the PHQ-2 depression screener (12%) and the GAD-2 anxiety
            screener (12%), with four wellbeing items adapted from the WHO-5
            (22%), cognitive engagement (12%) and purpose in life (12%).
          </p>
          <p>
            The K10 is a 10-item measure of non-specific psychological distress
            (score 10-50) with cut-offs from Andrews & Slade (2001): 10-19
            likely well, 20-24 mild, 25-29 moderate, 30-50 severe distress.
            Used in WHO World Mental Health Surveys.
          </p>
          <p>
            PHQ-2 (Kroenke et al. 2003) and GAD-2 (Kroenke et al. 2007) are
            validated ultra-brief screeners. At a cut-off of 3, meta-analyses
            report 72% sensitivity and 85% specificity for major depression
            (Levis et al. 2020) and 76% sensitivity and 81% specificity for
            generalized anxiety (Plummer et al. 2016), so a positive screen
            calls for a full clinical assessment.
          </p>
          <p>
            The wellbeing items are 4 of the 5 WHO-5 items on a different
            answer scale, so the WHO-5 cut-off of 50 is indicative only. High
            cognitive activity carries a relative risk of 0.61 for dementia in
            LIBRA2 (Rosenau et al. 2024), and a strong sense of purpose goes
            with lower all-cause mortality (Hill &amp; Turiano 2014;
            Alimujiang et al. 2019).
          </p>
          <p className="text-xs">
            Sources: Kessler et al. (2002, 2003), Andrews & Slade (2001),
            Kroenke et al. (2003, 2007), Levis et al. JAMA (2020), Plummer et
            al. General Hospital Psychiatry (2016), WHO-5 Well-Being Index
            (WHO, 1998), Rosenau et al. Alzheimer&apos;s &amp; Dementia (2024),
            Hill &amp; Turiano Psychological Science (2014), Alimujiang et al.
            JAMA Network Open (2019).
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle>
            Family History (5% of overall score)
          </SectionTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Nine heritable conditions, each answered as none, a second-degree
            relative, a first-degree relative, or several relatives or onset
            before 55. The score starts at 100 and loses 4, 10 or 18 points
            per condition, multiplied by a condition weight: heart disease or
            stroke 1.2; type 2 diabetes, breast or ovarian cancer and
            colorectal cancer 1.0; high blood pressure and dementia 0.8; other
            cancers 0.7; depression, bipolar disorder or schizophrenia 0.6;
            autoimmune conditions 0.5. The points and weights are this
            tool&apos;s own scale for ranking family history, not published
            risk estimates.
          </p>
          <p>
            Family history can&apos;t be changed, so it is left out of the
            Action Plan. It feeds the diabetes screen (FINDRISC), the dementia
            profile (one first-degree relative with Alzheimer&apos;s: relative
            risk 1.73, Cannon-Albright et al. 2019) and the cancer profile
            (Patel et al. 2022).
          </p>
          <p className="text-xs">
            Sources: Cannon-Albright et al. Neurology (2019), Lindström &amp;
            Tuomilehto Diabetes Care (2003), Patel et al. Cancer (2022).
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle>
            Preventive Care (6% of overall score)
          </SectionTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Each item is answered as up to date, overdue, long overdue or
            never, and items that don&apos;t apply to you are left out. The
            score is the weighted average of the rest: cancer screenings count
            most (weight 1.5), then blood pressure (1.2), cholesterol and a
            yearly primary care visit (1.0), diabetes screening (0.9), dental
            visits (0.8), flu and pneumococcal vaccines and the hepatitis B,
            hepatitis C and HIV tests (0.7), shingles and RSV vaccines and the
            one-off Lp(a) test (0.6), and Tdap, COVID-19, HPV and hepatitis B
            vaccines, skin checks and eye exams (0.5).
          </p>
          <p>
            The strictest national schedule sets the ages: shingles and
            pneumococcal vaccines from 50 and RSV from 75 (CDC), HPV catch-up
            through 26 and hepatitis B vaccination for adults aged 19-59
            (CDC/ACIP), one test in adulthood for hepatitis B, hepatitis C and
            HIV (CDC), diabetes screening from 35 (ADA) and Lp(a) once in a
            lifetime (2025 ESC/EAS update). CT, PET and nuclear medicine scans
            take off up to 10 points: a body CT is about 7.7 mSv, and CT scans
            done in the US in 2023 are projected to cause about 103,000
            cancers (Smith-Bindman et al. 2025).
          </p>
          <p className="text-xs">
            Sources: USPSTF recommendations, CDC adult immunization schedule,
            ADA Standards of Care, EU Council Recommendation on cancer
            screening (2022), European Code Against Cancer, 5th edition
            (IARC/WHO 2025), 2025 ESC/EAS focused update on dyslipidaemias,
            Smith-Bindman et al. JAMA Internal Medicine (2025).
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle>
            Senses &amp; Oral Health (4% of overall score)
          </SectionTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Hearing 35%, vision 30% and oral health 35%. Hearing: difficulty
            (45%), hearing aid use (20%), noise exposure (20%) and time since
            the last test (15%). Vision: corrected sight (50%), time since the
            last eye exam (30%) and eye strain (20%). Oral health: teeth
            remaining (30%), brushing (20%), gum bleeding (20%), flossing
            (15%) and tooth pain (15%).
          </p>
          <p>
            Hearing loss accounts for about 7% of dementia cases and untreated
            vision loss for about 2% (2024 Lancet Commission). Both feed the
            dementia profile, where hearing loss treated with hearing aids is
            not counted. Tooth loss goes with shorter survival (Friedman &amp;
            Lamster 2016).
          </p>
          <p className="text-xs">
            Sources: Livingston et al. Lancet Commission on dementia (2024),
            Friedman &amp; Lamster Periodontology 2000 (2016).
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle>
            Overall Health Score
          </SectionTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            The overall score is a weighted composite across 14 modules:
            Mental Health 12%, Body Composition 11%, Diet 11%, Lifestyle 10%,
            Exercise 10%, Work 7%, Life Context 6%, Preventive Care 6%,
            Air Quality 5%, Family History 5%, Personality &amp; Outlook 5%,
            Water Quality 4%, Senses &amp; Oral Health 4%, Home Environment 4%.
            Only completed modules contribute to the score, with weights
            re-normalized among them. The weights are this tool&apos;s own
            judgement of each area&apos;s share of health, not a published
            standard.
          </p>
          <p>
            Tobacco, alcohol and drugs share one sub-score worth 16% of
            Lifestyle, itself 10% of the total, so on their own they would
            move the overall score by a point or two while costing up to 10
            years of life (smoking) or 15 (weekly drug use). The overall score
            therefore also loses one point for each year of life expectancy
            they cost, the same years as in the Life Expectancy estimate: 10
            for daily smoking, 5 for occasional and 1 for past smoking; 0.5,
            1.5 or 4.5 for more than 100, 200 or 350 g of alcohol a week; and
            about 15 for weekly use of drugs other than cannabis or injecting
            in the past year. The dashboard lists each deduction under the
            score.
          </p>
          <p>
            Letter grades: A (90-100), B (75-89), C (60-74), D (40-59),
            F (0-39). The Action Plan lists the 3 completed modules with the
            most room to improve, weighted by their share of the overall
            score.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle>
            Life Expectancy Estimate
          </SectionTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            The baseline is the expected total lifespan of someone of your
            age and sex in your country: your age plus the remaining life
            expectancy in the United Nations World Population Prospects 2024
            life tables for 2026. Having already reached your age raises it:
            at 65 it is about 3 years above life expectancy at birth in Italy
            and 22 in Nigeria. Until the Body Composition and Air Quality
            modules are completed, the world average for a 40-year-old is
            used.
          </p>
          <p>
            Each completed module then adds or subtracts years taken from
            published studies: smoking (10 years for daily smokers, 5 for
            occasional and 1 for past smokers), physical activity (up to 4
            years gained), obesity (3 years for class I, 6 for class II and 9
            for class III), diet (up to 3 gained), alcohol (0.5 to 4.5 years
            above 100 g a week), drug use, air pollution, sleep, social
            connection, mental health, life context, personality, work, water
            and home environment. Most effects were measured around age 40,
            so they are scaled down for older users in proportion to the
            years they have left.
          </p>
          <p>
            <strong>Gains level off, losses add up.</strong> Each gain comes
            from a separate study that adjusted for only some of the other
            factors, so a plain sum over-counts: every module at its best
            would add more than 22 years. Gains are therefore combined as
            10 × (1 − e<sup>−sum/10</sup>), which approaches but never passes
            10 years above your country&apos;s average. That is already more
            than the healthiest groups on record: California Adventists
            outlive other Californians by 7.3 years (men) and 4.4 (women)
            (Fraser &amp; Shavlik 2001), and US adults with all five low-risk
            habits live 12 to 14 years longer from age 50 than those with
            none (Li et al. 2018). Losses are summed, because the excess risks
            of smoking and high BMI were roughly additive in 900,000 adults
            (Prospective Studies Collaboration 2009): obese smokers lost 13.3
            to 13.7 years against normal-weight non-smokers (Peeters et al.
            2003), and the model gives 14.
          </p>
          <p>
            Air pollution counts against your country&apos;s average, not
            against the WHO guideline, because the national life table
            already includes the national exposure: each 10 µg/m³ of PM2.5
            above or below the national mean (WHO, SDG indicator 11.6.2, mean
            of 2021-2023) moves the estimate by 0.98 years (AQLI 2025).
          </p>
          <p>
            &quot;Longer than x% of peers&quot; places the estimate on a
            normal curve with a standard deviation of 10 years, a rough
            approximation. The &quot;potential&quot; figure is an upper bound:
            the years the estimate would gain if every completed module were
            at its best, counting only the part of the smoking loss that
            stopping at your age wins back (about 10, 9, 6 or 3 of the 10
            years at 30, 40, 50 or 60, Doll et al. 2004). Confidence is low
            with fewer than 3 inputs, medium
            with 3 to 5 and high from 6. The work, water and home adjustments
            are small modelling assumptions: no study gives years of life for
            those scores. This is an educational estimate, not an actuarial
            or clinical prediction.
          </p>
          <p className="text-xs">
            Sources: UN World Population Prospects 2024, Doll et al. BMJ
            (2004), Jha et al. NEJM (2013), Inoue-Choi et al. American
            Journal of Preventive Medicine (2019), Moore et al. PLoS Medicine
            (2012), Prospective Studies Collaboration Lancet (2009), Peeters
            et al. Annals of Internal Medicine (2003), Sofi et al. BMJ (2008),
            Fadnes et al. PLoS Medicine (2022), Wood et al. Lancet (2018),
            Zhao et al. JAMA Network Open (2023), Lewer et al. Journal of
            Psychiatric Research (2020), Mathers et al. Bulletin of the WHO
            (2013), AQLI 2025 Annual Update (University of Chicago), WHO
            Global Health Observatory (SDG indicator 11.6.2), Cappuccio et
            al. Sleep (2010), Holt-Lunstad et al. PLoS Medicine (2010), Walker
            et al. JAMA Psychiatry (2015), Kivimäki et al. Lancet (2012,
            2015), Fraser &amp; Shavlik Archives of Internal Medicine (2001),
            Li et al. Circulation (2018).
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle>
            Biological Age Estimate
          </SectionTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Biological age is your age minus half of the life expectancy
            adjustment (taken at the age-40 reference, before age scaling).
            The idea follows PhenoAge (Levine et al. 2018), which defines
            biological age as the age at which your mortality risk matches
            the population average. The factor of one half is a modelling
            assumption, not a measured constant: life expectancy effects
            build up over a lifetime, so only part of the difference has
            materialised at any given age. The shift is limited to the
            smaller of 15 years and 0.35 × (age − 18), and the result never
            drops below 18.
          </p>
          <p>
            In the Dunedin Study, people born in the same year had aged
            between 0.40 and 2.44 biological years per calendar year by age 45
            (Elliott et al. 2021). Without blood biomarkers this is an
            educational estimate, not a PhenoAge or epigenetic clock
            measurement.
          </p>
          <p className="text-xs">
            Sources: Levine et al. Aging (2018), Belsky et al. PNAS (2015),
            Elliott et al. Nature Aging (2021), Rutledge et al. Nature Reviews
            Genetics (2022).
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle>
            Peer Comparison
          </SectionTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Places your overall score in a band: 85 and over &quot;Top
            5%&quot;, 75-84 &quot;Top 15%&quot;, 65-74 &quot;Top 35%&quot;,
            55-64 &quot;Average&quot;, 45-54 &quot;Below Average&quot; and
            under 45 &quot;Bottom 15%&quot;. The bands are this tool&apos;s
            own assumption about how scores are spread among people. No
            population sample has taken the questionnaire, so they are not
            measured against survey data, and the card says so. It needs at
            least 3 completed assessments.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle>
            Cardiovascular Health
          </SectionTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Scores the behaviour and weight metrics of the American Heart
            Association&apos;s Life&apos;s Essential 8 (Lloyd-Jones et al.
            2022) from answers you already gave: nicotine exposure, physical
            activity, sleep, BMI and diet. Blood pressure, cholesterol and
            blood glucose need measurements the app doesn&apos;t ask for, so
            5 of the 8 metrics are covered, and at least 3 are needed for a
            score. Each metric scores 0-100 with the published tables and the
            overall score is their unweighted average: 80-100 is high
            cardiovascular health, 50-79 moderate and 0-49 low.
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-1">
            <li>
              <strong>Nicotine:</strong> never smoked 100, former smoker 50,
              current smoker 0, with 20 points off for living with someone who
              smokes indoors. The published table gives former smokers 75, 50
              or 25 by years since quitting, which the app doesn&apos;t ask,
              so the middle value is used.
            </li>
            <li>
              <strong>Activity:</strong> 150 or more moderate-equivalent
              minutes a week 100, then 90, 80, 60, 40 and 20 down to 1-29
              minutes, and 0 for none. Minutes are the Exercise module&apos;s
              MET-minutes divided by 4, so a vigorous minute counts as two.
            </li>
            <li>
              <strong>Sleep:</strong> 7 to under 9 hours 100; 9 to under 10
              hours 90; 6 to under 7 hours 70; 5 to under 6, or 10 and more,
              40; 4 to under 5 hours 20; under 4 hours 0.
            </li>
            <li>
              <strong>Weight:</strong> BMI under 25 scores 100, 25-29.9 70,
              30-34.9 30, 35-39.9 15, and 40 or over 0, on the Body
              module&apos;s composite BMI with its ethnicity-specific
              cut-offs.
            </li>
            <li>
              <strong>Diet:</strong> the published table scores five
              quantiles of a DASH-style diet score (100, 80, 50, 25, 0). The
              Diet module&apos;s five bands stand in for them.
            </li>
          </ul>
          <p>
            It is a health score, not a 10-year risk estimate such as SCORE2,
            ASCVD or QRISK3, which need age, blood pressure and cholesterol.
            Because the average is unweighted, one very low metric can hide
            behind good ones (a daily smoker with four ideal metrics still
            averages 80), so the card always names your lowest metric.
          </p>
          <p className="text-xs">
            Source: Lloyd-Jones et al. Circulation (2022), Life&apos;s
            Essential 8: updating and enhancing the American Heart
            Association&apos;s construct of cardiovascular health.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle>
            Type 2 Diabetes Risk Screen
          </SectionTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Adapted from FINDRISC, the Finnish Diabetes Risk Score (Lindström
            &amp; Tuomilehto 2003), using answers you already gave: age (2
            points from 45, 3 from 55, 4 over 64), BMI (1 point from 25, 3
            over 30), waist (3 or 4 points from 94 and 102 cm for men, 80 and
            88 cm for women), under 30 minutes of activity a day (2 points,
            counted as under 210 active minutes a week), vegetables or fruit
            not eaten every day (1 point, counted as under one serving a day
            of each) and relatives with diabetes (3 points for second-degree,
            5 for first-degree).
          </p>
          <p>
            Two FINDRISC items aren&apos;t collected, blood pressure
            medication (2 points) and a history of high blood glucose (5
            points), so the screen covers 19 of the 26 points and can only
            under-count. Bands follow FINDRISC: under 7 low (about 1 in 100
            develop type 2 diabetes within 10 years), 7-11 slightly elevated
            (1 in 25), 12-14 moderate (1 in 6), 15 and over high (1 in 3). It
            is a screening estimate, not a diagnosis.
          </p>
          <p className="text-xs">
            Source: Lindström &amp; Tuomilehto Diabetes Care (2003).
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle>
            Neurodegenerative (Dementia) Risk Profile
          </SectionTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Built from answers you already gave, with no extra questions. It
            covers 10 of the 14 modifiable risk factors of the 2024 Lancet
            Commission (Livingston et al.): less education, hearing loss,
            vision loss, depression, physical inactivity, smoking, obesity,
            excessive alcohol, social isolation and PM2.5 air pollution. Six
            more come from LIBRA2 (Rosenau et al. 2024: cognitive activity and
            sleep), the Lancet diet-quality meta-analysis, perceived stress
            (Franks et al. 2021), family history (Cannon-Albright et al. 2019)
            and, from age 50, the shingles vaccine: in a natural experiment in
            Wales, vaccination cut new dementia diagnoses by 20% over 7 years
            (Eyting et al. 2025, Nature), and a 2025 follow-up found fewer
            mild cognitive impairment diagnoses and dementia deaths too (Xie
            et al., Cell), so being unvaccinated counts as 1/0.8. Blood
            pressure, LDL cholesterol, diabetes and head injury are not
            collected, so the profile can only under-count.
          </p>
          <p>
            Each flagged factor adds its published relative risk, for example
            depression 2.25, less education 1.6, social isolation 1.6, vision
            loss 1.47, untreated hearing loss 1.37, and 1.03 per µg/m³ of PM2.5
            above the WHO guideline of 5 µg/m³ (capped at 25). Relative risks
            multiply, equivalent to LIBRA&apos;s additive log-scale weights.
            Bands: Low below 1.5×, Moderate 1.5-2.5×, Elevated 2.5-4×, High
            from 4×. Multiplying assumes independent factors, so values of 4×
            and above are shown as &quot;4× or more&quot;.
          </p>
          <p>
            The strictest thresholds apply, with the reference cited: alcohol
            above 14 UK units a week (UK CMO; the Lancet uses 21), sleep
            outside 7-9 hours (AASM/SRS), and under 600 MET-minutes of activity
            a week (WHO). Hearing loss treated with hearing aids is not counted.
            Depression and stress screens share items, so only the stronger of
            the two counts. This is a profile relative to someone with none of
            the assessed factors, not an absolute prediction: age and APOE ε4
            dominate absolute risk.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <SectionTitle>
            Cancer Risk Profile
          </SectionTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Built from answers you already gave, with no extra questions. It
            follows the European Code Against Cancer, 5th edition (IARC/WHO
            2025): 11 of its 14 recommendations map onto your answers, namely
            tobacco, second-hand smoke, body weight, physical activity, diet,
            alcohol, sun protection, radon, air pollution, screening and
            cancer-causing infections (hepatitis B and HPV vaccination, and
            hepatitis B, hepatitis C and HIV testing, from Preventive Care).
            Workplace carcinogens, breastfeeding and HRT are not collected, so
            the profile can only under-count.
          </p>
          <p>
            Weight, activity, plant foods, ultra-processed food, red and
            processed meat, sugary drinks and alcohol are scored with the
            standardised 2018 WCRF/AICR score (0-7 points, Shams-White et al.
            2019). Each point missed multiplies risk by 1/0.93, the hazard
            ratio per point for all cancers combined in UK Biobank (Malcomson
            et al. 2023, adjusted for smoking). Smoking (1.63 for men, 1.55 for
            women), past smoking (1.23 and 1.14, taken at 10-20 years since
            quitting) and a first-degree family history of cancer (1.15 and
            1.08) use hazard ratios for any invasive cancer from the American
            Cancer Society cohorts (Patel et al. 2022). Carcinogens that act on
            one site are scaled to all cancers by that site&apos;s share of new
            cases in Europe (GLOBOCAN 2024): second-hand smoke (lung cancer RR
            1.24, Hackshaw et al. 1997), radon known or likely to be high (+16%
            per 100 Bq/m³, Darby et al. 2005, at the EU reference level of 300
            Bq/m³), PM2.5 above the WHO guideline of 5 µg/m³ (1.09 per 10
            µg/m³, Hamra et al. 2014, capped at 25), sunburn (melanoma RR 2.03,
            Gandini et al. 2005) and sunbeds (melanoma RR 1.20 for any use, 1.87
            when started before 35 or not sure, Boniol et al. 2012). Beyond the
            Code, CT and nuclear medicine scans count as past radiation
            exposure: 7.7 mSv per scan (RadiologyInfo 2025) at 52% more solid
            cancer per Gy (INWORKS, Richardson et al. 2023), so 3-5 scans (about
            31 mSv) add about 2%.
          </p>
          <p>
            The strictest thresholds apply, with the reference cited: only no
            alcohol earns the full alcohol point (WCRF and the Code both advise
            not drinking), and the partial point stops at 14 g a day for women
            (standardised score) and 14 UK units a week for men (UK CMO; the
            score allows 28 g a day). Activity uses the Exercise module&apos;s
            MET-minutes, where walking counts at 3.3 MET: 600 a week (150
            minutes of moderate activity) earns the full point and 300 half.
            Answer frequencies stand in for grams: 80
            g per fruit or vegetable serving (WHO), about 140 g per portion of
            red meat, 50 g of processed meat, 250 ml per sugary drink and 12 g
            of alcohol per drink. Daily wholegrains plus pulses or nuts 3-4
            times a week stand in for 30 g of fibre a day. Relative risks
            multiply, and below 2× the result is shown as a percentage
            increase. Bands: Low below 1.2×, Moderate 1.2-1.5×, Elevated
            1.5-2×, High from 2×, with values of 3× and above shown as
            &quot;3× or more&quot;. Screening mostly finds cancer earlier rather
            than preventing it, so its status is shown alongside the profile
            rather than scored. The infection vaccines and tests are shown the
            same way: they only change cancer risk for someone who carries the
            virus, which the app doesn&apos;t ask. This is a profile relative to someone with none
            of the assessed factors, not an absolute prediction: age and
            inherited variants such as BRCA or Lynch syndrome dominate absolute
            risk.
          </p>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground leading-relaxed">
        This tool is for informational and educational purposes only. It does
        not constitute medical advice, diagnosis, or treatment. Always consult
        a qualified healthcare professional for personalized health guidance.
      </p>
    </div>
  )
}
