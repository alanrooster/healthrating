import Link from "next/link"
import { ArrowUpRight, BookOpenCheck, GitBranch, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

const PROJECT_URL = "https://github.com/alanrooster/healthrating"
const CODE_LICENSE_URL = `${PROJECT_URL}/blob/main/LICENSE`
const CONTENT_LICENSE_URL = "https://creativecommons.org/licenses/by-nc-sa/4.0/"

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-border">
      <div className="grid gap-8 py-8 md:grid-cols-[1.2fr_1fr_1fr] md:gap-10">
        <div className="flex flex-col items-start gap-3">
          <Link href="/" className="flex items-center gap-2 font-mono text-sm font-bold text-foreground">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Heart aria-hidden="true" />
            </span>
            healthrating.org
          </Link>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Free, private health assessments grounded in research. Your answers stay in your browser.
          </p>
          <p className="text-xs text-muted-foreground">
            Made by{" "}
            <a
              href="https://alangallicchio.com"
              target="_blank"
              rel="author noopener noreferrer"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Alan Gallicchio
            </a>
          </p>
        </div>

        <nav aria-label="Project" className="flex flex-col items-start gap-3">
          <h2 className="text-sm font-semibold text-foreground">Explore</h2>
          <Link href="/methodology" className="inline-flex items-center gap-2 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
            <BookOpenCheck aria-hidden="true" />
            Methodology &amp; sources
          </Link>
          <a
            href={PROJECT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            <GitBranch aria-hidden="true" />
            Source code on GitHub
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <a
            href={`${PROJECT_URL}/issues/new`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Report an issue
            <ArrowUpRight aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </nav>

        <div className="flex flex-col items-start gap-3">
          <h2 className="text-sm font-semibold text-foreground">Open source &amp; licenses</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The application code is free and open source under the GNU Affero General Public License, version 3. Contributions are welcome.
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <a
              href={CODE_LICENSE_URL}
              target="_blank"
              rel="license noopener noreferrer"
              className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
            >
              AGPL-3.0 license
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a
              href={CONTENT_LICENSE_URL}
              target="_blank"
              rel="license noopener noreferrer"
              className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
            >
              Content: CC BY-NC-SA 4.0
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-border py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} HealthRating.org. Code and educational content have separate licenses.
        </p>
        <Button asChild variant="outline" size="sm">
          <a href={PROJECT_URL} target="_blank" rel="noopener noreferrer">
            <GitBranch data-icon="inline-start" />
            Contribute on GitHub
            <ArrowUpRight data-icon="inline-end" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </Button>
      </div>
    </footer>
  )
}
