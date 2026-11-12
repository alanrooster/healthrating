/**
 * The assessment state kept in the browser (localStorage). It is read back on every visit and can
 * be stale, truncated or edited, so it is treated as untrusted input: only well-formed parts are
 * restored.
 */
import type { ModuleScore } from "@/lib/health-score"

export const SAVED_STATE_KEY = "health-hub-state-v1"

/**
 * True for plain objects. The type argument names the shape the caller expects; only "is an
 * object" is checked, so fields are still read defensively where they are used.
 */
export function isRecord<T extends object = Record<string, unknown>>(value: unknown): value is T {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

/** A saved module score, or undefined when it is missing or malformed */
export function readModuleScore(value: unknown, label: string): ModuleScore | undefined {
  if (!isRecord(value)) return undefined
  const { score, completed } = value
  if (typeof score !== "number" || !Number.isFinite(score) || typeof completed !== "boolean") return undefined
  return { score: Math.min(100, Math.max(0, score)), completed, label }
}

/** Forgets every saved answer and result */
export function clearSavedState() {
  try {
    localStorage.removeItem(SAVED_STATE_KEY)
  } catch {
    // Storage is unavailable, so there is nothing saved to clear
  }
}
