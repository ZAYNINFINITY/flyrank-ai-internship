import { Nav } from "@/components/primitives/nav";

export function OperationalRoom() {
  return (
    <main className="min-h-[100dvh] bg-background">
      <Nav />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="px-6 pt-16 pb-16 sm:px-8 md:px-12">
        <div className="mx-auto max-w-[1120px]">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-block h-2 w-2 rounded-full bg-accent animate-pulse" />
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text/40">
              Foyer · Engine Room
            </p>
          </div>
          <h1 className="font-heading text-[32px] font-medium text-text md:text-[44px]">
            Zain Ul Abideen
          </h1>
          <p className="mt-2 font-heading text-[17px] text-text/50">
            CS Student @ PAF-IAST · MERN Stack Developer
          </p>
          <p className="mt-6 max-w-[640px] font-body text-[15px] leading-relaxed text-text/50">
            This is the operational view behind Foyer — the 3D museum where
            developers exhibit their work as gallery rooms, not card grids.
            AI curates the experience: it pulls exhibit data, answers visitor
            questions, and manages what each room shows. Your portfolio at
            <a
              href="https://zainportfoli0.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-1 text-text/70 underline underline-offset-2 transition-colors duration-200 hover:text-text"
            >
              zainportfoli0.netlify.app
            </a>
            is the public face. This is the engine that powers the museum.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="https://zainportfoli0.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center justify-center rounded-[3px] border border-text/20 bg-transparent px-6 py-2.5 font-body text-sm text-text transition-colors duration-200 hover:border-text/40"
            >
              Portfolio ↗
            </a>
            <a
              href="/exhibit/zayn"
              className="inline-flex min-h-[44px] items-center justify-center rounded-[3px] border border-text/20 bg-transparent px-6 py-2.5 font-body text-sm text-text transition-colors duration-200 hover:border-text/40"
            >
              View in Museum →
            </a>
            <a
              href="/assistant"
              className="inline-flex min-h-[44px] items-center justify-center rounded-[3px] border border-accent/30 bg-accent/5 px-6 py-2.5 font-body text-sm text-accent transition-colors duration-200 hover:border-accent/50 hover:bg-accent/10"
            >
              Talk to AI Curator →
            </a>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────── */}
      <section className="px-6 pb-12 sm:px-8 md:px-12">
        <div className="mx-auto max-w-[1120px]">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Exhibits" value="1" />
            <StatCard label="Projects" value="4" />
            <StatCard label="Tests" value="74/74" />
            <StatCard label="Lighthouse" value="99.25" />
          </div>
        </div>
      </section>

      {/* ── How AI Manages Everything ─────────────────────── */}
      <section className="px-6 pb-12 sm:px-8 md:px-12">
        <div className="mx-auto max-w-[1120px]">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text/40 mb-6">
            How AI Manages This Museum
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-[3px] border border-text/10 p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
                01 · Curator
              </p>
              <p className="mt-3 font-heading text-[16px] font-medium text-text">
                AI answers questions about exhibits
              </p>
              <p className="mt-2 font-body text-[14px] leading-relaxed text-text/50">
                Gemini Flash via OpenRouter with a custom
                <code className="mx-1 rounded bg-text/5 px-1 py-0.5 font-mono text-[12px] text-text/60">
                  exhibitLookup
                </code>
                tool. Visitors ask — AI pulls live data from the repository layer
                and responds. The engineering was in the schema, not the prompt.
              </p>
              <a
                href="/assistant"
                className="mt-4 inline-block font-body text-[13px] text-text/40 transition-colors duration-200 hover:text-text/70"
              >
                Try it →
              </a>
            </div>
            <div className="rounded-[3px] border border-text/10 p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
                02 · Renderer
              </p>
              <p className="mt-3 font-heading text-[16px] font-medium text-text">
                AI detects your device, picks the right view
              </p>
              <p className="mt-2 font-body text-[14px] leading-relaxed text-text/50">
                Capability detection at mount time checks WebGL2,
                prefers-reduced-motion, memory, and pointer type.
                Powerful devices get the 3D museum. Everything else
                gets this 2D operational view — same data, full access.
              </p>
              <a
                href="https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/renderer/capability.ts"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block font-body text-[13px] text-text/40 transition-colors duration-200 hover:text-text/70"
              >
                View source →
              </a>
            </div>
            <div className="rounded-[3px] border border-text/10 p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
                03 · Shader
              </p>
              <p className="mt-3 font-heading text-[16px] font-medium text-text">
                AI-shaped visual effect — sketch to paint
              </p>
              <p className="mt-2 font-body text-[14px] leading-relaxed text-text/50">
                Custom GLSL injected into Three.js via
                <code className="mx-1 rounded bg-text/5 px-1 py-0.5 font-mono text-[12px] text-text/60">
                  onBeforeCompile
                </code>
                . Exhibits start as pencil sketches, dissolve into finished
                pieces as you approach. 77 lines of shader code.
              </p>
              <a
                href="https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/three/reveal-material.ts"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block font-body text-[13px] text-text/40 transition-colors duration-200 hover:text-text/70"
              >
                View source →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Projects — Portfolio ↔ Museum bridge ──────────── */}
      <section className="px-6 pb-12 sm:px-8 md:px-12">
        <div className="mx-auto max-w-[1120px]">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text/40 mb-2">
            What I Built · Portfolio ↔ Museum
          </p>
          <p className="font-body text-[14px] text-text/30 mb-6">
            Each project exists in two places: your portfolio and the museum.
            Same work, different presentation.
          </p>
          <div className="rounded-[3px] border border-text/10 divide-y divide-text/10">
            <ProjectRow
              title="Collaborative Workspace"
              stack="MERN · Socket.io · OAuth 2.0"
              museumHref="/exhibit/zayn#collaborative-workspace"
              portfolioHref="https://zainportfoli0.netlify.app"
            />
            <ProjectRow
              title="POS-it"
              stack="Electron · React · SQLite"
              museumHref="/exhibit/zayn#pos-it"
              portfolioHref="https://zainportfoli0.netlify.app"
            />
            <ProjectRow
              title="ZSE Store"
              stack="React · Node.js · MySQL"
              museumHref="/exhibit/zayn#zse-store"
              portfolioHref="https://zainportfoli0.netlify.app"
            />
            <ProjectRow
              title="ScrollStreak"
              stack="Chrome Extension · JavaScript"
              museumHref="/exhibit/zayn#scrollstreak"
              portfolioHref="https://zainportfoli0.netlify.app"
            />
          </div>
        </div>
      </section>

      {/* ── Stack ─────────────────────────────────────────── */}
      <section className="px-6 pb-12 sm:px-8 md:px-12">
        <div className="mx-auto max-w-[1120px]">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text/40 mb-6">
            Stack
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "React", "TypeScript", "Tailwind CSS", "Vite",
              "Node.js", "Express.js", "Socket.io",
              "MongoDB", "MySQL", "SQLite",
              "Git", "GitHub Actions", "OAuth 2.0", "JWT",
              "Three.js", "GLSL", "Next.js",
            ].map((skill) => (
              <span
                key={skill}
                className="rounded-[3px] border border-text/10 px-3 py-1.5 font-mono text-[12px] text-text/50"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Museum Routes ─────────────────────────────────── */}
      <section className="px-6 pb-12 sm:px-8 md:px-12">
        <div className="mx-auto max-w-[1120px]">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text/40 mb-6">
            Museum Routes
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <RouteCard tag="CATALOG" label="Exhibit Catalog" href="/explore" />
            <RouteCard tag="LIVE" label="My Exhibit" href="/exhibit/zayn" />
            <RouteCard tag="AI" label="AI Curator" href="/assistant" />
            <RouteCard tag="INFO" label="About Foyer" href="/about" />
            <RouteCard tag="3D" label="Museum Entrance" href="/entrance" />
            <RouteCard tag="3D" label="Collection" href="/collection" />
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="px-6 pb-12 sm:px-8 md:px-12">
        <div className="mx-auto max-w-[1120px] border-t border-text/10 pt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-body text-[13px] text-text/30">
                Foyer · Open digital museum for developers
              </p>
              <p className="font-mono text-[11px] text-text/20 mt-1">
                Built by ZAYNINFINITY · AI Fluency + Frontend AI Engineering
              </p>
            </div>
            <div className="flex gap-6">
              <a
                href="https://github.com/ZAYNINFINITY/flyrank-ai-internship"
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-[13px] text-text/30 transition-colors duration-200 hover:text-text/60"
              >
                GitHub
              </a>
              <a
                href="https://zainportfoli0.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-[13px] text-text/30 transition-colors duration-200 hover:text-text/60"
              >
                Portfolio
              </a>
              <a
                href="/about"
                className="font-body text-[13px] text-text/30 transition-colors duration-200 hover:text-text/60"
              >
                About
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ── Sub-components ──────────────────────────────────────── */

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[3px] border border-text/10 px-5 py-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-text/40">
        {label}
      </p>
      <p className="mt-2 font-heading text-[22px] font-medium text-text">
        {value}
      </p>
    </div>
  );
}

