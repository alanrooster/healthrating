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
            Diet Assessment (30% of overall score)
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            10 questions covering key dietary indicators from the WHO Healthy
            Diet Monitoring Initiative (HDMI). Each question scores 0-10 based
            on alignment with WHO dietary recommendations.
          </p>
          <p>
            Key WHO targets: 400g+ fruits and vegetables daily, less than 10%
            energy from free sugars, less than 5g salt per day, and limited
            intake of saturated fats and ultra-processed foods.
          </p>
          <p className="text-xs">
            Sources: WHO Healthy Diet Fact Sheet (2024), WHO HDMI Guidance
            (2024).
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
            Lifestyle Assessment (15% of overall score)
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Covers five sub-domains: work schedule (20%), sleep quality (30%),
            work stress (20%), social connection & work-life balance (15%),
            and substance use habits (15%).
          </p>
          <p>
            Working hours thresholds based on WHO/ILO Joint Estimates (2021)
            showing 55+ hours/week increases stroke risk by 35%. Shift work
            penalties follow IARC Monograph 124 classification of night shift
            as Group 2A (probably carcinogenic).
          </p>
          <p>
            Work stress questions inspired by the Copenhagen Burnout Inventory
            (Kristensen et al. 2005) and Siegrist Effort-Reward Imbalance model.
            Sleep scoring follows Pittsburgh Sleep Quality Index principles.
            Social connection scoring based on Holt-Lunstad meta-analyses (2010,
            2015).
          </p>
          <p className="text-xs">
            Sources: WHO/ILO (2021), IARC Monograph 124 (2019), CBI (2005),
            ERI Model (Siegrist 1996), PSQI, Holt-Lunstad et al. (2010, 2015),
            WHO Guidelines on Mental Health at Work (2022).
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
            Overall Health Score
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            The overall score is a weighted composite: Body Composition 20%,
            Mental Health 20%, Diet 20%, Exercise 15%, Lifestyle 15%,
            Air Quality 10%. Only completed modules contribute to the score,
            with weights re-normalized among them.
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
