"use client"

import {
  Activity,
  BarChart3,
  Brain,
  Briefcase,
  Cloud,
  Dna,
  Droplets,
  Dumbbell,
  Ear,
  Heart,
  HeartHandshake,
  House,
  Info,
  Leaf,
  Moon,
  ShieldCheck,
  Smile,
  UtensilsCrossed,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import type { HealthScores } from "@/lib/health-score"

interface AppSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
  scores: HealthScores
  carbonCompleted?: boolean
  carbonScore?: number
}

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "body", label: "Body Composition", icon: Activity },
  { id: "air", label: "Air Quality", icon: Cloud },
  { id: "water", label: "Water Quality", icon: Droplets },
  { id: "diet", label: "Diet Assessment", icon: UtensilsCrossed },
  { id: "exercise", label: "Exercise", icon: Dumbbell },
  { id: "work", label: "Work", icon: Briefcase },
  { id: "lifestyle", label: "Lifestyle", icon: Moon },
  { id: "mental", label: "Mental Health", icon: Brain },
  { id: "family", label: "Family History", icon: Dna },
  { id: "preventive", label: "Preventive Care", icon: ShieldCheck },
  { id: "senses", label: "Senses & Oral Health", icon: Ear },
  { id: "lifecontext", label: "Life Context", icon: HeartHandshake },
  { id: "personality", label: "Personality & Outlook", icon: Smile },
  { id: "home", label: "Home Environment", icon: House },
]

const EXTRAS_ITEMS = [
  { id: "carbon", label: "Carbon Footprint", icon: Leaf },
]

function getScoreBadgeClass(score: number): string {
  if (score >= 85) return "bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]"
  if (score >= 70) return "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
  if (score >= 50) return "bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))]"
  return "bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]"
}

export function AppSidebar({
  activeSection,
  onSectionChange,
  scores,
  carbonCompleted,
  carbonScore,
}: AppSidebarProps) {
  const { isMobile, setOpenMobile } = useSidebar()

  function handleSectionChange(section: string) {
    onSectionChange(section)
    if (isMobile) {
      setOpenMobile(false)
    }
  }
  const scoreMap: Record<string, { score: number; completed: boolean }> = {
    body: scores.body,
    air: scores.airQuality,
    water: scores.waterQuality,
    diet: scores.diet,
    exercise: scores.exercise,
    work: scores.work,
    lifestyle: scores.lifestyle,
    mental: scores.mentalHealth,
    family: scores.familyHistory,
    preventive: scores.preventiveCare,
    senses: scores.sensesOral,
    lifecontext: scores.lifeContext,
    personality: scores.personality,
    home: scores.homeEnvironment,
    carbon: { score: carbonScore ?? 0, completed: carbonCompleted ?? false },
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border px-4 py-4">
        <button
          type="button"
          onClick={() => handleSectionChange("dashboard")}
          className="flex items-center gap-3 text-left"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Heart className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground">
              Health Calculator
            </span>
            <span className="text-xs text-muted-foreground">
              Comprehensive Assessment
            </span>
          </div>
        </button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Assessments</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id
                const moduleScore = scoreMap[item.id]
                const Icon = item.icon

                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => handleSectionChange(item.id)}
                      tooltip={item.label}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                    {moduleScore?.completed && (
                      <SidebarMenuBadge
                        className={`${getScoreBadgeClass(moduleScore.score)} rounded-full px-2 text-xs font-bold`}
                      >
                        {moduleScore.score}
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Extras</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {EXTRAS_ITEMS.map((item) => {
                const isActive = activeSection === item.id
                const moduleScore = scoreMap[item.id]
                const Icon = item.icon

                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => handleSectionChange(item.id)}
                      tooltip={item.label}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                    {moduleScore?.completed && (
                      <SidebarMenuBadge
                        className={`${getScoreBadgeClass(moduleScore.score)} rounded-full px-2 text-xs font-bold`}
                      >
                        {moduleScore.score}
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        <button
          type="button"
          onClick={() => handleSectionChange("methodology")}
          className="flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <Info className="h-3.5 w-3.5" />
          <span>Methodology & Sources</span>
        </button>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
