"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { clearSavedState } from "@/lib/saved-state"

export default function RouteError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  function clearAnswersAndReload() {
    clearSavedState()
    window.location.reload()
  }

  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col items-start justify-center gap-4 p-6">
      <h1 className="text-2xl font-bold text-foreground text-balance">Something went wrong</h1>
      <p className="text-sm leading-relaxed text-muted-foreground">
        The page could not be displayed. Try again first. If the error comes back, the answers saved in this
        browser may come from an older version of the site: clearing them lets you start again.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => retry()}>Try again</Button>
        <Button variant="outline" onClick={clearAnswersAndReload}>
          Clear saved answers
        </Button>
      </div>
    </main>
  )
}
