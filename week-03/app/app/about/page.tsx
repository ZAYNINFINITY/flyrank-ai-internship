export default function AboutPage() {
  return (
    <section className="min-h-[100dvh] px-6 py-24 sm:px-8 md:px-12">
      <div className="mx-auto max-w-[640px]">
        <h1 className="font-heading text-[28px] font-medium text-text md:text-[36px]">
          About Foyer
        </h1>

        <div className="mt-8 space-y-6 font-body text-[16px] leading-relaxed text-text/60">
          <p>
            Foyer is an open digital museum for developers. Most developer
            portfolios compress years of work into identical card grids — tiny
            thumbnails fighting for attention, with no room to tell the story
            behind what was built. Foyer gives every project its own space.
          </p>
          <p>
            The name comes from architecture: a foyer is the entrance hall of a
            museum. It sets the tone for everything that follows — that&apos;s what Foyer does for your
            projects.
          </p>
          <p>
            Any developer can exhibit their work. Create a profile, curate
            collections, and build a public gallery that reflects how you
            actually think about your craft.
          </p>
          <p>
            Foyer is open-source because the best platforms for showing
            creative work are built by the community that uses them. If you want
            to contribute, fix something, or just see how it works — the repo is
            open.
          </p>
        </div>

        <div className="mt-12">
          <a
            href="https://github.com/ZAYNINFINITY/flyrank-ai-internship"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[3px] border border-text/15 bg-transparent px-8 py-3 font-body text-sm font-medium text-text transition-colors duration-200 hover:border-text/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            View on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
