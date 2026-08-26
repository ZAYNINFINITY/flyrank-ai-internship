import { Nav } from "@/components/primitives/nav";

export function OperationalRoom() {
  return (
    <main className="min-h-[100dvh] bg-background">
      <Nav />

      {/* ── 01 · Hero ───────────────────────────────────── */}
      <section className="px-6 pt-16 pb-20 sm:px-8 md:px-12">
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
            AI curates the experience. Your portfolio at{" "}
            <a
              href="https://zainportfoli0.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text/70 underline underline-offset-2 transition-colors duration-200 hover:text-text"
            >
              zainportfoli0.netlify.app
            </a>{" "}
            is the public face. This is the engine room.
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

      {/* ── 02 · The Story ───────────────────────────────── */}
      <section className="px-6 pb-20 sm:px-8 md:px-12">
        <div className="mx-auto max-w-[1120px]">
          <div className="border-t border-text/10 pt-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text/40 mb-10">
              The Story
            </p>

            {/* Beat 1 — Ordinary World */}
            <div className="max-w-[720px]">
              <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent mb-3">
                01 · The Problem
              </p>
              <h2 className="font-heading text-[22px] font-medium text-text md:text-[28px] leading-snug">
                Every developer portfolio looks the same.
              </h2>
              <p className="mt-4 font-body text-[15px] leading-relaxed text-text/50">
                Card grids. Thumbnail clusters. Identical layouts. Projects
                compressed into tiny boxes fighting for attention, with no room
                to tell the story behind what was built. I had four real
                projects — a real-time collab platform, a live e-commerce
                site, a browser extension, a POS system — and they all
                deserved better than a list.
              </p>
            </div>

            {/* Beat 2 — Call to Adventure */}
            <div className="max-w-[720px] mt-12">
              <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent mb-3">
                02 · The Idea
              </p>
              <h2 className="font-heading text-[22px] font-medium text-text md:text-[28px] leading-snug">
                What if projects had rooms, not cards?
              </h2>
              <p className="mt-4 font-body text-[15px] leading-relaxed text-text/50">
                A foyer is the entrance hall of a museum. It sets the tone for
                everything that follows. I wanted to build that — a place where
                each project gets a dedicated 3D space with architectural
                presence. A scrollable corridor, exhibit frames with a
                sketch-to-paint reveal shader, an AI curator that answers
                questions about what&apos;s on display. Not a portfolio. A museum.
              </p>
            </div>

            {/* Beat 3 — The Ordeal */}
            <div className="max-w-[720px] mt-12">
              <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent mb-3">
                03 · What Broke
              </p>
              <h2 className="font-heading text-[22px] font-medium text-text md:text-[28px] leading-snug">
                The 3D-to-2D seam nearly killed the project.
              </h2>
              <p className="mt-4 font-body text-[15px] leading-relaxed text-text/50">
                Getting a Three.js scene and a flat React component to render
                the same content — same data, same interactions, same feel —
                without one becoming a degraded copy of the other. The first
                attempt was an orbit diorama that felt like a toy. The second
                attempt worked because the 2D path became a first-class
                citizen, not a fallback. Capability detection at mount time
                decides which renderer to use. Both consume the same data
                layer. Making that seam invisible was the hardest architectural
                decision in the project.
              </p>
            </div>

            {/* Beat 4 — The Return */}
            <div className="max-w-[720px] mt-12">
              <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent mb-3">
                04 · What shipped
              </p>
              <h2 className="font-heading text-[22px] font-medium text-text md:text-[28px] leading-snug">
                A working museum, not a demo.
              </h2>
              <p className="mt-4 font-body text-[15px] leading-relaxed text-text/50">
                74 tests passing. Lighthouse 99.25 average. AI curator powered
                by Gemini Flash. Custom GLSL reveal shader. Accessible 2D
                fallback for screen readers. Deployed on Vercel with CI/CD.
                Rate limiting, input validation, error states verified,
                rollback plan documented. This isn&apos;t a class artifact.
                It&apos;s a product.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 03 · What AI Does ────────────────────────────── */}
      <section className="px-6 pb-20 sm:px-8 md:px-12">
        <div className="mx-auto max-w-[1120px]">
          <div className="border-t border-text/10 pt-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text/40 mb-2">
              Where AI Does the Heavy Lifting
            </p>
            <p className="font-body text-[14px] text-text/30 mb-10 max-w-[600px]">
              One thing AI did that I couldn&apos;t have done alone: it manages
              the museum experience — from curating exhibits to detecting
              device capability to generating the reveal effect.
            </p>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <AiCard
                number="01"
                title="AI Curator"
                body="Gemini Flash via OpenRouter with a custom exhibitLookup tool. Visitors ask questions — AI pulls live data from the repository and responds. The engineering was in the tool schema, not the prompt. A good schema means the model feels smart."
                cta={{ label: "Try it", href: "/assistant" }}
              />
              <AiCard
                number="02"
                title="Capability Detection"
                body="Checks WebGL2, prefers-reduced-motion, memory, and pointer type at mount time. Powerful devices get the 3D museum. Everything else gets this 2D operational view — same data, full access. No degraded fallback."
                cta={{ label: "View source", href: "https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/renderer/capability.ts" }}
              />
              <AiCard
                number="03"
                title="Reveal Shader"
                body="Custom GLSL injected into Three.js via onBeforeCompile. Exhibits start as pencil sketches, dissolve into finished pieces as you approach. 77 lines of shader code. The signature visual effect."
                cta={{ label: "View source", href: "https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-03/app/lib/three/reveal-material.ts" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 04 · Projects ────────────────────────────────── */}
      <section className="px-6 pb-20 sm:px-8 md:px-12">
        <div className="mx-auto max-w-[1120px]">
          <div className="border-t border-text/10 pt-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text/40 mb-2">
              What I Built
            </p>
            <p className="font-body text-[14px] text-text/30 mb-10 max-w-[600px]">
              Each project exists in two places: your portfolio and the museum.
              Same work, different presentation.
            </p>

            <div className="rounded-[3px] border border-text/10 divide-y divide-text/10">
              <ProjectRow
                title="Collaborative Workspace"
                stack="MERN · Socket.io · OAuth 2.0"
                description="Real-time collaboration platform with live chat, Kanban boards, and multi-user document editing."
                museumHref="/exhibit/zayn#collaborative-workspace"
              />
              <ProjectRow
                title="POS-it"
                stack="Electron · React · SQLite"
                description="Professional offline point-of-sale system with inventory, invoicing, and auto-updates."
                museumHref="/exhibit/zayn#pos-it"
              />
              <ProjectRow
                title="ZSE Store"
                stack="React · Node.js · MySQL"
                description="Live e-commerce site with product catalog, brand filtering, and WhatsApp order integration."
                museumHref="/exhibit/zayn#zse-store"
              />
              <ProjectRow
                title="ScrollStreak"
                stack="Chrome Extension · JavaScript"
                description="Instagram Reels tracker with friend duels, leaderboards, and weekly Wrapped stats."
                museumHref="/exhibit/zayn#scrollstreak"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 05 · Honest Numbers ──────────────────────────── */}
      <section className="px-6 pb-20 sm:px-8 md:px-12">
        <div className="mx-auto max-w-[1120px]">
          <div className="border-t border-text/10 pt-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text/40 mb-10">
              Honest Numbers
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatCard label="Exhibits" value="1" note="1 developer, 4 projects" />
              <StatCard label="Tests" value="74/74" note="all passing" />
              <StatCard label="Lighthouse" value="99.25" note="average across 4 routes" />
              <StatCard label="Shader" value="77 lines" note="custom GLSL" />
            </div>
          </div>
        </div>
      </section>

      {/* ── 06 · Honest Limitations ──────────────────────── */}
      <section className="px-6 pb-20 sm:px-8 md:px-12">
        <div className="mx-auto max-w-[1120px]">
          <div className="border-t border-text/10 pt-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text/40 mb-10">
              Honest Limitations
            </p>
            <div className="max-w-[720px] space-y-6">
              <Limitation
                text="3D canvas has no ARIA labels — screen readers can't navigate the museum. The 2D fallback provides full accessibility."
              />
              <Limitation
                text="No physical device testing — all testing done via DevTools mobile simulation. Real device testing is the next step."
              />
              <Limitation
                text="No external error tracking — Sentry not wired yet. Monitoring is manual via Vercel dashboard."
              />
              <Limitation
                text="Portfolio is on a Vercel subdomain, not a custom domain. Works, but a custom domain would feel more permanent."
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 07 · What's Next ─────────────────────────────── */}
      <section className="px-6 pb-20 sm:px-8 md:px-12">
        <div className="mx-auto max-w-[1120px]">
          <div className="border-t border-text/10 pt-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text/40 mb-10">
              What&apos;s Next
            </p>
            <div className="max-w-[720px]">
              <p className="font-heading text-[18px] font-medium text-text">
                Next case study: Collaborative Workspace
              </p>
              <p className="mt-3 font-body text-[15px] leading-relaxed text-text/50">
                It&apos;s already built — real-time MERN app with Socket.io,
                Kanban, OAuth. Needs to be exhibited in Foyer. Steps
                documented in the roadmap. Reminder set: September 15, 2026.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="https://github.com/ZAYNINFINITY/flyrank-ai-internship/blob/main/week-08/plan-to-keep-building.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center justify-center rounded-[3px] border border-text/15 bg-transparent px-5 py-2 font-body text-[13px] text-text/60 transition-colors duration-200 hover:border-text/30 hover:text-text"
                >
                  Read the Roadmap ↗
                </a>
                <a
                  href="https://github.com/ZAYNINFINITY/flyrank-ai-internship/issues/17"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center justify-center rounded-[3px] border border-text/15 bg-transparent px-5 py-2 font-body text-[13px] text-text/60 transition-colors duration-200 hover:border-text/30 hover:text-text"
                >
                  Issue #17 ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 08 · Routes ──────────────────────────────────── */}
      <section className="px-6 pb-20 sm:px-8 md:px-12">
        <div className="mx-auto max-w-[1120px]">
          <div className="border-t border-text/10 pt-12">
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
        </div>
      </section>

      {/* ── 09 · Stack ───────────────────────────────────── */}
      <section className="px-6 pb-20 sm:px-8 md:px-12">
        <div className="mx-auto max-w-[1120px]">
          <div className="border-t border-text/10 pt-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text/40 mb-6">
              Stack
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "React", "TypeScript", "Tailwind CSS", "Vite",
                "Next.js", "Node.js", "Express.js", "Socket.io",
                "MongoDB", "MySQL", "SQLite",
                "Three.js", "GLSL", "React Three Fiber",
                "AI SDK", "OpenRouter", "Gemini Flash",
                "Git", "GitHub Actions", "Vercel",
                "OAuth 2.0", "JWT", "Zod",
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

function AiCard({
  number,
  title,
  body,
  cta,
}: {
  number: string;
  title: string;
  body: string;
  cta: { label: string; href: string };
}) {
  return (
    <div className="rounded-[3px] border border-text/10 p-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
        {number}
      </p>
      <p className="mt-3 font-heading text-[16px] font-medium text-text">
        {title}
      </p>
      <p className="mt-3 font-body text-[14px] leading-relaxed text-text/50">
        {body}
      </p>
      <a
        href={cta.href}
        target={cta.href.startsWith("http") ? "_blank" : undefined}
        rel={cta.href.startsWith("http") ? "noopener noreferrer" : undefined}
        className="mt-4 inline-block font-body text-[13px] text-text/40 transition-colors duration-200 hover:text-text/70"
      >
        {cta.label} →
      </a>
    </div>
  );
}

function ProjectRow({
  title,
  stack,
  description,
  museumHref,
}: {
  title: string;
  stack: string;
  description: string;
  museumHref: string;
}) {
  return (
    <div className="flex items-start gap-4 px-6 py-5">
      <div className="flex-1 min-w-0">
        <p className="font-heading text-[15px] font-medium text-text">
          {title}
        </p>
        <p className="font-mono text-[12px] text-text/30 mt-0.5">
          {stack}
        </p>
        <p className="font-body text-[14px] text-text/40 mt-2">
          {description}
        </p>
      </div>
      <a
        href={museumHref}
        className="flex-shrink-0 mt-1 font-body text-[12px] text-text/30 transition-colors duration-200 hover:text-text/60"
      >
        Museum →
      </a>
    </div>
  );
}

function StatCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-[3px] border border-text/10 px-5 py-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-text/40">
        {label}
      </p>
      <p className="mt-2 font-heading text-[22px] font-medium text-text">
        {value}
      </p>
      <p className="mt-1 font-body text-[12px] text-text/30">
        {note}
      </p>
    </div>
  );
}

function Limitation({ text }: { text: string }) {
  return (
    <div className="flex gap-3">
      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-text/15" />
      <p className="font-body text-[14px] leading-relaxed text-text/45">
        {text}
      </p>
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
