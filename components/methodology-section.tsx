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
            Overall Health Score
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            The overall score is a weighted composite: Body Composition 30%,
            Diet 30%, Exercise 25%, Air Quality 15%. Only completed modules
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
