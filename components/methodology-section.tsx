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
            Body Composition (30% of overall score)
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
            Air Quality (15% of overall score)
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
            Water Quality (7% of overall score)
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
            Diet Assessment (15% of overall score)
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            16 questions covering key dietary indicators from WHO guidelines and
            IARC (International Agency for Research on Cancer) carcinogen
            classifications. Integrates both nutritional quality and cancer risk.
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
          <p className="text-xs">
            Sources: IARC Monographs Vol. 114 (Red Meat, Processed Meat, 2015),
            IARC Monographs Vol. 100E (Alcohol, 2012), IARC Monographs Vol. 116
            (Hot Beverages, 2018), WHO Healthy Diet Fact Sheet (2024), WHO HDMI
            Guidance (2024).
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-foreground">
            Exercise Assessment (25% of overall score)
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Based on the WHO Global Physical Activity Questionnaire (GPAQ)
            covering work activity, active transport, and recreational exercise.
            Scored using MET-minutes per week with a sedentary behavior penalty.
          </p>
          <p>
            WHO recommends at least 150-300 minutes of moderate-intensity or
            75-150 minutes of vigorous-intensity physical activity per week
            (equivalent to 600-1200 MET-minutes/week).
          </p>
          <p className="text-xs">
            Sources: WHO Guidelines on Physical Activity and Sedentary Behaviour
            (2020), GPAQ Analysis Guide.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-foreground">
            Work Assessment (12% of overall score)
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
            Lifestyle Assessment (15% of overall score)
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Covers four sub-domains: sleep quality (35%), social connection
            (25%), leisure & balance (20%), and substance use habits (20%).
          </p>
          <p>
            Sleep scoring follows Pittsburgh Sleep Quality Index principles
            with WHO recommendations of 7-9 hours for adults. Includes
            assessment of sleep duration, quality, difficulty, and schedule
            consistency.
          </p>
          <p>
            Social connection scoring based on Holt-Lunstad meta-analyses
            (2010, 2015) showing social isolation increases mortality risk by
            29%. Leisure assessment covers screen time, outdoor exposure, and
            hobby engagement.
          </p>
          <p className="text-xs">
            Sources: PSQI, WHO Sleep Guidelines, Holt-Lunstad et al. (2010,
            2015), WHO/CDC substance use evidence.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-foreground">
            Mental Health Screening (20% of overall score)
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
            The overall score is a weighted composite: Mental Health 18%,
            Body Composition 16%, Diet 15%, Lifestyle 14%, Exercise 12%,
            Work 11%, Air Quality 7%, Water Quality 7%. Only completed modules
            contribute to the score, with weights re-normalized among them.
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
