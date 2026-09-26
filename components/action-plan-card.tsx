import { ListChecks } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ActionItem } from "@/lib/insights-calculator"

interface ActionPlanCardProps {
  items: ActionItem[]
  onSelect: (module: ActionItem["module"]) => void
}

export function ActionPlanCard({ items, onSelect }: ActionPlanCardProps) {
  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <ListChecks aria-hidden="true" className="h-5 w-5 text-primary" />
          Your Action Plan
        </CardTitle>
        <CardDescription className="text-xs">
          Your highest-impact improvements, ranked by room to improve and weight in your overall score.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-xs text-muted-foreground">Complete more assessments to receive personalized actions.</p>
        ) : (
          <ol className="grid gap-2 lg:grid-cols-3">
            {items.map((item, idx) => (
              <li key={item.module} className="flex">
                <button
                  type="button"
                  onClick={() => onSelect(item.module)}
                  className="flex w-full items-start gap-2 rounded-md border border-border p-3 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground"
                  >
                    {idx + 1}
                  </span>
                  <span className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold text-foreground">
                      {item.label} ({item.currentScore}/100)
                    </span>
                    <span className="text-[11px] leading-snug text-muted-foreground">{item.recommendation}</span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  )
}