function ProjectRow({
  title,
  stack,
  museumHref,
  portfolioHref,
}: {
  title: string;
  stack: string;
  museumHref: string;
  portfolioHref: string;
}) {
  return (
    <div className="flex items-center gap-4 px-6 py-4">
      <div className="flex-1 min-w-0">
        <p className="font-heading text-[15px] font-medium text-text truncate">
          {title}
        </p>
        <p className="font-body text-[13px] text-text/40 truncate">
          {stack}
        </p>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <a
          href={portfolioHref}
          target="_blank"
          rel="noopener noreferrer"
          className="font-body text-[12px] text-text/30 transition-colors duration-200 hover:text-text/60"
        >
          Portfolio ↗
        </a>
        <span className="text-text/10">·</span>
        <a
          href={museumHref}
          className="font-body text-[12px] text-text/30 transition-colors duration-200 hover:text-text/60"
        >
          Museum →
        </a>
      </div>
    </div>
  );
}

function RouteCard({
  tag,
  label,
  href,
}: {
  tag: string;
  label: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="group flex items-center justify-between rounded-[3px] border border-text/10 px-5 py-4 transition-colors duration-200 hover:border-text/20"
    >
      <div>
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-text/30">
          {tag}
        </span>
        <p className="mt-1 font-heading text-[15px] font-medium text-text">
          {label}
        </p>
      </div>
      <span className="font-body text-[13px] text-text/20 transition-colors duration-200 group-hover:text-text/50">
        →
      </span>
    </a>
  );
}
