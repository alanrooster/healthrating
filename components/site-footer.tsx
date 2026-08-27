export function SiteFooter() {
  return (
    <footer className="mt-10 border-t border-border pt-6 pb-2">
      <p className="text-center text-xs leading-relaxed text-muted-foreground">
        <a
          href="https://healthrating.org"
          className="font-medium text-foreground hover:underline"
        >
          healthrating.org
        </a>{" "}
        by{" "}
        <a
          href="https://alangallicchio.com"
          target="_blank"
          rel="author noopener noreferrer"
          className="font-medium text-foreground hover:underline"
        >
          Alan Gallicchio
        </a>{" "}
        is licensed under{" "}
        <a
          href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
          target="_blank"
          rel="license noopener noreferrer"
          className="font-medium text-foreground hover:underline"
        >
          CC BY-NC-SA 4.0
        </a>
      </p>
    </footer>
  )
}
