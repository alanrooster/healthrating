import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
          <CardTitle className="text-lg text-foreground">
            Body Composition (11% of overall score)
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Combines standard BMI with age, sex, and ethnicity adjustments.
            Body fat is estimated using both the U.S. Navy circumference method
            and the Deurenberg formula, then averaged for accuracy.
          </p>
          <p>
            Ethnicity-specific BMI thresholds follow WHO Expert Consultation
            (2004) recommendations. South/East/Southeast Asian populations use
            a 23 BMI overweight cut-off rather than the standard 25.
          </p>
          <p className="text-xs">
            Sources: WHO Expert Consultation (2004), Deurenberg et al. (2002),
            U.S. Navy Body Composition Assessment.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-foreground">
            Air Quality (5% of overall score)
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Scores are based on annual average PM2.5 concentration compared to
            the WHO Air Quality Guidelines (2021). The WHO guideline for annual
            PM2.5 is 5 ug/m3.
          </p>
          <p>
            City data is sourced from the WHO Global Air Quality Database and
            IQAir World Air Quality Report (2023-2024 data).
          </p>
          <p className="text-xs">
            Sources: WHO Global Air Quality Guidelines (2021),
            IQAir World Air Quality Report 2024.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-foreground">
            Water Quality (4% of overall score)
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Combines country-level water infrastructure data with personal
            consumption habits and microplastic exposure assessment.
          </p>
          <p>
            <strong>Scoring components:</strong>
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-1">
            <li>
              <strong>Country Baseline (25%):</strong> Based on WHO/UNICEF Joint
              Monitoring Programme (JMP) 2023 data on safely managed drinking
              water access, combined with Environmental Performance Index 2024
              water quality indicators.
            </li>
            <li>
              <strong>Water Source (20%):</strong> Municipal tap, private well,
              spring, rainwater, or bottled water. Adjusted by country baseline.
            </li>
            <li>
              <strong>Home Filtration (20%):</strong> Type of filtration
              (none, pitcher, faucet, under-sink, reverse osmosis, whole-house,
              distillation) and maintenance status.
            </li>
            <li>
              <strong>Plastic/Microplastic Exposure (20%):</strong> Frequency of
              bottled water consumption, bottle type (plastic vs glass vs metal),
              quantity per week, and storage conditions. WHO (2022) and PNAS (2024)
              show plastic bottles contain 10-100x more microplastics than tap water.
              Heat exposure increases BPA/phthalate leaching by up to 55x.
            </li>
            <li>
              <strong>Infrastructure (10%):</strong> Building age (lead pipe risk),
              known plumbing issues, recent renovation, observed water quality issues.
            </li>
            <li>
              <strong>Hydration (5%):</strong> Daily water intake vs WHO
              recommendation of 2-3 liters.
            </li>
          </ul>
          <p className="text-xs">
            Sources: WHO/UNICEF JMP (2023), Environmental Performance Index (2024),
            WHO Microplastics in Drinking Water (2022), Mason et al. (2018),
            PNAS Nanoplastics Study (2024), Rochester & Bolden BPA Research (2015),
            EU Drinking Water Directive 2020/2184.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-foreground">
            Diet Assessment (11% of overall score)
          </CardTitle>
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
              cancer), high-temperature frying emissions and acrylamide
              (formed in chips, fries, burnt toast).
            </li>
            <li>
              <strong>Group 2B (Possibly carcinogenic):</strong> Pickled
              vegetables (Asian-style), aspartame (artificial sweetener).
            </li>
          </ul>
          <p>
            <strong>WHO Dietary Targets:</strong> 400g+ fruits/vegetables daily,
            less than 10% energy from free sugars, less than 5g salt/day,
            limited saturated fats and ultra-processed foods.
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
            Guidance (2024), Wastyk et al. Cell (2021), Dmitrieva et al.
            eBioMedicine (2023).
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-foreground">
            Exercise Assessment (10% of overall score)
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Combined activity volume (70%) and functional fitness (30%) score.
            Activity is measured by the WHO Global Physical Activity Questionnaire
            (GPAQ) covering work, transport, and recreation in MET-minutes/week,
            with a sedentary behavior penalty.
          </p>
          <p>
            <strong>Functional Fitness sub-score</strong> uses self-reported
            proxies for clinically validated mortality predictors:
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-1">
            <li>
              <strong>Stair-climbing capacity (30%):</strong> Proxy for
              cardiorespiratory fitness (VO2 max). Mandsager et al. (JAMA 2018)
              found CRF predicts mortality more strongly than smoking; the lowest
              fitness quartile had 5x mortality vs elite fitness.
            </li>
            <li>
              <strong>Walking pace (30%):</strong> Studenski et al. (JAMA 2011)
              demonstrated gait speed predicts survival as well as age + sex +
              chronic conditions combined.
            </li>
            <li>
              <strong>Grip strength (25%):</strong> Leong et al. (Lancet 2015,
              PURE study, n=140k): each 5kg lower grip strength = +16%
              all-cause mortality. Stronger predictor than systolic blood pressure.
            </li>
            <li>
              <strong>Resting heart rate (15%):</strong> Lower RHR (50-65 bpm)
              associated with longer life. Above 80 bpm raises CV mortality
              (CARDIA, Whitehall studies).
            </li>
          </ul>
          <p>
            WHO recommends at least 150-300 minutes of moderate-intensity or
            75-150 minutes of vigorous-intensity physical activity per week
            (equivalent to 600-1200 MET-minutes/week).
          </p>
          <p className="text-xs">
            Sources: WHO Guidelines on Physical Activity and Sedentary Behaviour
            (2020), GPAQ Analysis Guide, Mandsager et al. JAMA Network Open
            (2018), Studenski et al. JAMA (2011), Leong et al. Lancet (2015,
            PURE Study).
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-foreground">
            Work Assessment (7% of overall score)
          </CardTitle>
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
              Demand-Control model (1979) shows low control with high demands
              creates high-strain jobs with 2-3x cardiovascular risk.
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
              over working conditions, effort-reward balance. Siegrist ERI model
              (1996) shows imbalance doubles coronary heart disease risk.
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
            WHO Guidelines on Mental Health at Work (2022), EU-OSHA Psychosocial
            Risks Framework (2022-2025), ILO Psychosocial Hazards (2022).
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-foreground">
            Lifestyle Assessment (10% of overall score)
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Eight sub-domains measuring daily lifestyle factors with established
            longevity effects. Weights: Sleep 22%, Social Connection 16%,
            Habits 16%, Sedentary Time 13%, Leisure & Balance 12%, Sun
            Exposure 8%, Commute 8%, Sauna 5%.
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-1">
            <li>
              <strong>Sleep:</strong> Pittsburgh Sleep Quality Index (PSQI)
              principles - duration, quality, latency, consistency, daytime
              dysfunction. WHO recommendation 7-9h.
            </li>
            <li>
              <strong>Social Connection:</strong> Holt-Lunstad meta-analyses
              (2010, 2015) - social isolation increases mortality 29%,
              comparable to smoking 15 cigarettes/day.
            </li>
            <li>
              <strong>Sedentary Time:</strong> Patel et al. (2018, 2010) -
              sitting 8+ hours/day raises all-cause mortality independently
              of exercise. Breaking up sitting reduces metabolic harm.
            </li>
            <li>
              <strong>Sun Exposure:</strong> Holick (2007) for vitamin D
              synthesis (10-30 min/day optimal); AAD on sunscreen and sunburn
              skin cancer risk.
            </li>
            <li>
              <strong>Commute:</strong> Hansson et al. 2011 (Sweden) -
              commutes &gt;45 min one-way associated with +33% depression and
              +21% obesity. Each 10-min increment correlates with worse outcomes.
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
              <strong>Habits:</strong> Smoking (WHO - 8M deaths/year),
              alcohol (WHO - no safe level), caffeine.
            </li>
          </ul>
          <p className="text-xs">
            Sources: PSQI (Buysse et al. 1989), WHO Sleep Guidelines, Holt-Lunstad
            et al. (2010, 2015 PNAS), Patel et al. American Journal of Epidemiology
            (2018, 2010), Holick NEJM (2007), Hansson et al. BMC Public Health
            (2011), Laukkanen et al. JAMA Internal Medicine (2015), WHO/CDC
            substance use evidence.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-foreground">
            Life Context & Relationships (6% of overall score)
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Captures social, economic, and biographical factors with documented
            multi-year longevity effects. Weights: Relationship & Family 22%,
            Education 13%, Income & Financial Stress 18%, Religion/Spirituality 8%,
            Pet Ownership 4%, Volunteering 8%, Childhood Adversity (ACEs) 17%,
            Self-Reported Health 10%.
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-1">
            <li>
              <strong>Marital/Relationship Status & Quality:</strong> Robles
              et al. 2014 meta-analysis - married individuals live ~2-3 years
              longer; relationship quality matters more than status. Unhappy
              marriages can be worse than being single.
            </li>
            <li>
              <strong>Parenthood:</strong> Modlin et al. 2024 - parents have
              ~5-10% lower all-cause mortality, with strongest effect at 2-3
              children.
            </li>
            <li>
              <strong>Education:</strong> Lancet 2024 global meta-analysis -
              each additional year of schooling associated with ~1.7 years
              longer life. College degree adds ~7-9 years vs no high school
              (US data). Strongest non-medical predictor after smoking.
            </li>
            <li>
              <strong>Income & Financial Literacy:</strong> Chetty et al.
              2016 (JAMA) - top 1% vs bottom 1% income gap = 14.6 years
              (men), 10.1 years (women) in US. Ryan et al. 2014 - financial
              stress = +13% all-cause mortality. Sweet et al. 2013 - debt
              stress correlates with hypertension and depression.
            </li>
            <li>
              <strong>Religious/Spiritual Practice:</strong> VanderWeele et al.
              2017 (JAMA Psychiatry, n=74,534) - weekly religious attendance
              associated with 33% lower all-cause mortality. Effect persists
              after controlling for social connection.
            </li>
            <li>
              <strong>Pet Ownership:</strong> AHA Scientific Statement (2013)
              - dog owners have ~24% lower all-cause mortality, especially
              for cardiovascular outcomes.
            </li>
            <li>
              <strong>Volunteering:</strong> Kim et al. 2020 (Harvard, AJPM)
              - 100+ hours/year volunteering = 44% lower mortality vs none.
            </li>
            <li>
              <strong>Childhood Adversity (ACEs):</strong> Felitti et al. 1998
              + 25+ years of follow-up - 4+ ACEs associated with up to 20-year
              shorter lifespan. Strong predictor independent of adult behaviors.
            </li>
          </ul>
          <p className="text-xs">
            Sources: Robles et al. Psychological Bulletin (2014), Modlin et al.
            (2024), Education and Life Expectancy Lancet meta-analysis (2024),
            Chetty et al. JAMA (2016), Ryan et al. (2014), Sweet et al. (2013),
            VanderWeele et al. JAMA Psychiatry (2017), AHA Scientific Statement
            on Pets (2013), Kim et al. American Journal of Preventive Medicine
            (2020), Felitti et al. ACE Study (1998 + follow-ups).
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-foreground">
            Personality & Outlook (5% of overall score)
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Five validated psychological traits with documented effects on
            longevity. Weights: Optimism 28%, Conscientiousness 22%, Sense of
            Control 16%, Forgiveness 12%, Humor 8%, Purpose &amp; Meaning 14%.
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
              <strong>Conscientiousness:</strong> Friedman &amp; Kern 2014
              meta-analysis - high conscientiousness associated with ~4 years
              longer life. Big Five trait covering organization, reliability,
              and self-discipline.
            </li>
            <li>
              <strong>Sense of Control / Self-Efficacy:</strong> High internal
              locus of control associated with longer survival and better
              health outcomes.
            </li>
            <li>
              <strong>Forgiveness:</strong> Toussaint et al. 2012 - forgiveness
              associated with longevity, mediated through reduced chronic
              stress and inflammation.
            </li>
            <li>
              <strong>Humor:</strong> Romundstad et al. 2016 (Norway HUNT
              study, n=53,556) - high cognitive humor associated with 35%
              lower mortality from infection and lower cardiac death.
            </li>
            <li>
              <strong>Purpose &amp; Meaning:</strong> Hill &amp; Turiano 2014
              - sense of purpose associated with reduced all-cause mortality
              across the lifespan.
            </li>
          </ul>
          <p className="text-xs">
            Sources: Lee et al. PNAS (2019), Scheier &amp; Carver LOT-R (1985,
            1994), Friedman &amp; Kern Annual Review of Psychology (2014),
            Toussaint et al. Journal of Behavioral Medicine (2012),
            Romundstad et al. Psychosomatic Medicine (2016), Hill &amp;
            Turiano Psychological Science (2014).
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-foreground">
            Home Environment & Exposures (4% of overall score)
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Evaluates modifiable household exposures across three clusters:
            cookware &amp; food-contact plastics (30%), food safety &amp;
            cleaning (33%), and indoor air quality (37%). Individually each
            exposure is small, but they are chronic and additive over a lifetime.
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
              microplastics per cm² in 3 minutes. Plastic storage also leaches
              BPA/phthalates; switching to glass lowers urinary BPA (Carwile
              et al. 2011).
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
              <strong>Cleaning products:</strong> Svanes et al. 2018 (Am. J.
              Respir. Crit. Care Med.) linked regular cleaning-spray use to
              accelerated lung-function decline over 20 years, comparable to
              smoking 10-20 cigarettes/day. Fragrance-free / low-VOC ("bio")
              products and ventilation reduce this.
            </li>
            <li>
              <strong>Indoor air:</strong> Gruenwald et al. 2023 attributed
              ~12.7% of US childhood asthma to gas-stove NO2 (vented hoods cut
              this sharply). WHO 2009 ties indoor damp/mould to ~30-50% higher
              respiratory illness. Radon is the 2nd leading cause of lung cancer
              (~21,000 US deaths/yr, US EPA) and is only detectable by testing.
            </li>
          </ul>
          <p className="text-xs">
            Sources: Luo et al. Sci. Total Environ. (2022), Hussain et al.
            Environ. Sci. Technol. (2023), Carwile et al. Environ. Health
            Perspect. (2011), Mitro et al. Environ. Sci. Technol. (2016),
            Svanes et al. AJRCCM (2018), Gruenwald et al. Int. J. Environ. Res.
            Public Health (2023), WHO Guidelines for Indoor Air Quality:
            Dampness and Mould (2009), US EPA Radon Guidance, IARC Monographs.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-foreground">
            Mental Health Screening (12% of overall score)
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Combines four validated instruments: Kessler K10 (40% weight),
            PHQ-2 depression screener (15%), GAD-2 anxiety screener (15%),
            and WHO-5 inspired wellbeing items (30%).
          </p>
          <p>
            The K10 is a 10-item measure of non-specific psychological distress
            (score 10-50) with cut-offs from Andrews & Slade (2001): 10-19
            likely well, 20-24 mild, 25-29 moderate, 30-50 severe distress.
            Used in WHO World Mental Health Surveys.
          </p>
          <p>
            PHQ-2 (Kroenke et al. 2003) screens for depression with 83%
            sensitivity and 92% specificity at cut-off of 3. GAD-2 (Kroenke
            et al. 2007) screens for generalized anxiety with 86% sensitivity
            and 83% specificity. Both are validated ultra-brief instruments.
          </p>
          <p className="text-xs">
            Sources: Kessler et al. (2002, 2003), Andrews & Slade (2001),
            Kroenke et al. (2003, 2007), WHO-5 Well-Being Index (WHO, 1998).
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-foreground">
            Carbon Footprint (Environmental Impact)
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Calculates annual CO2 equivalent emissions based on transportation,
            home energy, and consumption patterns. Separate from the health score
            as it measures environmental rather than personal health impact.
          </p>
          <p>
            <strong>Components assessed:</strong>
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-1">
            <li>
              <strong>Transportation:</strong> Daily commute method, car type
              and annual mileage, public transit usage. Emission factors from
              UK DEFRA 2024 and EPA.
            </li>
            <li>
              <strong>Flights:</strong> Short-haul and long-haul flights per
              year. Includes radiative forcing multiplier (2.7x) for high-altitude
              emissions per IPCC methodology.
            </li>
            <li>
              <strong>Home Energy:</strong> Housing type/size, heating source,
              electricity source, cooling usage, adjusted for country-specific
              grid carbon intensity (IEA 2024).
            </li>
            <li>
              <strong>Consumption:</strong> Clothing purchases, electronics,
              recycling habits, composting.
            </li>
          </ul>
          <p>
            Results compared to Paris Agreement 2050 target (2.0 tonnes/person),
            global average (4.7t), EU average (6.8t), and US average (14.7t).
          </p>
          <p className="text-xs">
            Sources: IPCC AR6 (2023), UK DEFRA Conversion Factors (2024),
            EPA GHG Equivalencies, IEA World Energy Outlook (2024), Our World
            in Data Carbon Database.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-foreground">
            Overall Health Score
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            The overall score is a weighted composite across 14 modules:
            Mental Health 12%, Body Composition 11%, Diet 11%, Lifestyle 10%,
            Exercise 10%, Work 7%, Life Context 6%, Preventive Care 6%,
            Air Quality 5%, Family History 5%, Personality &amp; Outlook 5%,
            Water Quality 4%, Senses &amp; Oral Health 4%, Home Environment 4%.
            Only completed modules contribute to the score, with weights
            re-normalized among them.
          </p>
          <p>
            Letter grades: A (90-100), B (75-89), C (60-74), D (40-59),
            F (0-39).
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
